"use client"

import { useEffect } from "react"

export default function ServiceWorkerClient() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    const swUrl = "/sw.js"

    navigator.serviceWorker
      .register(swUrl)
      .catch(() => {
        // no-op: evitar romper la UI si falla el registro
      })
  }, [])

  return null
}
