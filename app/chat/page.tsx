"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoodSelector } from "@/components/mood-selector"
import { QuickPrompts } from "@/components/quick-prompts"
import { ResourceSection } from "@/components/resource-section"
import { EmergencyButton } from "@/components/emergency-button"

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }])
      // Here you would typically send the message to your AI backend
      // and then add the response to the messages
      setInput("")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <MoodSelector />
        <EmergencyButton />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="h-96 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2"
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </div>
      <QuickPrompts />
      <ResourceSection />
    </div>
  )
}

