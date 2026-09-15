const { test } = require('node:test')
const assert = require('node:assert/strict')
const enableAutoMerge = require('./enable-dependabot-auto-merge.cjs')

function fixture() {
  const state = {
    updates: [{ dependencyName: 'example', packageEcosystem: 'npm_and_yarn', directory: '/',
      targetBranch: 'main', updateType: 'version-update:semver-patch', prevVersion: '1.2.3',
      newVersion: '1.2.4', maintainerChanges: false, dependencyGroup: '' }],
    pr: { number: 1, node_id: 'PR_1', state: 'open', draft: false,
      user: { login: 'dependabot[bot]' }, head: { sha: 'abc', repo: { full_name: 'owner/repo' } },
      base: { ref: 'main' } },
    files: [{ filename: 'yarn.lock', status: 'modified' }],
    oldAlerts: [{ ghsa_id: 'GHSA-example', withdrawn_at: null }], newAlerts: [], mutations: [],
  }
  state.run = () => enableAutoMerge({
    context: { repo: { owner: 'owner', repo: 'repo' }, payload: { pull_request: { number: 1, head: { sha: 'abc' } } } },
    updates: state.updates, core: { info() {} },
    github: {
      rest: { pulls: { get: async () => ({ data: state.pr }), listFiles: 'files' } },
      paginate: async (route, args) => {
        if (state.apiError) throw new Error('API unavailable')
        if (route === 'files') return state.files
        assert.equal(route, 'GET /advisories')
        assert.equal(args.type, 'reviewed')
        assert.equal(args.ecosystem, 'npm')
        return args.affects.endsWith('@' + state.updates[0].prevVersion) ? state.oldAlerts : state.newAlerts
      },
      graphql: async (query, variables) => state.mutations.push({ query, variables }),
    },
  })
  return state
}

test('enables squash auto-merge for a verified patch, tied to the exact head', async () => {
  const state = fixture()
  await state.run()
  assert.equal(state.mutations.length, 1)
  assert.deepEqual(state.mutations[0].variables, { id: 'PR_1', head: 'abc' })
  assert.match(state.mutations[0].query, /expectedHeadOid: \$head/)
  assert.match(state.mutations[0].query, /mergeMethod: SQUASH/)
})

const rejected = {
  'ordinary update': s => { s.oldAlerts = [] },
  'withdrawn advisory only': s => { s.oldAlerts[0].withdrawn_at = '2026-01-01' },
  'still vulnerable': s => { s.newAlerts = s.oldAlerts },
  'major upgrade': s => { s.updates[0].newVersion = '2.0.0' },
  'minor upgrade': s => { s.updates[0].newVersion = '1.3.0' },
  '0.x minor upgrade': s => { s.updates[0].prevVersion = '0.2.3'; s.updates[0].newVersion = '0.3.0' },
  'prerelease': s => { s.updates[0].newVersion = '1.2.4-beta.1' },
  'downgrade': s => { s.updates[0].newVersion = '1.2.2' },
  'missing versions': s => { s.updates[0].prevVersion = '' },
  'grouped update': s => { s.updates.push(s.updates[0]) },
  'maintainer change': s => { s.updates[0].maintainerChanges = true },
  'GitHub Actions update': s => { s.updates[0].packageEcosystem = 'github_actions' },
  'source code change': s => { s.files.push({ filename: 'app/api/audio/route.ts', status: 'modified' }) },
  'workflow change': s => { s.files.push({ filename: '.github/workflows/ci.yml', status: 'modified' }) },
  'deleted lockfile': s => { s.files[0].status = 'removed' },
  'stale head': s => { s.pr.head.sha = 'changed' },
  'fork': s => { s.pr.head.repo.full_name = 'someone/repo' },
  'human author': s => { s.pr.user.login = 'human' },
  'draft': s => { s.pr.draft = true },
  'closed PR': s => { s.pr.state = 'closed' },
}
for (const [name, modify] of Object.entries(rejected)) {
  test(`leaves ${name} for manual review`, async () => {
    const state = fixture()
    modify(state)
    await state.run()
    assert.equal(state.mutations.length, 0)
  })
}
test('API failure cannot enable merging', async () => {
  const state = fixture()
  state.apiError = true
  await assert.rejects(state.run(), /API unavailable/)
  assert.equal(state.mutations.length, 0)
})

test('revokes previously enabled auto-merge when a new update is ineligible', async () => {
  const state = fixture()
  state.pr.auto_merge = { merge_method: 'squash' }
  state.updates[0].newVersion = '2.0.0'
  await state.run()
  assert.equal(state.mutations.length, 1)
  assert.match(state.mutations[0].query, /disablePullRequestAutoMerge/)
})
