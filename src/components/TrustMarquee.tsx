export default function TrustMarquee() {
  const items = [
    "شحن سريع",
    "دفع عند الاستلام",
    "منتجات أصلية 100%",
    "ضمان الجودة",
  ];

  // Duplicate items a few times to ensure smooth infinite loop
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden border-y border-line bg-line/20 py-3">
      <div className="flex w-full">
        <div className="marquee-track flex shrink-0 items-center gap-10 pr-10" dir="rtl">
          {repeatedItems.map((item, idx) => (
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
