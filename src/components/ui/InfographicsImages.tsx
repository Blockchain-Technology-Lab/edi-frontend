import { useEffect, useState } from 'react'
import { INFOGRAPHICS } from '@/utils/paths'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import 'photoswipe/dist/photoswipe.css'

const images = [
  { src: INFOGRAPHICS + '01.png', alt: 'EDI Overview', label: 'EDI 01' },
  { src: INFOGRAPHICS + '02.png', alt: 'Consensus Layer', label: 'EDI 02' },
  { src: INFOGRAPHICS + '03.png', alt: 'Tokenomics Layer', label: 'EDI 03' },
  { src: INFOGRAPHICS + '04.png', alt: 'Network & Geography', label: 'EDI 04' }
]

const WIDTH = 1200
const HEIGHT = 800

function handleDownload(imageUrl: string) {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = imageUrl.split('/').pop() || 'EDI_Infographic.png'
  link.click()
}

export function InfographicsImages() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((_, i) => (
          <div
            key={i}
            className="card border border-base-300 shadow-sm overflow-hidden bg-base-100"
          >
            <div className="aspect-[3/2] bg-base-200 animate-pulse" />
            <div className="px-3 py-2.5 border-t border-base-300 flex items-center justify-between">
              <div className="h-3 w-10 bg-base-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-base-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Gallery>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Item
            key={index}
            original={image.src}
            thumbnail={image.src}
            width={WIDTH}
            height={HEIGHT}
          >
            {({ ref, open }) => (
              <div
                ref={ref}
                className="card border border-base-300 shadow-sm overflow-hidden bg-base-100 group
                  hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Image */}
                <figure
                  className="overflow-hidden bg-base-200 cursor-zoom-in"
                  onClick={open}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto block object-cover
                      group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </figure>

                {/* Footer strip */}
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-base-300">
                  <button
                    className="inline-flex items-center gap-1.5 text-xs text-base-content/40
                      hover:text-base-content/70 transition-colors duration-150"
                    onClick={open}
                    title="View full size"
                  >
                    <FontAwesomeIcon
                      icon={faUpRightAndDownLeftFromCenter}
                      className="w-2.5 h-2.5"
                    />
                    <span className="font-mono">{image.label}</span>
                  </button>

                  <button
                    className="inline-flex items-center gap-1 text-xs text-base-content/40
                      hover:text-base-content/70 transition-colors duration-150"
                    onClick={() => handleDownload(image.src)}
                    title="Download image"
                  >
                    <FontAwesomeIcon icon={faDownload} className="w-2.5 h-2.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  )
}
