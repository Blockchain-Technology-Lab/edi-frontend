import React from "react"
import { ChangelogTimeline } from "@/components"

const ChangelogPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Changelog</h1>
      <ChangelogTimeline />
    </div>
  )
}

export default ChangelogPage
