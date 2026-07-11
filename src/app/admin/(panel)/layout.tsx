import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-base tracking-tight">
            Alex
            <span aria-hidden className="text-accent-brand">
              .
            </span>
            <span className="text-muted-foreground font-sans text-sm"> admin</span>
          </Link>
          <AdminNav />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
