import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MotionProvider } from "@/components/motion/motion-provider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        {/* pt matches the fixed header height */}
        <main className="flex-1 pt-16">{children}</main>
        <SiteFooter />
      </div>
    </MotionProvider>
  );
}
