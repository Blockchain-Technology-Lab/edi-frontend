// src/components/InfographicsImages.tsx

import { useEffect, useState } from 'react'
import { INFOGRAPHICS } from '@/utils/paths'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'

export function InfographicsImages() {
    const [isClient, setIsClient] = useState(false)

    const images = [
        { src: INFOGRAPHICS + '01.png', alt: 'Image 1', width: 1200, height: 800 },
        { src: INFOGRAPHICS + '02.png', alt: 'Image 2', width: 1200, height: 800 },
        { src: INFOGRAPHICS + '03.png', alt: 'Image 3', width: 1200, height: 800 },
        { src: INFOGRAPHICS + '04.png', alt: 'Image 4', width: 1200, height: 800 },
    ]

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = imageUrl.split('/').pop() || 'EDI_Infographics.png'
        link.click()
    }

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return (
        <Gallery>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <Item
                        key={index}
                        original={image.src}
                        thumbnail={image.src}
                        width={image.width}
                        height={image.height}
                    >
                        {(props) => (
                            <div
                                ref={props.ref}
                                onClick={props.open}
                                className="relative cursor-pointer rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300"
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                                <button
                                    className="absolute top-2 right-2 p-1 rounded-full bg-base-200 text-base-content border border-base-300 text-xs opacity-0 group-hover:opacity-100 transition"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDownload(image.src)
                                    }}
                                >
                                    Download
                                </button>
                            </div>
                        )}
                    </Item>
                ))}
            </div>
        </Gallery>
    )
}
