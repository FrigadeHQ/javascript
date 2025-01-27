import { Box, type BoxProps } from '@/components/Box'

function CheckIcon() {
  return (
    <Box
      as="svg"
      color="primary.foreground"
      fill="none"
      height="8px"
      part="check-icon"
      viewBox="0 0 10 8"
      width="10px"
    >
      <path
        d="M1 4.34664L3.4618 6.99729L3.4459 6.98017L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  )
}

interface CheckIndicatorProps extends BoxProps {
  checked?: boolean
  size?: string
}

export function CheckIndicator({ checked = false, size = '22px', ...props }: CheckIndicatorProps) {
  return (
    <Box
      backgroundColor="inherit"
      borderWidth="md"
      borderStyle="solid"
      borderColor="neutral.border"
      borderRadius="100%"
      padding="0"
      part="check-indicator"
      position="relative"
      height={size}
      width={size}
      {...props}
    >
      {checked && (
        <Box
          alignItems="center"
          bg="green500"
          borderWidth="md"
          borderStyle="solid"
          borderColor="green500"
          borderRadius="100%"
          display="flex"
          height="calc(100% + 2px)"
          justifyContent="center"
          left="-1px"
          part="check-indicator-checked"
          position="absolute"
          top="-1px"
          width="calc(100% + 2px)"
        >
          <CheckIcon />
        </Box>
      )}
    </Box>
  )
}
