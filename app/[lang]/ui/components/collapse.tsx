import { ReactNode, useState } from 'react'
import { Collapse } from 'react-collapse'
import '../../../../styles/collapse.css'

interface CollapseProps {
  title: string
  children: ReactNode
}

const Panel: React.FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const onToggle = () => setIsOpen(s => !s)

  return (
    <div className="my-component">
      <button onClick={onToggle} className="mb-2 p-2 bg-blue-500 text-white rounded">
        {title}
      </button>
      <Collapse isOpened={isOpen}>
        <div>{children}</div>
      </Collapse>
    </div>
  )
}

export default Panel
