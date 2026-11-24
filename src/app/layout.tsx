import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ResGap — Academic Research Gap Finder & Literature Synthesizer',
  description: 'AI-assisted academic literature synthesizer that extracts limitations from research papers and isolates publishable methodological, empirical, and theoretical research gaps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f4f7f6] text-slate-800 selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
