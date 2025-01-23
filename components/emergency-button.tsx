import { Button } from "@/components/ui/button"

export function EmergencyButton() {
  const handleEmergency = () => {
    // Implement emergency action (e.g., show helpline numbers, redirect to professional help)
    alert("If you're in crisis, please call your local emergency number or go to the nearest emergency room.")
  }

  return (
    <Button onClick={handleEmergency} variant="destructive">
      Emergency Help
    </Button>
  )
}

