import { useEffect, useState } from 'react'

import { Box, type BoxProps } from '@/components/Box'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { ChevronDownMiniIcon } from '@/components/Icon/ChevronDownMiniIcon'

import { useFlow } from '@/hooks/useFlow'

import { flatSerialize, type SerializedTree } from '@/components/Editor/serializer'

import { DndContextWrapper } from '@/components/Editor/DndContextWrapper'
import { DragOverlay } from '@/components/Editor/DragOverlay'

import { EditorPreview } from '@/components/Editor/EditorPreview'
import { EditorProvider } from '@/components/Editor/EditorProvider'
import { EditorSidebar } from '@/components/Editor/EditorSidebar'

export function Editor(props: BoxProps) {
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

    const serializedInit = flatSerialize(init) as SerializedTree

    return serializedInit
  }

  const [serializedInit, setSerializedInit] = useState(getSerializedInit())

  if (flow == null) {
    return null
  }

  console.log(flow)

  return (
    <EditorProvider initialSerializedTree={serializedInit}>
      <DndContextWrapper>
        <Box
          backgroundColor="#F6F8FC"
          display="grid"
          gridTemplateAreas="'header header' 'left main'"
          gridTemplateColumns="200px 1fr"
          gridTemplateRows="70px 1fr"
          height="100vh"
          {...props}
        >
          <Flex.Row
            border="1px solid neutral.border"
            borderWidth="0 0 1px 0"
            gridArea="header"
            justifyContent="space-between"
            padding="3"
          >
            <Flex.Column gap="0.5">
              <Text.Caption>{flow.rawData.flowType}</Text.Caption>
              <Text.H3>{flow.rawData.flowName}</Text.H3>
            </Flex.Column>

            <Flex.Row alignItems="center" gap="2">
              <Button.Plain alignItems="center" gap="0">
                <Box as={ChevronDownMiniIcon} height="20px" transform="rotate(90deg)" />
                Close editor
              </Button.Plain>
              <Button.Primary title="Save flow" />
              <Button.Plain>
                {/* TEMP: This is the 3-dot menu SVG. Componentize it (or find an existing version) */}
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5Z"
                    stroke="#454A54"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 6.5C12.5523 6.5 13 6.05228 13 5.5C13 4.94772 12.5523 4.5 12 4.5C11.4477 4.5 11 4.94772 11 5.5C11 6.05228 11.4477 6.5 12 6.5Z"
                    stroke="#454A54"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 20.5C12.5523 20.5 13 20.0523 13 19.5C13 18.9477 12.5523 18.5 12 18.5C11.4477 18.5 11 18.9477 11 19.5C11 20.0523 11.4477 20.5 12 20.5Z"
                    stroke="#454A54"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Button.Plain>
            </Flex.Row>
          </Flex.Row>

          <Box gridArea="left" width="200px">
            <EditorSidebar />
          </Box>

          <Box
            backgroundColor="neutral.background"
            gridArea="main"
            maxWidth="100%"
            overflow="auto"
            padding="5"
          >
            <EditorPreview />
            <DragOverlay />
          </Box>
        </Box>
      </DndContextWrapper>
    </EditorProvider>
  )
}
