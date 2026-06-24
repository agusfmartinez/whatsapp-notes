"use client"

import { Button } from "@/components/ui/button"
import { strings, APP_VERSION } from "@/strings/es"

type AboutModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-xl p-6">
        <h2 className="text-lg font-medium mb-1">{strings.about.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {strings.about.versionLabel} {APP_VERSION}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {strings.about.description}
        </p>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} className="border-border">
            {strings.about.close}
          </Button>
        </div>
      </div>
    </div>
  )
}
