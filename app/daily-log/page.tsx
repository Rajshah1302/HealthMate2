"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mapping score ranges to mood emojis
const getMoodEmoji = (score) => {
  if (score >= 80) return "😊"; // Happy
  if (score >= 60) return "😐"; // Neutral
  if (score >= 40) return "😰"; // Anxious
  return "😢"; // Sad
};

export default function DailyLogPage() {
  const [date, setDate] = useState<any>(new Date());
  const [selectedSummary, setSelectedSummary] = useState<any>(null);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch summaries from the backend
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/fetchSummary");
        if (!response.ok) {
          throw new Error("Failed to fetch summaries");
        }
        const data = await response.json();
        setMoodHistory(data.summaries || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load summaries.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  const handleSelect = (selectedDate: any) => {
    setDate(selectedDate);
    if (selectedDate) {
      const summary = moodHistory.find(
        (m) => m.date.slice(0, 10) === format(selectedDate, "yyyy-MM-dd")
      );
      setSelectedSummary(summary || null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Daily Log</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar Card */}
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
                logged: (date) =>
                  moodHistory.some(
                    (m) => m.date.slice(0, 10) === format(date, "yyyy-MM-dd")
                  ),
              }}
              modifiersStyles={{
                logged: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  backgroundColor: "#d1fae5", // Light green for logged days
                  color: "#065f46", // Dark green text
                },
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Mood Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Details</CardTitle>
            <CardDescription>
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSummary ? (
              <div className="space-y-4">
                <div className="text-4xl">
                  {getMoodEmoji(selectedSummary.score)}
                </div>
                <p className="text-sm">
                  <strong>Summary:</strong> {selectedSummary.summary}
                </p>
                <p className="text-sm">
                  <strong>Health Score:</strong> {selectedSummary.score}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No mood summary recorded for this date.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
