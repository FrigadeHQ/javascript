const logOnce = (message: string, type: 'log' | 'warn' | 'error' = 'log') => {
  const key = `__frigade_logged_${message}`

  if (globalThis[key as keyof typeof globalThis]) {
    return
  }

  // @ts-expect-error: globalThis is not typed
  globalThis[key as keyof typeof globalThis] = true
  console[type](message)
}

export { logOnce }
