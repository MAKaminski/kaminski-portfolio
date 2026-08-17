import React from 'react';
import type { Clip } from '../data/clips';

interface VideoEmbedProps {
  clip: Clip;
  /** Constrain the player width. Vertical clips get unreadable past ~360px. */
  maxWidthPx?: number;
  className?: string;
}

/**
 * Vertical (9:16) clip player.
 *
 * `preload="none"` on purpose: these sit on routes whose Lighthouse budget is
 * already spent on the bundle, and a 2.5MB fetch on mount would be paid by every
 * visitor who never presses play. The poster carries the frame until they do.
 */
const VideoEmbed: React.FC<VideoEmbedProps> = ({ clip, maxWidthPx = 340, className = '' }) => (
  <figure className={`mx-auto ${className}`} style={{ maxWidth: maxWidthPx }}>
    <video
      className="w-full rounded-2xl border border-white/10 bg-black shadow-2xl"
      src={clip.src}
      poster={clip.poster}
      width={clip.width}
      height={clip.height}
      controls
      playsInline
      preload="none"
      aria-label={clip.title}
    >
      <p className="text-white/60">
        Your browser doesn’t support embedded video.{' '}
        <a href={clip.src} className="text-accent underline">
          Download the clip
        </a>
        .
      </p>
    </video>
    <figcaption className="mt-3 text-sm text-white/50 text-center">
      {clip.title} · {clip.durationSec}s
    </figcaption>
  </figure>
);

export default VideoEmbed;
