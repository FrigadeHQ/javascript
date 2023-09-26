import React, { FC } from 'react'
import styled from 'styled-components'
import { TitleSubtitleWithCTA } from './shared/TitleSubtitleWithCTA'
import { StepContentProps } from '../../FrigadeForm/types'
import { CTA } from './shared/CTA'
import { TitleSubtitle } from './shared/TitleSubtitle'
import { sanitize } from '../../shared/sanitizer'
import { getClassName } from '../../shared/appearance'

const CodeSnippetContainer = styled.div`
  display: block;
`

// Create a cool code snippet style that is dark background white text
const CodeSnippet = styled.pre`
  display: block;
  background-color: #2a2a2a;
  color: #f8f8f8;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 20px;
  font-family: 'Source Code Pro', monospace;
  width: 600px;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  margin-bottom: 24px;
`
const CodeSnippetTitle = styled.div`
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 12px;
  margin-top: 12px;
`

const CodeSnippets = styled.div`
  margin-top: 24px;
`

interface CodeSnippetMetadata {
  code?: string
  title?: string
}

interface CodeSnippetProps {
  codeSnippets: CodeSnippetMetadata[]
}

export const CODE_SNIPPET_CONTENT_TYPE = 'codeSnippet'

export const CodeSnippetContent: FC<StepContentProps> = ({ stepData, appearance }) => {
  if (!stepData.props?.codeSnippets) {
    return (
      <CodeSnippetContainer>
        <TitleSubtitleWithCTA stepData={stepData} appearance={appearance} />
      </CodeSnippetContainer>
    )
  }

  const codeProps = stepData.props as CodeSnippetProps

  if (codeProps.codeSnippets) {
    return (
      <CodeSnippetContainer className={getClassName('codeSnippetContainer', appearance)}>
        <TitleSubtitle stepData={stepData} appearance={appearance} />
        <CodeSnippets>
          {codeProps.codeSnippets.map((codeSnippet, index) => {
            return (
              <div key={index}>
                {codeSnippet.title ? (
                  <CodeSnippetTitle dangerouslySetInnerHTML={sanitize(codeSnippet.title)} />
                ) : null}
                {codeSnippet.code ? <CodeSnippet>{codeSnippet.code}</CodeSnippet> : null}
              </div>
            )
          })}
        </CodeSnippets>
        <CTA stepData={stepData} appearance={appearance} />
      </CodeSnippetContainer>
    )
  }
  return null
}
