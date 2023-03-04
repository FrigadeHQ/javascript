const regex = /user.flow\(([^\)]+)\).state == 'COMPLETED_FLOW'/gm

export const getSubFlowFromCompletionCriteria = (completionCriteria: string) => {
  const flowMatch = regex.exec(completionCriteria)
  if (flowMatch === null) return null

  /**
   *  Use the grouped regex match to
   *  - match on full completion criteria for a 'Flow' completion
   *  - get the flowId slug from within the completion criteria
   */
  let flow = null
  flowMatch.forEach((match, groupIndex) => {
    let trimmed = match.replaceAll("'", '')
    if (trimmed.startsWith('flow_')) {
      flow = trimmed
    }
  })
  return flow
}
