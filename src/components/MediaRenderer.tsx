import { motion, useReducedMotion } from "framer-motion";
import type { MediaAsset } from "../cms/types";

export default function MediaRenderer({
  image,
  video,
  poster,
  alt = "",
  enableVideo = false,
  className = "",
  parallax = false,
}: {
  image?: MediaAsset | null;
  video?: MediaAsset | null;
  poster?: MediaAsset | null;
  alt?: string;
  enableVideo?: boolean;
  className?: string;
  parallax?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const imageUrl = image?.url ?? "";
  const videoUrl = video?.url ?? "";
  const posterUrl = poster?.url ?? imageUrl;
  const motionProps =
    parallax && !reduceMotion
      ? {
          initial: { scale: 1.04, y: 18 },
          whileInView: { scale: 1.01, y: 0 },
          viewport: { once: true, amount: 0.35 },
          transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
        }
      : {};

  return (
    <motion.div className={`relative overflow-hidden ${className}`} {...motionProps}>
      {enableVideo && videoUrl ? (
        <video
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type={video?.mimeType || "video/mp4"} />
        </video>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100" />
      )}
    </motion.div>
  );
}
