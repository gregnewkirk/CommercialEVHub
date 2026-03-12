"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/leads", label: "My Leads", icon: Users },
  { href: "/portal/profile", label: "My Profile", icon: UserCircle },
] as const;

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/portal"
            ? pathname === "/portal"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-navy/10 font-medium text-navy"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}

      <div className="mt-4 border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
