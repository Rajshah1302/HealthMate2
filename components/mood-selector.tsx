"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MoodSelector() {
  const [mood, setMood] = useState("")

  return (
    <Select onValueChange={setMood} value={mood}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="How are you feeling?" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="happy">😊 Happy</SelectItem>
        <SelectItem value="sad">😢 Sad</SelectItem>
        <SelectItem value="anxious">😰 Anxious</SelectItem>
        <SelectItem value="angry">😠 Angry</SelectItem>
        <SelectItem value="neutral">😐 Neutral</SelectItem>
      </SelectContent>
    </Select>
  )
}

