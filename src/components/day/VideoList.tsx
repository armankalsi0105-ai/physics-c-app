'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, VideoOff } from 'lucide-react'
import { youtubeId } from '@/lib/curriculum'
import type { Video } from '@/lib/types'

type Status = 'checking' | 'available' | 'unavailable'

export function VideoList({ videos }: { videos: Video[] }) {
  if (!videos?.length) {
    return (
      <div className="video-empty" role="status">
        <VideoOff className="h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">No videos available</p>
          <p className="text-sm opacity-80">
            There are no curated video lessons for this section yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className="m-0 list-none space-y-4 p-0">
      {videos.map((v) => (
        <VideoItem key={`${v.url}-${v.title}`} video={v} />
      ))}
    </ul>
  )
}

function VideoItem({ video }: { video: Video }) {
  const id = youtubeId(video.url)
  const [status, setStatus] = useState<Status>(id ? 'checking' : 'unavailable')

  useEffect(() => {
    // No id means the initial state is already 'unavailable'.
    if (!id) return

    let cancelled = false
    const controller = new AbortController()

    async function check() {
      try {
        const res = await fetch(
          `/api/youtube-status?url=${encodeURIComponent(video.url)}`,
          { signal: controller.signal },
        )
        const data = (await res.json()) as { available?: boolean }
        if (!cancelled) setStatus(data.available ? 'available' : 'unavailable')
      } catch {
        if (!cancelled) setStatus('unavailable')
      }
    }

    void check()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [id, video.url])

  return (
    <li className="video-item">
      <div className="video-item__meta">
        <h4>{video.title}</h4>
        <p>
          {video.channel}
          {(video.access ?? 'free') === 'free' && (
            <span className="video-free-badge"> Free</span>
          )}
        </p>
      </div>

      {status === 'checking' && (
        <div className="video-item__placeholder" role="status">
          Checking video availability…
        </div>
      )}

      {status === 'unavailable' && (
        <div className="video-item__unavailable" role="status">
          <VideoOff className="h-6 w-6 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Video unavailable</p>
            <p className="text-sm opacity-85">
              This lesson video cannot be played or embedded right now.
            </p>
            {video.url ? (
              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="video-item__link"
              >
                Try opening on YouTube
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      )}

      {status === 'available' && id && (
        <div className="video-item__frame">
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </li>
  )
}
