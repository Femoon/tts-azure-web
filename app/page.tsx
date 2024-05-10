import Content from './ui/content'
import Nav from './ui/nav'
export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col">
      <Nav />
      <Content />
    </main>
  )
}
