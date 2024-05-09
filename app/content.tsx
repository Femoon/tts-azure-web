import { Input } from '@nextui-org/react'
export default function Content() {
  return (
    <div className="grow overflow-y-auto text-wrap">
      <Input type="input" label="Email" placeholder="Enter your email" />
    </div>
  )
}
