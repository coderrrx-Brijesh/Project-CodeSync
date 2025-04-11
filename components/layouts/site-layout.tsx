"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/ui/footer";

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();

  // Determine if we should show the footer based on the current path
  // Don't show footer on editor routes
  const showFooter = !pathname.startsWith("/editor");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
