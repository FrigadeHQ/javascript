import { Image } from './Image'
import { Video } from './Video'
import { BoxProps } from '../Box'

export interface MediaProps extends BoxProps {
  src: string
  type?: 'image' | 'video'
}

export function Media({ src, type, ...props }: MediaProps) {
  const Component = type === 'video' ? Video : Image

  return <Component src={src} {...props} />
}
