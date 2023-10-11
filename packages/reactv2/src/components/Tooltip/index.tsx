import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { Box } from '../Box'
import { Button } from '../Button'
import { Text } from '../Text'

export function Tooltip() {
  // TEMP: Mock data
  const { title, subtitle, primaryButtonTitle } = {
    title: 'Hello world',
    subtitle: 'Very cool to meet you.',
    primaryButtonTitle: "Let's do this!",
  }
  return (
    <Popover.Root defaultOpen={true}>
      <Popover.Trigger>Tooltip anchor</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" alignOffset={308} sideOffset={8} asChild>
          <Box
            backgroundColor="white"
            borderRadius="md"
            padding={5}
            style={{ display: 'flex', flexDirection: 'column', width: '300px' }}
          >
            <Text.Body1 fontWeight="bold" mb={1}>
              {title}
            </Text.Body1>
            <Text.Body2>{subtitle}</Text.Body2>

            <Box
              pt={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text.Body2 fontWeight="demibold">1/4</Text.Body2>
              <Button.Primary title={primaryButtonTitle ?? 'Ok'} />
            </Box>

            <Popover.Close
              aria-label="Close"
              style={{
                background: 'transparent',
                border: 0,
                position: 'absolute',
                top: 8,
                right: 0,
              }}
            >
              <XMarkIcon height="20" fill="black" />
            </Popover.Close>
            {/* <Popover.Arrow /> */}
          </Box>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
