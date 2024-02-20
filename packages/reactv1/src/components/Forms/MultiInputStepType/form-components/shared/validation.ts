import { InputValidation } from '../../../../../FrigadeForm/types'
import { z } from 'zod'

export function getErrorsFromValidationResult(
  value?: string,
  validation?: InputValidation
): string | null {
  try {
    if (validation) {
      if (validation.type == 'number') {
        let validator = z.number()
        if (validation.props) {
          for (const validationProp of validation.props) {
            if (validationProp.requirement == 'min') {
              validator = validator.min(
                Number(validationProp.value),
                validationProp.message ?? 'Value is too small'
              )
            } else if (validationProp.requirement == 'max') {
              validator = validator.max(
                Number(validationProp.value),
                validationProp.message ?? 'Value is too large'
              )
            } else if (validationProp.requirement == 'positive') {
              validator = validator.positive(validationProp.message ?? 'Value must be positive')
            } else if (validationProp.requirement == 'negative') {
              validator = validator.nonpositive(validationProp.message ?? 'Value must be negative')
            }
          }
        }
        validator.parse(Number(value))
      }
      if (validation.type == 'string') {
        let validator = z.string()
        if (validation.props) {
          for (const validationProp of validation.props) {
            if (validationProp.requirement == 'min') {
              validator = validator.min(
                Number(validationProp.value),
                validationProp.message ?? 'Value is too short'
              )
            } else if (validationProp.requirement == 'max') {
              validator = validator.max(
                Number(validationProp.value),
                validationProp.message ?? 'Value is too long'
              )
            } else if (validationProp.requirement == 'regex') {
              validator = validator.regex(
                new RegExp(String(validationProp.value)),
                validationProp.message ?? 'Value does not match requirements'
              )
            }
          }
        }
        validator.parse(value)
      }

      return
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      if (e.issues && e.issues.length > 0) {
        return e.issues[0].message
      }
      return null
    }
    console.error('Frigade Form validation failed for rule ', validation, e)
  }

  return null
}
