import type { DialogProps } from '.'

const RADIX_PROPS = {
  content: [
    'onOpenAutoFocus',
    'onCloseAutoFocus',
    'onEscapeKeyDown',
    'onPointerDownOutside',
    'onInteractOutside',
  ],
  root: ['defaultOpen', 'modal', 'onOpenChange', 'open'],
}

export function mapDialogProps(props: DialogProps) {
  const contentProps = Object.fromEntries(
    RADIX_PROPS.content
      .map((propName) => [propName, props[propName]])
      .filter((propEntry) => propEntry[1] !== undefined)
  )
  const rootProps = Object.fromEntries(
    RADIX_PROPS.root
      .map((propName) => [propName, props[propName]])
      .filter((propEntry) => propEntry[1] !== undefined)
  )

  const otherProps = {}

  for (const propName of Object.keys(props)) {
    if (!RADIX_PROPS.content.includes(propName) && !RADIX_PROPS.root.includes(propName)) {
      otherProps[propName] = props[propName]
    }
  }

  return {
    contentProps,
    otherProps,
    rootProps,
  }
}
