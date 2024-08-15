import React from "react"

export function Alert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full bg-danger-100 text-danger-800 border border-danger-200 p-4 rounded-lg"
    >
      <p>{message}</p>
    </div>
  )
}
