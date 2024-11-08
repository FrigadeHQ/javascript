export const VIDEO_PROP_NAMES = [
  'autoPlay',
  'controls',
  'controlsList',
  'crossOrigin',
  'disablePictureInPicture',
  'disableRemotePlayback',
  'loop',
  'muted',
  'playsInline',
  'poster',
  'preload',
  'src',
] as const

export type VideoPropName = (typeof VIDEO_PROP_NAMES)[number]

export function getVideoProps(props: Record<string, unknown>) {
  const videoProps = {}
  const otherProps = {}

  for (const [propName, propValue] of Object.entries(props)) {
    if (VIDEO_PROP_NAMES.some((name) => name === propName)) {
      videoProps[propName] = propValue
    } else {
      otherProps[propName] = propValue
    }
  }

  return {
    otherProps,
    videoProps,
  }
}
