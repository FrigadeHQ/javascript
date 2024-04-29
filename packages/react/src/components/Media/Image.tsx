import { Box, BoxProps } from '@/components/Box'

export interface ImageProps extends BoxProps {
  src: string
}

export function Image({ part, src, ...props }: ImageProps) {
  return <Box as="img" maxWidth="unset" part={['image', part]} src={src} {...props} />
}
