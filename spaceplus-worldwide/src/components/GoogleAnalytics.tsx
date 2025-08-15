'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { initializeAnalytics, trackPageView } from '@/lib/analytics';

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string;
}

const GoogleAnalytics = ({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) => {
  useEffect(() => {
    // Initialize analytics after the script loads
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        initializeAnalytics();
        trackPageView(window.location.pathname);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;

// Helper function to track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Note: trackPageView is imported from @/lib/analytics to avoid conflicts