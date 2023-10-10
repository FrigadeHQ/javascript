import { createContext } from 'react'

import { deepmerge } from '../../shared/deepmerge'
import { tokens } from '../../shared/tokens'

export const FrigadeContext = createContext({
  theme: tokens,
})

interface ProviderProps {
  children?: React.ReactNode
}

export function Provider({ children }: ProviderProps) {
  return (
    <FrigadeContext.Provider
      value={{
        theme: deepmerge(tokens, {
          colors: {
            blue500: 'pink',
            primary: {
              background: 'orange',
            },
          },
        }),
      }}
    >
      {children}
    </FrigadeContext.Provider>
  )
}
