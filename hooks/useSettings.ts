"use client"

import { useState, useEffect } from "react"
import { strings } from "@/strings/es"

export type Platform = "android" | "ios"

export type Settings = {
  appName: string
  platform: Platform
}

const DEFAULT_SETTINGS: Settings = {
  appName: strings.appTitle,
  platform: "android",
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

  const setPlatform = (platform: Platform) => {
    setSettings(prev => ({ ...prev, platform }))
  }

  return { settings, setAppName, setPlatform }
}
