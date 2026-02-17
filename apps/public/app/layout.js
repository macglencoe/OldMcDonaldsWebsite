import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieNotice from "@/components/cookieNotice";
import { getFlagEvaluator, getFlags } from "./flags.server";
import { getConfigs } from "./configs.server";
import { FlagsProvider } from "./FlagsContext";
import { ConfigsProvider } from "./ConfigsContext";

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
  const [flags, configs] = await Promise.all([getFlags(), getConfigs()]);
  const isFeatureEnabled = getFlagEvaluator(flags);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {isFeatureEnabled("show_cookie_notice") && <CookieNotice />}
        <FlagsProvider flags={flags}>
          <ConfigsProvider configs={configs}>{children}</ConfigsProvider>
        </FlagsProvider>
      </body>
    </html>
  );
}
