import { EmotionJSX } from '@emotion/react/types/jsx-namespace'

import { Announcement } from '@/components/Announcement'
import { Banner } from '@/components/Banner'
import { Box, type BoxProps } from '@/components/Box'
import { Card } from '@/components/Card'
import * as Checklist from '@/components/Checklist'
import { Form } from '@/components/Form'
import * as Survey from '@/components/Survey'
import { Tour } from '@/components/Tour'

import { useCollection } from '@/hooks/useCollection'
import { FlowType } from '@frigade/js'
import { Dialog } from '@/components/Dialog'

export interface CollectionProps extends BoxProps {
  collectionId: string
}

export function Collection({ collectionId, part, ...props }: CollectionProps) {
  const flowTypeMap = {
    ANNOUNCEMENT: Announcement,
    BANNER: Banner,
    CARD: Card,
    CHECKLIST: Checklist.Collapsible,
    EMBEDDED_TIP: Card,
    FORM: Form,
    NPS_SURVEY: Survey.NPS,
    SURVEY: Survey.NPS,
    TOUR: Tour,
  }

  const { currentFlow } = useCollection(collectionId)

  const FlowComponent: EmotionJSX.ElementType = flowTypeMap[currentFlow?.rawData?.flowType] ?? null

  if (currentFlow == null || FlowComponent == null) {
    return null
  }

  if (currentFlow?.rawData?.flowType === FlowType.FORM) {
    return (
      <Box part={['collection', part]} data-collection-id={collectionId} {...props}>
        <Form flowId={currentFlow.id} key={currentFlow.id} as={Dialog} />
      </Box>
    )
  }

  return (
    <Box part={['collection', part]} data-collection-id={collectionId} {...props}>
      <FlowComponent flowId={currentFlow.id} key={currentFlow.id} />
    </Box>
  )
}
