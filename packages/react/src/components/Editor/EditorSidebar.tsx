import { Box } from '@/components/Box'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { useEditorContext } from '@/components/Editor/useEditorContext'

import { hydrateElement } from '@/components/Editor/serializer'

export function EditorSidebar() {
  const { selectedId, serializedTree, setSerializedTree } = useEditorContext()

  function handlePropChange(name, value) {
    setSerializedTree((tree) => {
      const newElement = { ...tree.elements[selectedId] }

      newElement.props = {
        ...newElement.props,
        [name]: value,
      }

      return {
        ...tree,
        elements: {
          ...tree.elements,
          [selectedId]: newElement,
        },
      }
    })
  }

  function getPropChangeHandler(name) {
    return (e) => {
      handlePropChange(name, e.target.value)
    }
  }

  return (
    <>
      {hydrateElement('bullpen', serializedTree.elements)}

      {selectedId && (
        <Card borderWidth="md" flexFlow="row wrap" marginTop="4">
          <Box flexBasis="100%" key="name">
            {serializedTree.elements[selectedId]?.type}
          </Box>
          {Object.entries({
            backgroundColor: '',
            border: '',
            display: '',
            margin: 0,
            padding: 0,
            ...serializedTree.elements[selectedId]?.props,
          }).map(([key, val]) => {
            return (
              <Flex.Row flexBasis="50%" key={key}>
                <Text.Caption fontWeight="bold" marginRight="2">
                  {key}
                </Text.Caption>
                <Box
                  as="input"
                  display="inline-block"
                  fontSize="xs"
                  marginLeft="auto"
                  onChange={getPropChangeHandler(key)}
                  type="text"
                  value={val}
                  width="40px"
                />
              </Flex.Row>
            )
          })}
        </Card>
      )}
    </>
  )
}
