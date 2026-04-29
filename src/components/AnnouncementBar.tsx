import { useCms } from "../cms/store";

export default function AnnouncementBar() {
  const { announcementBar } = useCms();

  if (!announcementBar.enabled || announcementBar.messages.length === 0) {
    return null;
  }

  const sorted = [...announcementBar.messages].sort((a, b) => a.order - b.order);

  return (
    <div
      className="absolute top-0 inset-x-0 z-[60] h-[36px] bg-[#FAFAFA] border-b border-black/[0.03] flex items-center overflow-hidden"
      dir="ltr"
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
                <span
                  className={`text-[11px] font-medium tracking-wide ${
                    msg.accent
                      ? "text-red font-semibold"
                      : "text-ink/90"
                  }`}
                >
                  {msg.text}
                </span>
                <span className="mx-6 h-[3px] w-[3px] rounded-full bg-ink/15" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
