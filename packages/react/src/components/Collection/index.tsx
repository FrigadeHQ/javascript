import { type Flow, FlowType } from '@frigade/js'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'

import { Announcement } from '@/components/Announcement'
import { Banner } from '@/components/Banner'
import { Box, type BoxProps } from '@/components/Box'
import { Card } from '@/components/Card'
import * as Checklist from '@/components/Checklist'
import { FrigadeContext } from '@/components/Provider'
import { Form } from '@/components/Form'
import * as Survey from '@/components/Survey'
import { Tour } from '@/components/Tour'

import { useCollection } from '@/hooks/useCollection'

// TODO: Accept props at top level of Collection component and put them onto a box, so we can style the contents of a Collection

// TODO: Sync type of flowComponents across to FlowType from API
// export type FlowComponentMap = {
//   [T in keyof typeof FlowType]: (props: unknown) => EmotionJSX.Element
// }

const flowTypeMap = {
  ANNOUNCEMENT: Announcement,
  BANNER: Banner,
  CARD: Card,
  CHECKLIST: Checklist.Collapsible,
  EMBEDDED_TIP: Card,
  FORM: Form,
  NPS_SURVEY: Survey.NPS,
  TOUR: Tour,
}

export interface CollectionProps extends BoxProps {
  collectionId: string
}

export function Collection({ collectionId, part, ...props }: CollectionProps) {
  const { collection } = useCollection(collectionId)

  const currentFlow = collection?.find(({ flow }) => flow.isVisible)?.flow

  const FlowComponent: EmotionJSX.ElementType =
    flowTypeMap[currentFlow?.rawData?.flowType] ?? (() => null)

  if (currentFlow == null || FlowComponent == null) {
    return null
  }

  return (
    <Box part={['collection', part]} data-collection-id={collectionId} {...props}>
      <FlowComponent flowId={currentFlow.id} />
    </Box>
  )
}
