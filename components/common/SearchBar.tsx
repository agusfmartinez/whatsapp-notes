"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export default function SearchBar({ 
  placeholder = "Preguntar a Meta AI o buscar",
  value,
  onChange 
}: SearchBarProps) {
  return (
    <div className="px-4 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-[#22292c] border-gray-700 text-white pl-10 rounded-full"
        />
      </div>
    </div>
  )
}
