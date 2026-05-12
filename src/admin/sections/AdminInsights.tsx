import { useState } from "react";
import { useCms } from "../../cms/store";
import { PageHeader, Section, Field } from "../ui";
import { ExternalLink, RotateCcw, Eye, MessageCircle, ClipboardList, CheckCircle2, ShieldCheck, Info, Activity } from "lucide-react";

const TIKTOK_PINK = "#EE1D52";

// TikTok mini-mark — used as a small chip on synced stat cards
function TiktokMark({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.49a8.16 8.16 0 0 0 4.77 1.52V6.65a4.85 4.85 0 0 1-1.84-.04Z" />
    </svg>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  tiktokSynced = false,
  tiktokEvent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  tiktokSynced?: boolean;
  tiktokEvent?: string;
}) {
  return (
    <div className="card relative p-5 flex items-center gap-4">
      {tiktokSynced && (
        <span
          className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none text-white"
          style={{ backgroundColor: TIKTOK_PINK }}
          title={`TikTok: ${tiktokEvent}`}
        >
          <TiktokMark size={9} />
          TT
        </span>
      )}
      <div className={`h-11 w-11 shrink-0 rounded-2xl grid place-items-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink leading-none">
          {value.toLocaleString("fr-MA")}
        </p>
        <p className="text-xs text-body mt-1">{label}</p>
      </div>
    </div>
  );
}

function Rate({ label, value }: { label: string; value: number }) {
  const pct = isNaN(value) || !isFinite(value) ? 0 : Math.min(value * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-ink">{label}</span>
        <span className="text-sm font-semibold text-ink">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full bg-ink transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminInsights() {
  const { brand, setBrand, trackingStats, resetStats } = useCms();
  const [clarityInput, setClarityInput] = useState(brand.clarityId ?? "");
  const [tiktokInput, setTiktokInput] = useState(brand.tiktokPixelId ?? "");
  const [saved, setSaved] = useState(false);
  const [tiktokSaved, setTiktokSaved] = useState(false);

  const { whatsappClicks, formStarts, formSubmissions, pageViews } = trackingStats;

  function saveClarityId() {
    setBrand({ clarityId: clarityInput.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function saveTiktokId() {
    setBrand({ tiktokPixelId: tiktokInput.trim() || undefined });
    setTiktokSaved(true);
    setTimeout(() => setTiktokSaved(false), 2000);
  }

  function handleReset() {
    if (confirm("تحذف جميع الإحصائيات المحلية؟")) resetStats();
  }

  const waRate = pageViews > 0 ? whatsappClicks / pageViews : 0;
  const formStartRate = pageViews > 0 ? formStarts / pageViews : 0;
  const conversionRate = pageViews > 0 ? formSubmissions / pageViews : 0;
  const completionRate = formStarts > 0 ? formSubmissions / formStarts : 0;

  const clarityDashboard = brand.clarityId
    ? `https://clarity.microsoft.com/projects/view/${brand.clarityId}/dashboard`
    : "https://clarity.microsoft.com";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Insights"
        description="تتبع سلوك الزوار وقيس معدلات التحويل."
        actions={
          brand.clarityId && (
            <a
              href={clarityDashboard}
              target="_blank"
              rel="noreferrer"
              className="btn-dark flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Clarity Dashboard
            </a>
          )
        }
      />

      {/* Clarity Setup */}
      <Section title="Microsoft Clarity" description="أدخل Project ID ديالك باش تبدا تسجل Sessions و Heatmaps.">
        <Field
          label="Clarity Project ID"
          hint='كتلقاه فـ Clarity → Settings → copy the ID (مثال: "abc12xyz")'
        >
          <div className="flex gap-2">
            <input
              className="input flex-1 font-mono"
              placeholder="abc12xyz"
              value={clarityInput}
              onChange={(e) => setClarityInput(e.target.value)}
            />
            <button
              onClick={saveClarityId}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                saved
                  ? "bg-green-100 text-green-700"
                  : "bg-ink text-white hover:bg-black"
              }`}
            >
              {saved ? "✓ Saved" : "Activate"}
            </button>
          </div>
        </Field>

        {brand.clarityId ? (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <span className="text-sm text-green-700">
              Clarity active — Project ID: <span className="font-mono font-semibold">{brand.clarityId}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <Info className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="text-sm text-amber-700">
              Clarity غير مفعّل — أدخل Project ID باش تبدا تسجل.
            </span>
          </div>
        )}
      </Section>

      {/* TikTok Pixel Setup */}
      <Section
        title="TikTok Pixel"
        description="Pixel ID ديال TikTok للـ Conversions API و الـ Standard Events (ViewContent, AddToCart, CompletePayment)."
      >
        <Field
          label="TikTok Pixel ID"
          hint='كتلقاه فـ TikTok Ads Manager → Assets → Events → Web Events (مثال: "D81INH3C77U1Q23A93SG")'
        >
          <div className="flex gap-2">
            <input
              className="input flex-1 font-mono"
              placeholder="D81INH3C77U1Q23A93SG"
              value={tiktokInput}
              onChange={(e) => setTiktokInput(e.target.value)}
            />
            <button
              onClick={saveTiktokId}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                tiktokSaved
                  ? "bg-green-100 text-green-700"
                  : "text-white hover:opacity-90"
              }`}
              style={tiktokSaved ? undefined : { backgroundColor: TIKTOK_PINK }}
            >
              {tiktokSaved ? "✓ Saved" : "Activate"}
            </button>
          </div>
        </Field>

        {brand.tiktokPixelId ? (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: `${TIKTOK_PINK}10`, border: `1px solid ${TIKTOK_PINK}40` }}
          >
            <span
              className="relative inline-flex h-2.5 w-2.5 shrink-0"
              aria-hidden
            >
              <span
                className="absolute inset-0 rounded-full opacity-75 animate-ping"
                style={{ backgroundColor: TIKTOK_PINK }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: TIKTOK_PINK }}
              />
            </span>
            <span className="text-sm" style={{ color: TIKTOK_PINK }}>
              <span className="font-bold">Pixel Active</span> — ID: <span className="font-mono font-semibold">{brand.tiktokPixelId}</span>
            </span>
            <span className="ms-auto" style={{ color: TIKTOK_PINK }}>
              <TiktokMark size={18} />
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <Info className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="text-sm text-amber-700">
              TikTok Pixel غير مفعّل — أدخل Pixel ID باش تبدا تتبع conversions.
            </span>
          </div>
        )}

        {/* Funnel events legend */}
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {[
            { event: "ViewContent",     label: "صفحة منتج",   icon: Eye },
            { event: "AddToCart",       label: "بدء النموذج", icon: ClipboardList },
            { event: "CompletePayment", label: "طلب مؤكد",     icon: CheckCircle2 },
          ].map(({ event, label, icon: Icon }) => (
            <div
              key={event}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5"
            >
              <span
                className="grid h-7 w-7 place-items-center rounded-lg text-white shrink-0"
                style={{ backgroundColor: TIKTOK_PINK }}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-mono font-semibold text-ink leading-none truncate">{event}</p>
                <p className="text-[10px] text-body mt-1 truncate" dir="rtl">{label}</p>
              </div>
              <Activity className="h-3 w-3 ms-auto shrink-0" style={{ color: TIKTOK_PINK }} />
            </div>
          ))}
        </div>
      </Section>

      {/* Stats grid */}
      <Section
        title="إحصائيات التحويل"
        description="أرقام محلية مخزنة فالمتصفح — تتحدث في الوقت الفعلي. الـ TT badge كيوريك أنا الحدث متزامن مع TikTok Pixel."
        actions={
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs text-body hover:text-red hover:border-red/30 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Eye} label="مشاهدات الصفحات" value={pageViews} color="bg-blue-50 text-blue-600" tiktokSynced tiktokEvent="PageView / ViewContent" />
          <StatCard icon={MessageCircle} label="نقرات WhatsApp" value={whatsappClicks} color="bg-green-50 text-green-600" />
          <StatCard icon={ClipboardList} label="نماذج بدأت" value={formStarts} color="bg-amber-50 text-amber-600" tiktokSynced tiktokEvent="AddToCart" />
          <StatCard icon={CheckCircle2} label="طلبات مؤكدة" value={formSubmissions} color="bg-ink/8 text-ink" tiktokSynced tiktokEvent="CompletePayment" />
        </div>
      </Section>

      {/* Conversion rates */}
      <Section title="معدلات التحويل" description="نسبة كل خطوة من إجمالي الزيارات.">
        <div className="space-y-4">
          <Rate label="معدل نقر WhatsApp (زوار → واتساب)" value={waRate} />
          <Rate label="معدل بدء النموذج (زوار → بدأوا الطلب)" value={formStartRate} />
          <Rate label="معدل التحويل الكلي (زوار → أكدوا الطلب)" value={conversionRate} />
          <Rate label="إتمام النموذج (بدأوا → أكدوا)" value={completionRate} />
        </div>
        {pageViews === 0 && (
          <p className="text-center text-sm text-body/50 pt-2">
            البيانات ستظهر هنا بمجرد وصول أول زائر.
          </p>
        )}
      </Section>

      {/* Privacy */}
      <Section title="الخصوصية والأمان">
        <div className="flex items-start gap-3 rounded-xl bg-bg border border-line px-4 py-4">
          <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm text-body space-y-1">
            <p className="font-semibold text-ink">البيانات الحساسة محمية تلقائياً</p>
            <p>حقول الاسم ورقم الهاتف فـ نموذج الطلب مضافة إليها <code className="text-xs bg-line px-1 py-0.5 rounded">data-clarity-mask</code> — Clarity لن تسجل محتواها في الـ Session Recordings.</p>
            <p>البيانات المحلية (الإحصائيات) مخزنة فـ المتصفح فقط ولا تغادر جهازك.</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
