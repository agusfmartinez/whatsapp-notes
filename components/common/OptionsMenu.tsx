"use client"

import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MenuItem = {
  label: string
  onSelect?: () => void
  disabled?: boolean
  danger?: boolean
}

type OptionsMenuProps = {
  items: MenuItem[]
  align?: "start" | "end" | "center"
  widthClass?: string
}

export default function OptionsMenu({
  items,
  align = "end",
  widthClass = "w-40",
}: OptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <MoreVertical size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={widthClass}>
        {items.map((item, idx) =>
          item.label === "__divider__" ? (
            <div key={`divider-${idx}`} className="h-px my-1 bg-gray-700/50" />
          ) : (
            <DropdownMenuItem
              key={item.label + idx}
              onClick={item.onSelect}
              disabled={item.disabled}
              className={item.danger ? "text-red-500 focus:text-red-600" : undefined}
            >
              {item.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
