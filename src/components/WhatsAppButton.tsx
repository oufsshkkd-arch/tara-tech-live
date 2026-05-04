import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useCms } from "../cms/store";
import { useAnalytics } from "../hooks/useAnalytics";

export default function WhatsAppButton() {
  const { brand } = useCms();
  const { trackWhatsAppClick } = useAnalytics();
  const [hovered, setHovered] = useState(false);
  const phone = brand.whatsapp.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noreferrer"
      onClick={trackWhatsAppClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-0 group"
      aria-label="WhatsApp"
    >
      {/* Label that slides out on hover */}
      <span
        className={`
          overflow-hidden whitespace-nowrap text-sm font-medium text-white
          bg-[#25D366] rounded-l-full transition-all duration-300 ease-out
          ${hovered ? "max-w-[160px] pl-5 pr-2 py-3" : "max-w-0 px-0 py-3"}
        `}
      >
        تواصل معنا
      </span>
      {/* Green circle */}
      <span className="relative h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 group-hover:scale-105">
        <MessageCircle className="h-6 w-6" fill="white" strokeWidth={0} />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-wa-pulse" />
      </span>
    </a>
  );
}
