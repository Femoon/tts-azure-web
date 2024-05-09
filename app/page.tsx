import Content from './content'
import Nav from './nav'
export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col">
      <Nav />
      <Content />
    </main>
  )
}
