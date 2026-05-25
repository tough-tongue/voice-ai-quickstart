import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";
import { PersistentWidgets } from "@/components/widgets/PersistentWidgets";
import { AppConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: AppConfig.app.name,
  description: AppConfig.app.description,
  ...(AppConfig.app.isDev && { robots: { index: false, follow: false } }),
};

/**
 * Root layout.
 *
 * SessionProvider + PersistentWidgets are mounted here — outside the page
 * slot — so the ToughTongue AI iframe (and its live voice session) is never
 * destroyed when the user navigates between pages.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <PersistentWidgets />
        </SessionProvider>
      </body>
    </html>
  );
}
