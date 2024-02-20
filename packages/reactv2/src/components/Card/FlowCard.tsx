import { useFlowComponent } from '@/hooks/useFlowComponent'
import { type FlowComponentProps } from '@/shared/types'

import { Card } from './'
import { Flex } from '../Flex'

export function FlowCard(props: FlowComponentProps) {
  const { FlowComponent } = useFlowComponent(props)

  return (
    <FlowComponent
      as={Card}
      gap={5}
      borderColor="neutral.border"
      borderStyle="solid"
      borderWidth="md"
    >
      {({ handleDismiss, handlePrimary, handleSecondary, parentProps: { dismissible }, step }) => (
        <>
          <Flex.Row
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            justifyContent="space-between"
            part="card-header"
          >
            <Card.Title>{step.title}</Card.Title>
            {dismissible && <Card.Dismiss onClick={handleDismiss} />}
            <Card.Subtitle flexBasis="100%">{step.subtitle}</Card.Subtitle>
          </Flex.Row>

          <Card.Media src={step.imageUri} css={{ objectFit: 'contain', width: '100%' }} />

          <Flex.Row gap={3} justifyContent="flex-end" part="card-footer">
            <Card.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
            <Card.Primary title={step.primaryButtonTitle ?? 'Continue'} onClick={handlePrimary} />
          </Flex.Row>
        </>
      )}
    </FlowComponent>
  )
}
