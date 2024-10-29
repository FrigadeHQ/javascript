import { Box } from '@/components/Box'
import { Text } from '@/components/Text'

import { flatDeserialize } from '@/components/Editor/serializer'
import { useEditorContext } from '@/components/Editor/useEditorContext'

export function ElementList() {
  const { serializedTree } = useEditorContext()

  const components = {
    'Button.Primary': ButtonListItem,
    'Button.Secondary': ButtonListItem,
    Card: ListItem,
    'Card.Title': ListItemLabel,
    'Card.Subtitle': ListItemLabel,
    'Flex.Row': ListItem,
  }

  const hydrated = flatDeserialize(serializedTree, components)

  return (
    <Box maxWidth="200px">
      <Text.Caption display="block" fontWeight="demibold" marginBottom="3">
        Elements
      </Text.Caption>
      {hydrated}
    </Box>
  )
}

function ListItem({ children, id }) {
  const { serializedTree } = useEditorContext()

  return (
    <Box>
      <ListItemLabel>{serializedTree.elements[id].type}</ListItemLabel>
      <Box paddingLeft="2">{children}</Box>
    </Box>
  )
}

function ButtonListItem({ title }) {
  return <ListItemLabel>{title}</ListItemLabel>
}

function ListItemLabel({ children }) {
  return (
    <Text.Caption
      css={{
        '& p': { margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      }}
      display="block"
      marginBottom="2"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      {children}
    </Text.Caption>
  )
}
