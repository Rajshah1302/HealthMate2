"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoodSelector } from "@/components/mood-selector";
import { QuickPrompts } from "@/components/quick-prompts";
import { ResourceSection } from "@/components/resource-section";
import { EmergencyButton } from "@/components/emergency-button";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
  
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
  
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: input,
          chatHistory: messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant", // Explicitly cast roles
            content: msg.content,
          })),
        }),
      });
  
      if (response.ok) {
        const { assistantResponse } = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: assistantResponse }, // Use "bot" here to match type
        ]);
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error connecting to API:", error);
    } finally {
      setLoading(false);
    }
  };
  
  function handlePromptClick(prompt: string): void {
    setInput(prompt);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
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
              className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">
                Typing...
              </span>
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder="Type your message..."
              className="flex-grow mr-2"
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading}>
              Send
            </Button>
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
