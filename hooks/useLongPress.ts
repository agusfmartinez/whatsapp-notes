"use client"

import { useRef } from "react"

export function useLongPress() {
  const longPressTimeout = useRef<number | null>(null)

  const startLongPress = (callback: () => void, delay = 450) => {
    if (longPressTimeout.current) window.clearTimeout(longPressTimeout.current)
    longPressTimeout.current = window.setTimeout(callback, delay)
  }

  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      window.clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
  }

  return {
    startLongPress,
    cancelLongPress
  }
}
