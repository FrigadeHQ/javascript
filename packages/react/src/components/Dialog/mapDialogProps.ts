import type { BoxProps } from '@/components/Box'
import type { DialogProps, DialogContentProps, DialogRootProps } from '.'

const RADIX_PROPS = {
  content: [
    'onOpenAutoFocus',
    'onCloseAutoFocus',
    'onEscapeKeyDown',
    'onPointerDownOutside',
    'onInteractOutside',
  ],
  root: ['defaultOpen', 'modal', 'onOpenChange', 'open'],
} as const

export function mapDialogProps(props: DialogProps) {
  const contentProps: DialogContentProps = Object.fromEntries(
    RADIX_PROPS.content
      .map((propName) => [propName, props[propName]])
      .filter((propEntry) => propEntry[1] !== undefined)
  )
  const rootProps: DialogRootProps = Object.fromEntries(
    RADIX_PROPS.root
      .map((propName) => [propName, props[propName]])
      .filter((propEntry) => propEntry[1] !== undefined)
  )

  const otherProps = {} as BoxProps

  for (const propName of Object.keys(props)) {
    if (
      !RADIX_PROPS.content.some((p) => p === propName) &&
      !RADIX_PROPS.root.some((p) => p === propName)
    ) {
      otherProps[propName] = props[propName]
    }
  }

  return {
    contentProps,
    otherProps,
    rootProps,
  }
}
