"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// This would typically come from your database
const moodHistory = [
  {
    date: "2025-01-23",
    mood: "happy",
    message: "Had a great therapy session!",
  },
  {
    date: "2025-01-20",
    mood: "anxious",
    message: "Feeling overwhelmed with work",
  },
  { date: "2025-01-18", mood: "sad", message: "Missing my friends" },
];

const moodEmoji = {
  happy: "😊",
  sad: "😢",
  anxious: "😰",
  angry: "😠",
  neutral: "😐",
};

export default function DailyLogPage() {
  const [date, setDate] = useState<any>(new Date());
  const [selectedMood, setSelectedMood] = useState<any>(null);

  const handleSelect = (date: any) => {
    setDate(date);
    if (date) {
      const mood = moodHistory.find(
        (m) => m.date === format(date, "yyyy-MM-dd")
      );
      setSelectedMood(mood);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Daily Log</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mood Calendar</CardTitle>
            <CardDescription>
              Track your emotional journey over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              modifiers={{
                booked: (date) =>
                  moodHistory.some(
                    (m) => m.date === format(date, "yyyy-MM-dd")
                  ),
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mood Details</CardTitle>
            <CardDescription>
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedMood ? (
              <div className="space-y-4">
                <div className="text-4xl">
                  {moodEmoji[selectedMood.mood as keyof typeof moodEmoji]}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedMood.message}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No mood recorded for this date
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
