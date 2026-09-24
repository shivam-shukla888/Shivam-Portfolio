import type { Metadata, Viewport } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion";
import { ShivSastraAssistant } from "@/components/ai/ShivSastraAssistant";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Shivam Shukla",
    default: "Shivam Shukla — Backend Systems, Agentic AI & AI Security",
  },
  description:
    "Personal digital headquarters of Shivam Shukla. Engineering backend systems, agentic AI workflows, and AI security software — with curated digital releases via SHIVSASTRA Store.",
  keywords: [
    "Shivam Shukla",
    "ShivSastra",
    "Backend Systems",
    "Agentic AI",
    "AI Security",
    "AI Agents",
    "Digital Products",
    "Software Architecture",
  ],
  authors: [{ name: "Shivam Shukla" }],
  creator: "Shivam Shukla",
  metadataBase: new URL("https://shivsastra.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shivsastra.com",
    siteName: "SHIVSASTRA",
    title: "Shivam Shukla — Backend Systems, Agentic AI & AI Security",
    description:
      "Personal digital headquarters of Shivam Shukla. Engineering backend systems, agentic AI workflows, and AI security software — with curated digital releases via SHIVSASTRA Store.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Shukla — Backend Systems, Agentic AI & AI Security",
    description:
      "Personal digital headquarters of Shivam Shukla. Engineering backend systems, agentic AI workflows, and AI security software — with curated digital releases via SHIVSASTRA Store.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)] font-body">
        {/* Accessible Keyboard Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[var(--color-surface-dark)] focus:text-[var(--color-dark-ink-primary)] focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:border focus:border-[var(--color-accent)] focus:outline-none focus:shadow-md"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
            {children}
          </main>
          <Footer />
          <ShivSastraAssistant />
        </MotionProvider>
      </body>
    </html>
  );
}
