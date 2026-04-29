import { MessageCircle, Mail, Instagram } from "lucide-react";
import { useCms } from "../cms/store";

export default function ContactPage() {
  const { brand } = useCms();
  const wa = `https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}`;
  return (
    <div className="container-x py-16 sm:py-24">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <span className="pill mb-4">تواصل</span>
          <h1
            className="font-sans font-extrabold text-5xl sm:text-7xl text-ink leading-[1.05] tracking-[-0.03em]"
            dir="auto"
          >
            حنا معاك.
          </h1>
          <p className="mt-5 text-body max-w-lg" dir="auto">
            تقدر تتواصل معنا فأي وقت لأي استفسار قبل أو بعد الطلب. كنخدمو بسرعة وبكل احترام.
          </p>

          <div className="mt-10 flex flex-col gap-3 max-w-md">
            <a href={wa} target="_blank" rel="noreferrer" className="btn-primary justify-center">
              <MessageCircle className="h-4 w-4" />
              WhatsApp — {brand.whatsapp}
            </a>
            <a href={`mailto:${brand.email}`} className="btn-ghost justify-center">
              <Mail className="h-4 w-4" />
              {brand.email}
            </a>
            {brand.socials.instagram && (
              <a
                href={brand.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost justify-center"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            )}
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="card p-6 sm:p-8">
            <h2
              className="font-sans font-extrabold text-2xl text-ink mb-4"
              dir="auto"
            >
              صيفط رسالة
            </h2>
            <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
              <input className="input" placeholder="اسمك" dir="auto" />
              <input className="input" placeholder="WhatsApp ولا البريد" dir="auto" />
              <textarea
                className="input min-h-[140px]"
                placeholder="الرسالة ديالك"
                dir="auto"
              />
              <button type="submit" className="btn-dark">
                صيفط
              </button>
              <p className="text-xs text-body" dir="auto">
                * هاد الفورم تجريبي. خليه على WhatsApp باش تاخذ جواب سريع.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
