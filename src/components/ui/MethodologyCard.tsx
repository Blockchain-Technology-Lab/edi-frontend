import type { ComponentType } from 'react'
//import { Link } from '@tanstack/react-router'

type MethodologyCardProps = {
  title: string
  image: string
  content: ComponentType<Record<string, unknown>>
}

export function MethodologyCard({
  title,
  image,
  content: Content
}: MethodologyCardProps) {
  return (
    <section className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden flex flex-col h-full">
      <div className="p-2 bg-base-200 shrink-0">
        <div className="flex items-center justify-between gap-3 min-h-16">
          <div className="card-title text-2xl">{title}</div>
          <figure className="w-24 h-16 bg-base-200 rounded-md overflow-hidden shrink-0">
            <img
              src={image}
              alt={`${title} methodology`}
              className="w-full h-full object-contain"
            />
          </figure>
        </div>
      </div>
      <div className="px-4 py-3 bg-base-300/60 border-y border-base-200 text-sm text-base-content/80 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1">
        <Content />
      </div>
      <div className="px-2 py-2 bg-base-200 flex justify-end shrink-0"></div>
    </section>
  )
}
