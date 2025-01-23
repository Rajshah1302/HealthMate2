'use client'
import React, { useState } from "react";

export default function VirtualTherapist() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [summary, setSummary] = useState("");
  const [healthPoints, setHealthPoints] = useState(null);

  // Handle sending a message to the virtual therapist
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat history
    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", content: userInput },
    ];
    setChatHistory(updatedChatHistory);

    // Call the virtual therapist API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          chatHistory: updatedChatHistory,
        }),
      });

      const data = await response.json();
      if (data.assistantResponse) {
        // Add the assistant's response to chat history
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.assistantResponse },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with virtual therapist:", error);
    }

    // Clear user input
    setUserInput("");
  };

  // Handle generating a summary of the conversation
  const generateSummary = async () => {
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatHistory }),
      });

      const data = await response.json();
      if (data.summary && data.healthPoints !== undefined) {
        setSummary(data.summary);
        setHealthPoints(data.healthPoints);
      }
    } catch (error) {
      console.error("Error generating chat summary:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Virtual Therapist</h1>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              margin: "10px 0",
              textAlign: message.role === "user" ? "right" : "left",
            }}
          >
            <strong>
              {message.role === "user" ? "You" : "Therapist"}:
            </strong>{" "}
            {message.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <textarea
          placeholder="Type your message here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={generateSummary}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Generate Summary
        </button>
      </div>
      {summary && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3>Chat Summary</h3>
          <p>{summary}</p>
          <p>
            <strong>Health Points:</strong> {healthPoints}/100
          </p>
        </div>
      )}
    </div>
  );
}
