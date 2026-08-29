"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <SiteSettingsProvider>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && (
        <>
          <FloatingContact />
          <Footer />
        </>
      )}
    </SiteSettingsProvider>
  );
}
