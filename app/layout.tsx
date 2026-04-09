import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProviderWrapper } from "@/lib/query-client";

export const metadata: Metadata = {
  title: "Kraftigo Admin",
  description: "Internal admin dashboard for Kraftigo"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
      </body>
    </html>
  );
}

