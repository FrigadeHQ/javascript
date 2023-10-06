import React from 'react'
import styled from 'styled-components'
import { CustomFormTypeProps } from '../../../FrigadeForm/types'
import { useCTAClickSideEffects } from '../../../hooks/useCTAClickSideEffects'
import { sanitize } from '../../../shared/sanitizer'

interface Link {
  title?: string
  uri?: string
  uriTarget?: string
  imageUri?: string
}

// create flex that wraps if not enoug space
const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
`

const Link = styled.div`
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 15px;
  padding: 20px;
  flex-basis: 255px;
  flex-grow: 0;
  flex-shrink: 0;
`

const LinkIcon = styled.img`
  width: 78px;
  height: auto;
`

const LinkTitle = styled.button`
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;

  display: flex;
  align-items: center;
  text-align: center;
  border: 1px solid;
  border-radius: 100px;
  padding: 8px 12px;
  margin-top: 16px;
`

const HeaderTitle = styled.h1`
  font-weight: 700;
  font-size: 28px;
  line-height: 34px;
`

const HeaderSubtitle = styled.h2`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #7e7e7e;
  margin-top: 12px;
  margin-bottom: 16px;
  max-width: 70%;
`

export function LinkCollectionStepType({ stepData, appearance }: CustomFormTypeProps) {
  const { handleUrl } = useCTAClickSideEffects()

  return (
    <div>
      <HeaderTitle dangerouslySetInnerHTML={sanitize(stepData.title)} />
      <HeaderSubtitle dangerouslySetInnerHTML={sanitize(stepData.subtitle)} />
      <LinkContainer>
        {stepData.props?.links?.map((link: Link) => (
          <Link key={link.title}>
            <LinkIcon src={link.imageUri} />
            <LinkTitle
              style={{
                borderColor: appearance.theme.colorPrimary,
                color: appearance.theme.colorPrimary,
              }}
              onClick={() => {
                if (link.uri) {
                  handleUrl(link.uri, link.uriTarget ?? '_blank')
                }
              }}
            >
              {link.title}
            </LinkTitle>
          </Link>
        ))}
      </LinkContainer>
    </div>
  )
}
