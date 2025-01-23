import Link from "next/link"

export function ResourceSection() {
  const resources = [
    { title: "5-Minute Meditation", href: "#" },
    { title: "Breathing Exercises", href: "#" },
    { title: "Journaling Tips", href: "#" },
    { title: "Stress Management Techniques", href: "#" },
  ]

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Helpful Resources</h3>
      <ul className="list-disc pl-5">
        {resources.map((resource, index) => (
          <li key={index}>
            <Link href={resource.href} className="text-blue-500 hover:underline">
              {resource.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

