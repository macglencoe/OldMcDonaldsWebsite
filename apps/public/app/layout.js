import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieNotice from "@/components/cookieNotice";
import { loadFlags, getFeatureEvaluator } from "./flags";
import { FlagsProvider } from "./FlagsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Old McDonald's",
  description: "The official website for Old McDonald's Pumpkin Patch and Corn Maze in Inwood, WV",
  icons: {
    icon: '/favicon.ico'
  }
};



export default async function RootLayout({ children }) {
  const flags = await loadFlags();
  const isFeatureEnabled = getFeatureEvaluator(flags);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        { isFeatureEnabled("show_cookie_notice") &&
          <CookieNotice />
        }
        <FlagsProvider flags={flags}>{children}</FlagsProvider>
      </body>
    </html>
  );
}
