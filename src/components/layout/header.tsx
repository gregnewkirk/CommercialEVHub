"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/grants", label: "Grants" },
  { href: "/contractors", label: "Contractors" },
  { href: "/hardware", label: "Hardware" },
  { href: "/calculator", label: "Calculator" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Zap className="size-5 text-ev-green" />
          <span className="text-lg font-bold tracking-tight text-white">
            Commercial<span className="text-ev-green">EVHub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/portal" className="ml-3">
            <Button variant="outline" size="sm" className="border-ev-green/50 text-ev-green hover:bg-ev-green/10">
              For Installers
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-white md:hidden" />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-navy">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-white">
                <Zap className="size-4 text-ev-green" />
                Commercial<span className="text-ev-green">EVHub</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith(link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/portal" onClick={() => setOpen(false)} className="mt-3">
                <Button variant="outline" size="sm" className="w-full border-ev-green/50 text-ev-green hover:bg-ev-green/10">
                  For Installers
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
