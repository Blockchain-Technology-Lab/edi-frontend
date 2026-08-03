import {
  IPFS_EXPLAINER_YOUTUBE_ID,
  IPFS_EXPLAINER_VIDEO_LOCAL
} from '@/config/ipfsTutorial'
import { basePath } from '@/utils/paths'

export function IpfsExplainerVideo() {
  if (IPFS_EXPLAINER_YOUTUBE_ID) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-base-300">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${IPFS_EXPLAINER_YOUTUBE_ID}`}
          title="Sharing your node data with us — IPFS explainer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <video
      controls
      preload="metadata"
      poster={basePath + IPFS_EXPLAINER_VIDEO_LOCAL.poster}
      className="w-full rounded-xl border border-base-300"
    >
      <source
        src={basePath + IPFS_EXPLAINER_VIDEO_LOCAL.src}
        type="video/mp4"
      />
    </video>
  )
}
