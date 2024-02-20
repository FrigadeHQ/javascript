import React, { CSSProperties } from 'react'

export const Info = ({
  style,
  className,
}: {
  color?: string
  style?: CSSProperties
  className?: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="46"
    height="46"
    fill="none"
    viewBox="0 0 46 46"
    style={style}
    className={className}
  >
    <circle cx="23" cy="23" r="23" fill="#E6F1FF"></circle>
    <path
      stroke="#0171F8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M32 18.5l-2.25-1.313M32 18.5v2.25m0-2.25l-2.25 1.313M14 18.5l2.25-1.313M14 18.5l2.25 1.313M14 18.5v2.25m9 3l2.25-1.313M23 23.75l-2.25-1.313M23 23.75V26m0 6.75l2.25-1.313M23 32.75V30.5m0 2.25l-2.25-1.313m0-16.875L23 13.25l2.25 1.313M32 25.25v2.25l-2.25 1.313m-13.5 0L14 27.5v-2.25"
    ></path>
  </svg>
)
