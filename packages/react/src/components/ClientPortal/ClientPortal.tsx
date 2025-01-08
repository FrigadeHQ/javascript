import { useClientPortal } from '@/hooks/useClientPortal'

export interface ClientPortalProps {
  children?: React.ReactNode
  container?: Parameters<typeof useClientPortal>[1]
}

export function ClientPortal({ children, container = 'body' }: ClientPortalProps) {
  return useClientPortal(children, container)
}
