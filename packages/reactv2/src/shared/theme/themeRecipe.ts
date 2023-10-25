import { recipe, RuntimeFn } from '@vanilla-extract/recipes'

import { theme } from './themeContract.css'

// // Parameters<typeof recipe<T>>[0]
// type RecipeFunc<T> = <V extends VariantGroups>(themeObj: T) => Parameters<typeof recipe<V>>[0]

// export function themeRecipe<T extends typeof theme>(recipeFunc: RecipeFunc<T>): ReturnType<typeof recipe<RecipeFunc<T>>> {
//   return recipe(recipeFunc(theme))
// }
