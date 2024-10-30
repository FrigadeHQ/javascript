import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

import { useEditorContext } from '@/components/Editor/useEditorContext'

import { ElementList } from '@/components/Editor/ElementList'

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
    <Flex.Column height="100%" justifyContent="space-between">
      <ElementList />

      {selectedId && (
        <Box>
          <Flex.Column
            border="1px solid neutral.border"
            borderWidth="md 0 0 0"
            flexFlow="row wrap"
            gap="2"
            marginTop="4"
            padding="3"
          >
            <Text.Caption flexBasis="100%" fontWeight="demibold" key="name">
              {serializedTree.elements[selectedId]?.type}
            </Text.Caption>
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
                  <Text.Caption marginRight="2">{key}</Text.Caption>
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
          </Flex.Column>
          <Box border="1px solid neutral.border" borderTopWidth="md" padding="3">
            <Text.Caption
              color="primary.500"
              display="block"
              fontWeight="demibold"
              textAlign="right"
            >
              + More styles
            </Text.Caption>
          </Box>
        </Box>
      )}
    </Flex.Column>
  )
}
