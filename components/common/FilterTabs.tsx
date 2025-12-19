"use client"

import { Button } from "@/components/ui/button"
import { strings } from "@/strings/es"

interface FilterTabsProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function FilterTabs({ activeTab = "todos", onTabChange }: FilterTabsProps) {
  const tabs = [
    { id: "todos", label: strings.tabs.all },
    { id: "no-leidos", label: strings.tabs.unread, count: 0 },
    { id: "favoritos", label: strings.tabs.favorites, count: 0 },
    { id: "grupos", label: strings.tabs.groups, count: 0 }
  ]

  return (
    <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          className={
            activeTab === tab.id
              ? "bg-[#0f3728] hover:bg-green-600 text-white rounded-full px-4 py-2 text-sm"
              : "border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm bg-transparent"
          }
          onClick={() => onTabChange?.(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-1">{tab.count}</span>}
        </Button>
      ))}
    </div>
  )
}
