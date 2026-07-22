import { Link } from '@tanstack/react-router'
import { CodeBlock, IpfsProse } from '@/components'
import { DATA_FORMAT_LAYERS } from '@/config/dataFormats'
import { ipfsRoute } from '@/router'

export function DataFormats() {
  return (
    <div className="space-y-6">
      <div className="card border border-base-300 shadow-sm overflow-hidden bg-base-100">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <span className="text-xs font-mono font-semibold text-base-content/40 uppercase tracking-[0.16em]">
            Resources
          </span>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-base-content leading-tight">
            Data Format Templates
          </h1>
          <IpfsProse className="space-y-3">
            <p>
              If you're sharing data with us — via{' '}
              <Link to={ipfsRoute.to} className="link link-primary font-medium">
                IPFS
              </Link>{' '}
              or any other channel — and it can feed directly into one of our
              decentralisation-analysis tools, matching its expected raw
              format below means we can start using it right away, with no
              reformatting on our end.
            </p>
          </IpfsProse>
        </div>
      </div>

      {DATA_FORMAT_LAYERS.map((layer) => {
        const LayerContent = layer.content
        return (
          <section
            key={layer.key}
            className="card border border-base-300 shadow-sm overflow-hidden bg-base-100"
          >
            <div className="px-5 py-4 sm:px-6 border-b border-base-300 bg-base-200/50 flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-base-content leading-tight">
                {layer.label} layer
              </h2>
              {layer.status === 'coming-soon' && (
                <span className="badge badge-sm bg-base-200 border border-base-300 text-base-content/60 font-normal">
                  Coming soon
                </span>
              )}
            </div>
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <IpfsProse className="space-y-4">
                <LayerContent components={{ pre: CodeBlock }} />
              </IpfsProse>
            </div>
          </section>
        )
      })}
    </div>
  )
}
