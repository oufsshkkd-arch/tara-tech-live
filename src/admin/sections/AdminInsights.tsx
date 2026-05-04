import { useState } from "react";
import { useCms } from "../../cms/store";
import { PageHeader, Section, Field } from "../ui";
import { ExternalLink, RotateCcw, Eye, MessageCircle, ClipboardList, CheckCircle2, ShieldCheck, Info } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
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
  const [saved, setSaved] = useState(false);

  const { whatsappClicks, formStarts, formSubmissions, pageViews } = trackingStats;

  function saveClarityId() {
    setBrand({ clarityId: clarityInput.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

      {/* Stats grid */}
      <Section
        title="إحصائيات التحويل"
        description="أرقام محلية مخزنة فالمتصفح — تتحدث في الوقت الفعلي."
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
          <StatCard icon={Eye} label="مشاهدات الصفحات" value={pageViews} color="bg-blue-50 text-blue-600" />
          <StatCard icon={MessageCircle} label="نقرات WhatsApp" value={whatsappClicks} color="bg-green-50 text-green-600" />
          <StatCard icon={ClipboardList} label="نماذج بدأت" value={formStarts} color="bg-amber-50 text-amber-600" />
          <StatCard icon={CheckCircle2} label="طلبات مؤكدة" value={formSubmissions} color="bg-ink/8 text-ink" />
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
