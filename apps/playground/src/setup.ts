// Filter out BlockNote's flushSync warning (a known issue with their React 19 compatibility)
// This keeps StrictMode enabled while hiding noise from third-party library issues
// Must be imported before any React code runs

if (typeof window !== 'undefined') {
  const flushSyncMessage = 'flushSync was called from inside a lifecycle method'

  const originalError = console.error
  console.error = (...args: unknown[]) => {
    const msg = args[0]
    if (typeof msg === 'string' && msg.includes(flushSyncMessage)) {
      return
    }
    originalError.apply(console, args)
  }

  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    const msg = args[0]
    if (typeof msg === 'string' && msg.includes(flushSyncMessage)) {
      return
    }
    originalWarn.apply(console, args)
  }
}
