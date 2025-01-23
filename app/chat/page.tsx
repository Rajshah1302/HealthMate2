"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoodSelector } from "@/components/mood-selector";
import { QuickPrompts } from "@/components/quick-prompts";
import { ResourceSection } from "@/components/resource-section";
import { EmergencyButton } from "@/components/emergency-button";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; content: string }[]
  >([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      // Here you would typically send the message to your AI backend
      // and then add the response to the messages
      setInput("");
    }
  };

  const handlePromptClick = (prompt: string) => {
    setMessages([...messages, { role: "user", content: prompt }]);
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <MoodSelector />
        <EmergencyButton />
      </div>
      <div className="flex-grow flex flex-col bg-card shadow-md rounded-lg overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <QuickPrompts onPromptClick={handlePromptClick} />
        <ResourceSection />
      </div>
    </div>
  );
}