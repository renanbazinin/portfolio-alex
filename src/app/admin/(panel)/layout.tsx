import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            View site ↗
          </Link>
        </div>
        <LogoutButton />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
