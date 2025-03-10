"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faTimes } from "@fortawesome/free-solid-svg-icons"
import { INFOGRAPHICS } from "@/utils"

import { Gallery, Item } from "react-photoswipe-gallery"

export function InfographicsImages() {
  const [isClient, setIsClient] = useState(false)

  const images = [
    { src: INFOGRAPHICS + "01.png", alt: "Image 1", width: 1200, height: 800 },
    { src: INFOGRAPHICS + "02.png", alt: "Image 2", width: 1200, height: 800 },
    { src: INFOGRAPHICS + "03.png", alt: "Image 3", width: 1200, height: 800 },
    { src: INFOGRAPHICS + "04.png", alt: "Image 4", width: 1200, height: 800 }
  ]

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = imageUrl.split("/").pop() || "EDI_Infographics.png" // Name the download file
    link.click()
  }

  // Only run on client-side
  useEffect(() => {
    setIsClient(true)
    /*lightbox.option({
      resizeDuration: 200,
      wrapAround: true
    }) */
  }, [])

  if (!isClient) {
    return null // Return null or a loading state for SSR
  }

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
            {({ ref, open }) => (
              <div className="relative group">
                <Image
                  //ref={ref}
                  //onClick={open}
                  onClick={() => handleDownload(image.src)}
                  src={image.src}
                  alt={image.alt}
                  width={300}
                  height={200}
                  className="cursor-pointer rounded-lg shadow-md hover:shadow-lg transition"
                />
                {/*<button
                  className="absolute top-2 right-2 p-2 rounded-full shadow-md hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(image.src)
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button> */}
              </div>
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  )
}
