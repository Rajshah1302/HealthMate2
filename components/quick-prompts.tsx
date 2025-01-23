import { Button } from "@/components/ui/button"

export function QuickPrompts() {
  const prompts = ["I feel anxious", "I want to share my day", "I'm having trouble sleeping", "I need motivation"]

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Quick Prompts</h3>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <Button key={index} variant="outline" size="sm">
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  )
}

