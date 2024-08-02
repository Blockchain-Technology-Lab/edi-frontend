import { ThemeSwitcher } from "@/components"
import { twJoin } from "tailwind-merge"

export default function UIPage() {
  return (
    <div className="pb-10">
      <section>
        <div className="container mx-auto">
          <h2 className="mb-4">Colors</h2>
          <p className="mb-4">
            All colors used should be defined in{" "}
            <code className="p-1">tailwind.config</code>. The main colors are
            represented below.
          </p>

          <div className="my-4 flex flex-wrap gap-6">
            <Color className="bg-white" text="#fff" />
            <Color className="bg-black" text="#000" />
          </div>

          <div className="my-4 flex flex-wrap gap-6">
            <Color className="bg-slate-200" text="#dee2e6" />
            <Color className="bg-slate-300" text="#ced4da" />
            <Color className="bg-slate-800" text="#212529" />
          </div>

          <div className="my-4 flex flex-wrap gap-6">
            <Color className="bg-aqua-400" text="#31d2f2" />
            <Color className="bg-aqua-500" text="#0dcaf0" />
          </div>

          <div className="my-4 flex flex-wrap gap-6">
            <Color className="bg-blue-400" text="#8bb9fe" />
            <Color className="bg-blue-500" text="#6ea8fe" />
            <Color className="bg-blue-700" text="#0d6efd" />
            <Color className="bg-blue-800" text="#0a58ca" />
          </div>
        </div>
      </section>
    </div>
  )
}

const Color = ({
  className,
  text = ""
}: {
  className: string
  text?: string
}) => (
  <div className="w-20">
    <div
      className={twJoin(
        "flex aspect-square items-center justify-center rounded-full border",
        className
      )}
    >
      <div className="bg-white text-black leading-none">{text}</div>
    </div>
    <div className="mt-3 text-center">{className}</div>
  </div>
)

export function getStaticProps() {
  return {
    props: {},
    // returns the default 404 page with a status code of 404 in production
    notFound: process.env.VERCEL_ENV === "production"
  }
}
