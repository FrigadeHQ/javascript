import { Image } from './Image'
import { Video, type VideoProps } from './Video'

export interface MediaProps extends VideoProps {
  type?: 'image' | 'video'
}

export function Media({ src, type, ...props }: MediaProps) {
  const Component = type === 'video' ? Video : Image

  return <Component src={src} {...props} />
}
