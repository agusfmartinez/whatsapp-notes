"use client"

import { useState, useEffect } from "react"
import { strings } from "@/strings/es"

export type Settings = {
  appName: string
}

const DEFAULT_SETTINGS: Settings = {
  appName: strings.appTitle,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  useEffect(() => {
    const saved = localStorage.getItem("settings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch {
        setSettings(DEFAULT_SETTINGS)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  const setAppName = (appName: string) => {
    setSettings(prev => ({ ...prev, appName }))
  }

  return { settings, setAppName }
}
