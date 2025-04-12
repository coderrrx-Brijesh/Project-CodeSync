import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";
import { SiteLayout } from "@/components/layouts/site-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeSync - Real-time Collaborative Code Editor",
  description:
    "A state-of-the-art platform for real-time collaborative code editing",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon-static.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/favicon-static.svg",
        type: "image/svg+xml",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon-static.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="alternate icon"
          href="/favicon-static.svg"
          type="image/svg+xml"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteLayout>{children}</SiteLayout>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
