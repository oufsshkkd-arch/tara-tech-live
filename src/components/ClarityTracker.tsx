import { useEffect } from "react";
import { useCms } from "../cms/store";

export default function ClarityTracker() {
  const clarityId = useCms((s) => s.brand.clarityId);

  useEffect(() => {
    if (!clarityId) return;
    // Skip if already loaded (e.g. hardcoded in index.html)
    if (document.getElementById("ms-clarity-script") || window.clarity) return;

    const s = document.createElement("script");
    s.id = "ms-clarity-script";
    s.type = "text/javascript";
    s.async = true;
    s.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`;
    document.head.appendChild(s);
  }, [clarityId]);

  return null;
}
