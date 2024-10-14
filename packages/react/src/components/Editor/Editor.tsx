import { useEffect, useState } from 'react'

import { Box } from '@/components/Box'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'

import { useFlow } from '@/hooks/useFlow'

import { flatSerialize, type SerializedTree } from '@/components/Editor/serializer'

import { DndContextWrapper } from '@/components/Editor/DndContextWrapper'
import { DragOverlay } from '@/components/Editor/DragOverlay'

import { EditorPreview } from '@/components/Editor/EditorPreview'
import { EditorProvider } from '@/components/Editor/EditorProvider'
import { EditorSidebar } from '@/components/Editor/EditorSidebar'

export function Editor() {
  const { flow } = useFlow('flow_xw9xq7yc')

  const step = flow?.getCurrentStep()

  useEffect(() => {
    if (step != null) {
      setSerializedInit(getSerializedInit())
    }
  }, [step])

  function getSerializedInit() {
    const init = (
      <Card borderWidth="md">
        <Card.Title>{step?.title}</Card.Title>
        <Card.Subtitle>{step?.subtitle}</Card.Subtitle>
        <Flex.Row>
          <Button.Primary title={step?.primaryButton.title} />
          <Button.Secondary title="Secondary Button" />
        </Flex.Row>
      </Card>
    )

    const bullpenInit = (
      <Card backgroundColor="neutral.800" id="bullpen">
        <Card.Title id="new-title">New title</Card.Title>
      </Card>
    )

    const serializedInit = flatSerialize(init) as SerializedTree
    const serializedBullpen = flatSerialize(bullpenInit) as SerializedTree

    for (const [itemId, item] of Object.entries(serializedBullpen.elements)) {
      serializedInit.elements[itemId] = item
    }

    serializedBullpen.elements = serializedInit.elements

    return serializedInit
  }

  const [serializedInit, setSerializedInit] = useState(getSerializedInit())

  return (
    <EditorProvider initialSerializedTree={serializedInit}>
      <DndContextWrapper>
        <Flex.Row gap="4">
          <Box width="30%">
            <EditorSidebar />
          </Box>
          <Box width="70%">
            <EditorPreview />
          </Box>
        </Flex.Row>

        <DragOverlay />
      </DndContextWrapper>
    </EditorProvider>
  )
}
