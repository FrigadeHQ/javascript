import { FlowType } from '../types'

export interface FlowDataRaw {
  id: number
  name: string
  description: string
  data: string
  createdAt: string
  modifiedAt: string
  slug: string
  targetingLogic: string
  type: FlowType
  triggerType: TriggerType
  status: FlowStatus
  version: number
  active: boolean
}

export enum TriggerType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum FlowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}
