'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [gaId]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: typeof document !== 'undefined' ? document.title : '',
              page_location: typeof window !== 'undefined' ? window.location.href : '',
            });
          `,
        }}
      />
    </>
  );
}

// 扩展 Window 接口
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}