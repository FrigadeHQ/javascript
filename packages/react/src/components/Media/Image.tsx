import { Box, BoxProps } from '../Box'

export interface ImageProps extends BoxProps {
  src: string
}

export function Image({ part, src, ...props }: ImageProps) {
  return <Box as="img" part={['image', part]} src={src} {...props} />
}
