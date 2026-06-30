import { PreviewPane } from "@/components/admin/preview-pane";
import { HOME_VARIANTS } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function AdminPreviewPage() {
  const variants = HOME_VARIANTS.map((v) => ({ value: v.value, label: v.label }));
  return <PreviewPane variants={variants} />;
}
