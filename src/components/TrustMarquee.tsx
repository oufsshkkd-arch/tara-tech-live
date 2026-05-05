import { useCms } from "../cms/store";

export default function TrustMarquee() {
  const { marqueeItems } = useCms();

  if (!marqueeItems.length) return null;

  // Repeat 4× for a seamless infinite loop at any screen width
  const repeated = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="overflow-hidden border-y border-line bg-line/20 py-3">
      <div className="flex w-full">
        <div className="marquee-track flex shrink-0 items-center gap-10 pr-10" dir="rtl">
          {repeated.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-ink/80 whitespace-nowrap"
            >
              <span className="text-red">✦</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
