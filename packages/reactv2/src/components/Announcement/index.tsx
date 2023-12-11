import { Dialog, type DialogProps } from '../Dialog'

import { Button } from '../Button'
import { Flex } from '../Flex/Flex'

export function Announcement({}: DialogProps) {
  return (
    <Dialog>
      <Dialog.Close />

      <Dialog.Title>What is Lorem Ipsum?</Dialog.Title>
      <Dialog.Subtitle>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
      </Dialog.Subtitle>

      <Dialog.Media src="https://placekitten.com/366/250" />

      <Dialog.ProgressDots current={3} total={6} />

      <Flex.Row
        css={{
          '& > button': {
            flexGrow: 1,
          },
        }}
        gap={3}
      >
        <Button.Secondary title="Secondary" />
        <Button.Primary title="Primary" />
      </Flex.Row>
    </Dialog>
  )
}
