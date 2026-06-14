import type { Metadata } from "next";
import { Outfit, Montserrat, Great_Vibes } from "next/font/google";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { Providers } from "@/context/Providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Bida Anh Lý - Cơ Bida Đẳng Cấp",
  description: "Cửa hàng bán cơ bida và phụ kiện bida uy tín, chất lượng.",
  appleWebApp: {
    capable: true,
    title: "Bida Anh Lý",
    statusBarStyle: "black-translucent",
  },
  applicationName: "Bida Anh Lý",
  themeColor: "#1e5a3e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${outfit.variable} ${montserrat.variable} ${greatVibes.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
