import type {Metadata} from "next";
import {Cormorant_Garamond, DM_Sans} from "next/font/google";
import "./globals.css";
import {QueryProvider} from "@/presentation/providers/query-provider";
import {APP_NAME} from "@/config/constants";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Timeless furniture, designed for quiet living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} min-h-full antialiased`}
    >
      <body className="bg-cream text-ink font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
