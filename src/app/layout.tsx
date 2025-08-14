import type { Metadata } from 'next';
import { Inter, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

// 导入应用初始化模块（仅在服务器端执行）
if (typeof window === 'undefined') {
  import('@/lib/app-init');
}

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
      </head>
      <body className="antialiased bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        {children}
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'XXXXXXXXXXXXXXX');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=XXXXXXXXXXXXXXX&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}