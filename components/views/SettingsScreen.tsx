"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { strings } from "@/strings/es"

type SettingsScreenProps = {
  appName: string
  onAppNameChange: (name: string) => void
  onBack: () => void
}

export default function SettingsScreen({ appName, onAppNameChange, onBack }: SettingsScreenProps) {
  return (
    <div className="bg-background text-foreground h-[100dvh] w-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-foreground hover:bg-transparent"
          onClick={onBack}
          aria-label={strings.settings.back}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">{strings.settings.title}</h1>
      </div>

      {/* Form */}
      <div className="px-4 mt-4 space-y-2">
        <label className="block text-sm text-muted-foreground">{strings.settings.appNameLabel}</label>
        <Input
          value={appName}
          onChange={(e) => onAppNameChange(e.target.value)}
          placeholder={strings.settings.appNamePlaceholder}
          className="bg-muted border-border text-foreground"
        />
        <p className="text-xs text-muted-foreground">{strings.settings.appNameHint}</p>
      </div>
    </div>
  )
}
