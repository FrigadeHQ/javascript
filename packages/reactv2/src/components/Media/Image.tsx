import { Box, BoxProps } from '../Box'

export interface ImageProps extends BoxProps {
  src: string
}

export function Image({ src, ...props }: ImageProps) {
  return <Box as="img" src={src} {...props} />
}
