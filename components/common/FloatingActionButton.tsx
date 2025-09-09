"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface FloatingActionButtonProps {
  onClick: () => void
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-16 right-4 md:bottom-20">
      <Button
        className="bg-[#21c063] hover:bg-green-600 w-14 h-14 rounded-full shadow-lg"
        onClick={onClick}
      >
        <Plus size={24} />
      </Button>
    </div>
  )
}
