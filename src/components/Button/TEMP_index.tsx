import * as React from 'react'

import { buttonRecipe } from './buttonRecipe.css'

export const Button = ({ children }) => {
  return <button className={buttonRecipe()}>{children}</button>
}
