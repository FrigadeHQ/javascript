import { useFlow } from '../../hooks/useFlow'

import { Box } from '../Box'
import { Tooltip } from '../Tooltip'

export interface TourProps {
  flowId: string
}

export function Tour({ flowId }: TourProps) {
  const { flow, fetchFlow } = useFlow(flowId)

  // TODO: Add skipped state here as well
  if (flow == null || flow?.isCompleted) {
    return null
  }

  flow.start()

  const step = flow.getCurrentStep()

  step?.start()

  async function handleDismiss() {
    await flow.skip()

    // TEMP: Manually refreshing flow data until useFlow can handle it internally
    fetchFlow()
  }

  async function handlePrimary() {
    await step.complete()

    // TEMP: Manually refreshing flow data until useFlow can handle it internally
    fetchFlow()
  }

  const handleSecondary = handlePrimary

  return (
    <Tooltip align="after" anchor={step.selector} onPointerDownOutside={(e) => e.preventDefault()}>
      <Tooltip.Close onClick={handleDismiss} />

      <Tooltip.Media />

      <Tooltip.Title>{step.title}</Tooltip.Title>
      <Tooltip.Subtitle>{step.subtitle}</Tooltip.Subtitle>

      <Box
        pt={4}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          <Tooltip.Progress>{`${flow.getNumberOfCompletedSteps()}/${
            flow.steps.size
          }`}</Tooltip.Progress>
        </Box>

        <Tooltip.Secondary title={step.secondaryButtonTitle} onClick={handleSecondary} />
        <Tooltip.Primary title={step.primaryButtonTitle} onClick={handlePrimary} />
      </Box>
    </Tooltip>
  )
}
