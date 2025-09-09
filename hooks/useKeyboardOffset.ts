"use client"

import { useState, useEffect } from "react"

export function useKeyboardOffset() {
  const [kbOffset, setKbOffset] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    
    const onResize = () => {
      const offset = Math.max(0, window.innerHeight - vv.height)
      setKbOffset(offset)
    }
    
    vv.addEventListener("resize", onResize)
    vv.addEventListener("scroll", onResize)
    onResize()
    
    return () => {
      vv.removeEventListener("resize", onResize)
      vv.removeEventListener("scroll", onResize)
    }
  }, [])

  return kbOffset
}
