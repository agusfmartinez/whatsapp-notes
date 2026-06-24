"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { strings } from "@/strings/es"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export default function SearchBar({
  placeholder = strings.searchPlaceholder,
  value,
  onChange,
}: SearchBarProps) {
  const inputValue = value ?? ""
  const ariaLabel = placeholder || strings.searchPlaceholder

  return (
    <div className="px-4 mb-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
          aria-hidden="true"
        />

        <Input
          type="search"
          placeholder={placeholder}
          value={inputValue}
          aria-label={ariaLabel}
          readOnly={!onChange}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          suppressHydrationWarning
          className="bg-muted border-border text-foreground pl-10 rounded-full"
        />
      </div>
    </div>
  )
}
