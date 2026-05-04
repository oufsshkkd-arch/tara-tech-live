import { CheckCircle2, ArrowRight } from "lucide-react";
import type { StoryContent, WhyContent, FinalCtaContent } from "../../cms/types";

type Props = {
  story: StoryContent;
  why: WhyContent;
  finalCta: FinalCtaContent;
  activeTab: "story" | "why" | "finalCta";
  mode: "desktop" | "mobile";
};

export default function StoryPreview({ story, why, finalCta, activeTab, mode }: Props) {
  const isMobile = mode === "mobile";

  return (
    <div className="font-sans select-none bg-white">
      {/* Story */}
      {activeTab === "story" && (
        <div className={`${isMobile ? "flex flex-col gap-6 p-6" : "flex gap-12 px-16 py-14 items-center"}`}>
          <div className="flex-1 min-w-0">
            <h2
              className={`font-extrabold text-gray-900 leading-tight tracking-tight ${isMobile ? "text-2xl" : "text-4xl"}`}
              dir="auto"
            >
              {story.title || "قصتنا"}
            </h2>
            <p
              className={`mt-4 text-gray-500 leading-relaxed ${isMobile ? "text-sm" : "text-base"}`}
              dir="auto"
            >
              {story.body || "اكتب قصة علامتك هنا..."}
            </p>
          </div>
          {story.image && (
            <div className={`shrink-0 rounded-2xl overflow-hidden ${isMobile ? "w-full h-48" : "w-80 h-64"}`}>
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Why */}
      {activeTab === "why" && (
        <div className={`${isMobile ? "px-6 py-8" : "px-16 py-14"}`}>
          <h2
            className={`font-extrabold text-gray-900 leading-tight tracking-tight ${isMobile ? "text-2xl" : "text-4xl"}`}
            dir="auto"
          >
            {why.title || "علاش تختارنا؟"}
          </h2>
          {why.intro && (
            <p className="mt-3 text-gray-500 leading-relaxed text-sm max-w-xl" dir="auto">
              {why.intro}
            </p>
          )}
          <ul className={`mt-6 grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {why.points.map((p, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm font-medium text-gray-800" dir="auto">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Final CTA */}
      {activeTab === "finalCta" && (
        <div className={`bg-gray-900 rounded-2xl mx-4 my-6 ${isMobile ? "px-6 py-10" : "px-16 py-14"}`}>
          <h2
            className={`font-extrabold text-white leading-tight tracking-tight ${isMobile ? "text-2xl" : "text-4xl"}`}
            dir="auto"
          >
            {finalCta.title || "جربها اليوم"}
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed text-sm max-w-md" dir="auto">
            {finalCta.body}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {finalCta.primaryCta && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-6 py-2.5 text-sm font-semibold">
                {finalCta.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
            {finalCta.secondaryCta && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-5 py-2.5 text-sm font-medium">
                {finalCta.secondaryCta}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
