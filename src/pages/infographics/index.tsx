import { InfographicsImages } from '@/components'

export function Infographics() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
            Visual resources
          </span>
        </div>
        <div className="p-5 sm:p-6 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-base-content leading-tight">
            Infographics
          </h1>
          <p className="text-sm text-base-content/70 leading-relaxed">
            The Edinburgh Decentralisation Index (EDI) offers a detailed
            framework to measure blockchain decentralisation across multiple
            dimensions including consensus, tokenomics, network, software, and
            geography. Click any image to view it full-size, or download it
            directly.
          </p>
        </div>
      </div>

      {/* Gallery */}
      <InfographicsImages />
    </div>
  )
}
