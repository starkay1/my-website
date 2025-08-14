import type { Metadata } from 'next';
import { Inter, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GoogleOptimize from '@/components/analytics/GoogleOptimize';
import { PerformanceMonitor } from '@/components/ui/PerformanceOptimizer';
import { OrganizationSchema, WebsiteSchema } from '@/components/SEO/StructuredData';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Spaceplus Worldwide｜全球夜生活品牌管理与孵化平台',
  description: '提供夜店项目托管、品牌顾问、品牌孵化与授权服务，帮助项目高效起盘与稳定增长。',
  keywords: [
    '夜生活', '夜店管理', '品牌孵化', '项目托管', '品牌顾问', 'Spaceplus', '全球夜生活',
    'nightlife', 'club management', 'brand incubation', 'project hosting', 'brand consulting', 'nightclub',
    'ชีวิตยามค่ำคืน', 'การจัดการคลับ', 'การบ่มเพาะแบรนด์', 'การโฮสต์โครงการ', 'ที่ปรึกษาแบรนด์'
  ],
  authors: [{ name: 'Spaceplus Worldwide' }],
  creator: 'Spaceplus Worldwide',
  publisher: 'Spaceplus Worldwide',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://spaceplusworldwide.club'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh-CN',
      'en': '/en',
      'th': '/th',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://spaceplusworldwide.club',
    title: 'Spaceplus Worldwide｜全球夜生活品牌管理与孵化平台',
    description: '提供夜店项目托管、品牌顾问、品牌孵化与授权服务，帮助项目高效起盘与稳定增长。',
    siteName: 'Spaceplus Worldwide',
    images: [
      {
        url: '/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Spaceplus Worldwide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spaceplus Worldwide｜全球夜生活品牌管理与孵化平台',
    description: '提供夜店项目托管、品牌顾问、品牌孵化与授权服务，帮助项目高效起盘与稳定增长。',
    images: ['/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7A3EFF" />
        <meta name="msapplication-TileColor" content="#7A3EFF" />
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className="antialiased bg-white text-neutral-900">
        <PerformanceMonitor>
          {children}
        </PerformanceMonitor>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_OPTIMIZE_ID && (
          <GoogleOptimize optimizeId={process.env.NEXT_PUBLIC_OPTIMIZE_ID} />
        )}
      </body>
    </html>
  );
}