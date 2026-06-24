"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { strings } from "@/strings/es"

type UnlockChatModalProps = {
  isOpen: boolean
  chatName?: string
  onCancel: () => void
  onSubmit: (clave: string) => Promise<boolean>
}

export default function UnlockChatModal({ isOpen, chatName, onCancel, onSubmit }: UnlockChatModalProps) {
  const [clave, setClave] = useState("")
  const [error, setError] = useState(false)

  if (!isOpen) return null

  const close = () => {
    setClave("")
    setError(false)
    onCancel()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clave) return
    const ok = await onSubmit(clave)
    if (ok) {
      setClave("")
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-[#0b1014] text-white w-full max-w-md rounded-xl p-6">
        <h2 className="text-lg font-medium mb-1">{strings.lock.unlockTitle}</h2>
        <p className="text-sm text-gray-300 mb-4">
          {strings.lock.unlockPrompt}{chatName ? ` (${chatName})` : ""}
        </p>
        <Input
          type="password"
          autoFocus
          value={clave}
          onChange={(e) => { setClave(e.target.value); setError(false) }}
          placeholder={strings.lock.placeholder}
          className="bg-muted border-border text-foreground"
        />
        {error && <p className="text-xs text-red-400 mt-2">{strings.lock.unlockError}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={close} className="border-gray-600 text-gray-300">
            Cancelar
          </Button>
          <Button type="submit" className="bg-[#21c063] hover:bg-green-600" disabled={!clave}>
            {strings.lock.unlock}
          </Button>
        </div>
      </form>
    </div>
  )
}
