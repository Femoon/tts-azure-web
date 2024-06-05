declare module 'react-collapse' {
  import { ComponentType } from 'react'

  interface CollapseProps {
    isOpened: boolean
    children: React.ReactNode
  }

  export const Collapse: ComponentType<CollapseProps>
}
