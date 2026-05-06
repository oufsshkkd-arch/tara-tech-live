import { useCms } from "../cms/store";
import type { AnnouncementBarSettings } from "../cms/types";

export default function AnnouncementBar({
  announcementBar: announcementBarProp,
}: {
  announcementBar?: AnnouncementBarSettings;
} = {}) {
  const cms = useCms();
  const announcementBar = announcementBarProp ?? cms.announcementBar;

  if (!announcementBar.enabled || announcementBar.messages.length === 0) {
    return null;
  }

  const sorted = [...announcementBar.messages].sort((a, b) => a.order - b.order);
  const bg = announcementBar.backgroundColor || "#FAFAFA";
  const color = announcementBar.textColor || undefined;

  return (
    <div
      className="absolute top-0 inset-x-0 z-[60] h-[36px] border-b border-black/[0.03] flex items-center overflow-hidden"
      dir="ltr"
      style={{ backgroundColor: bg, color }}
    >
      <div
        className="marquee-track"
        style={{ animationDuration: `${announcementBar.speed}s` }}
      >
        {/* Duplicate for seamless loop */}
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex items-center shrink-0">
            {sorted.map((msg) => (
              <div key={msg.id} className="flex items-center">
                <a
                  href={announcementBar.link || undefined}
                  className={`text-[11px] font-medium tracking-wide ${
                    msg.accent
                      ? "text-red font-semibold"
                      : announcementBar.textColor
                        ? ""
                        : "text-ink/90"
                  }`}
                >
                  {msg.text}
                </a>
                <span className="mx-6 h-[3px] w-[3px] rounded-full bg-ink/15" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
