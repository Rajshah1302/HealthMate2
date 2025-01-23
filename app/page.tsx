import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Mentation</h1>
        <p className="mb-8">
          A supportive chatbot to help you navigate your emotions and mental
          health.
        </p>
        <Link href="/chat">
          <Button>Start Chat</Button>
        </Link>
        <p className="mt-8 text-sm text-muted-foreground">
          Your privacy and confidentiality are our top priorities. All
          conversations are encrypted and not stored.
        </p>
      </div>
    </div>
  );
}
