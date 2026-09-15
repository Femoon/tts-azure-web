// This runs with write permissions: only trusted base-branch code may load it.
module.exports = async function enableAutoMerge({ github, context, core, updates }) {
  const skip = reason => core.info(`Manual review required: ${reason}`)
  const { owner, repo } = context.repo
  const expected = context.payload.pull_request
  const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: expected.number })
  if (pr.state !== 'open' || pr.draft || pr.user.login !== 'dependabot[bot]' ||
      pr.head.repo?.full_name !== `${owner}/${repo}` || pr.base.ref !== 'main' ||
      pr.head.sha !== expected.head.sha) return skip('PR identity or head changed')

  // Re-evaluate eligibility after every new push, including previously enabled PRs.
  if (pr.auto_merge) {
    await github.graphql(`mutation($id: ID!) {
      disablePullRequestAutoMerge(input: { pullRequestId: $id }) { pullRequest { number } }
    }`, { id: pr.node_id })
  }
  if (updates.length !== 1) return skip('expected one dependency update')
  const update = updates[0]
  const version = value => /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value || '')
  const before = version(update.prevVersion)
  const after = version(update.newVersion)
  if (update.packageEcosystem !== 'npm_and_yarn' || update.directory !== '/' ||
      update.targetBranch !== 'main' || update.maintainerChanges || update.dependencyGroup ||
      update.updateType !== 'version-update:semver-patch' || !before || !after ||
      before[1] !== after[1] || before[2] !== after[2] || BigInt(after[3]) <= BigInt(before[3])) {
    return skip('only stable npm patch upgrades without maintainer changes are eligible')
  }

  const files = await github.paginate(github.rest.pulls.listFiles, {
    owner, repo, pull_number: pr.number, per_page: 100,
  })
  if (!files.length || files.some(file =>
    !['package.json', 'yarn.lock'].includes(file.filename) || file.status !== 'modified')) {
    return skip('changes outside the dependency manifest and lockfile')
  }

  // Public reviewed advisories need no personal token or Dependabot alert permission.
  const advisories = async version => github.paginate('GET /advisories', {
    ecosystem: 'npm', affects: `${update.dependencyName}@${version}`,
    type: 'reviewed', per_page: 100,
  })
  const oldAlerts = await advisories(update.prevVersion)
  const newAlerts = await advisories(update.newVersion)
  if (!oldAlerts.some(alert => !alert.withdrawn_at) || newAlerts.some(alert => !alert.withdrawn_at)) {
    return skip('no confirmed vulnerability fix, or the new version is still vulnerable')
  }

  // GitHub enforces the required quality check and an up-to-date branch before merging.
  // expectedHeadOid rejects a PR updated after the checks above.
  await github.graphql(`mutation($id: ID!, $head: GitObjectID!) {
    enablePullRequestAutoMerge(input: {
      pullRequestId: $id, expectedHeadOid: $head, mergeMethod: SQUASH
    }) { pullRequest { number } }
  }`, { id: pr.node_id, head: expected.head.sha })
  core.info(`Enabled auto-merge for security patch PR #${pr.number}; required CI still applies.`)
}
