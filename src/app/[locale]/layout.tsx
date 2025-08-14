import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Noto_Sans_SC } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GoogleOptimize from '@/components/analytics/GoogleOptimize';
import UserBehaviorTracker from '@/components/analytics/UserBehaviorTracker';
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

const locales = ['zh-CN', 'en', 'th'];

// 生成静态参数以支持静态导出
export async function generateStaticParams() {
  // Return all locales for static generation
  // next-intl will handle the path generation based on localePrefix setting
  return [
    { locale: 'zh-CN' },
    { locale: 'en' },
    { locale: 'th' }
  ];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${inter.variable} ${notoSansSC.variable}`}>
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
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </PerformanceMonitor>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_OPTIMIZE_ID && (
          <GoogleOptimize optimizeId={process.env.NEXT_PUBLIC_OPTIMIZE_ID} />
        )}
        <UserBehaviorTracker
          enableHeatmap={process.env.NODE_ENV === 'production'}
          enableScrollTracking={true}
          enableClickTracking={true}
        />
      </body>
    </html>
  );
}