// Enhanced Google Analytics configuration and utilities

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (command: string, targetId?: string, config?: Record<string, unknown>) => void;
  }
}



// Analytics configuration
export const analyticsConfig = {
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  debug: process.env.NODE_ENV === 'development',
  
  // Enhanced ecommerce and conversion tracking
  conversionEvents: {
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    PHONE_CLICK: 'phone_click',
    EMAIL_CLICK: 'email_click',
    SERVICE_INQUIRY: 'service_inquiry',
    QUOTE_REQUEST: 'quote_request',
    DOWNLOAD_BROCHURE: 'download_brochure',
    VIDEO_PLAY: 'video_play',
    SCROLL_DEPTH: 'scroll_depth',
    PAGE_VIEW_DURATION: 'page_view_duration',
  },
  
  // Custom dimensions for better tracking
  customDimensions: {
    USER_LANGUAGE: 'custom_dimension_1',
    PAGE_CATEGORY: 'custom_dimension_2',
    USER_TYPE: 'custom_dimension_3',
    TRAFFIC_SOURCE: 'custom_dimension_4',
  },
};

// Enhanced event tracking interface
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

// Initialize Google Analytics
export function initializeAnalytics() {
  if (typeof window === 'undefined' || !analyticsConfig.measurementId) {
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', analyticsConfig.measurementId, {
    debug_mode: analyticsConfig.debug,
    send_page_view: false, // We'll handle page views manually
    anonymize_ip: true,
    allow_google_signals: true,
    allow_ad_personalization_signals: false,
  });

  // Set up enhanced ecommerce
  gtag('config', analyticsConfig.measurementId, {
    custom_map: {
      [analyticsConfig.customDimensions.USER_LANGUAGE]: 'user_language',
      [analyticsConfig.customDimensions.PAGE_CATEGORY]: 'page_category',
      [analyticsConfig.customDimensions.USER_TYPE]: 'user_type',
      [analyticsConfig.customDimensions.TRAFFIC_SOURCE]: 'traffic_source',
    },
  });
}

// Track page views with enhanced data
export function trackPageView(url: string, title?: string, additionalData?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  const pageData = {
    page_title: title || document.title,
    page_location: url,
    page_referrer: document.referrer,
    user_language: navigator.language,
    ...additionalData,
  };

  window.gtag('config', analyticsConfig.measurementId, {
    page_title: pageData.page_title,
    page_location: pageData.page_location,
  });

  // Send custom page view event with additional data
  window.gtag('event', 'page_view', pageData);
}

// Enhanced event tracking
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  const eventData = {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  };

  window.gtag('event', event.action, eventData);

  // Debug logging
  if (analyticsConfig.debug) {
    console.log('Analytics Event:', event.action, eventData);
  }
}

// Conversion tracking functions
export const trackConversion = {
  contactForm: (formType: string, success: boolean) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.CONTACT_FORM_SUBMIT,
      category: 'conversion',
      label: formType,
      value: success ? 1 : 0,
      custom_parameters: {
        form_type: formType,
        success: success,
        timestamp: new Date().toISOString(),
      },
    });
  },

  phoneClick: (phoneNumber: string) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.PHONE_CLICK,
      category: 'engagement',
      label: phoneNumber,
      value: 1,
      custom_parameters: {
        contact_method: 'phone',
        phone_number: phoneNumber,
      },
    });
  },

  emailClick: (emailAddress: string) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.EMAIL_CLICK,
      category: 'engagement',
      label: emailAddress,
      value: 1,
      custom_parameters: {
        contact_method: 'email',
        email_address: emailAddress,
      },
    });
  },

  serviceInquiry: (serviceType: string, source: string) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.SERVICE_INQUIRY,
      category: 'conversion',
      label: serviceType,
      value: 1,
      custom_parameters: {
        service_type: serviceType,
        inquiry_source: source,
      },
    });
  },

  quoteRequest: (serviceType: string, estimatedValue?: number) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.QUOTE_REQUEST,
      category: 'conversion',
      label: serviceType,
      value: estimatedValue || 1,
      custom_parameters: {
        service_type: serviceType,
        estimated_value: estimatedValue,
      },
    });
  },
};

// User engagement tracking
export const trackEngagement = {
  scrollDepth: (percentage: number, page: string) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.SCROLL_DEPTH,
      category: 'engagement',
      label: page,
      value: percentage,
      custom_parameters: {
        scroll_percentage: percentage,
        page_url: page,
      },
    });
  },

  videoPlay: (videoTitle: string, duration?: number) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.VIDEO_PLAY,
      category: 'engagement',
      label: videoTitle,
      value: duration || 1,
      custom_parameters: {
        video_title: videoTitle,
        video_duration: duration,
      },
    });
  },

  timeOnPage: (seconds: number, page: string) => {
    trackEvent({
      action: analyticsConfig.conversionEvents.PAGE_VIEW_DURATION,
      category: 'engagement',
      label: page,
      value: seconds,
      custom_parameters: {
        duration_seconds: seconds,
        page_url: page,
      },
    });
  },
};

// Set user properties
export function setUserProperties(properties: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', analyticsConfig.measurementId, {
    user_properties: properties,
  });
}

// Set custom dimensions
export function setCustomDimensions(dimensions: Record<string, string>) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', analyticsConfig.measurementId, {
    custom_map: dimensions,
  });
}

// Enhanced ecommerce tracking (for future use)
export const trackEcommerce = {
  purchase: (transactionId: string, value: number, currency: string, items: unknown[]) => {
    if (typeof window === 'undefined' || !window.gtag) {
      return;
    }

    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  },

  addToCart: (itemId: string, itemName: string, value: number) => {
    if (typeof window === 'undefined' || !window.gtag) {
      return;
    }

    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        quantity: 1,
        price: value,
      }],
    });
  },
};

// Performance tracking
export function trackPerformance() {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Track Core Web Vitals (simplified without web-vitals library)
  // Note: Install web-vitals package for full functionality: npm install web-vitals
  try {
    // Basic performance metrics using Performance API
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Track page load time
          window.gtag('event', 'page_load_time', {
            event_category: 'performance',
            event_label: 'load_time',
            value: Math.round(navEntry.loadEventEnd - navEntry.loadEventStart),
            non_interaction: true,
          });
          
          // Track DOM content loaded time
          window.gtag('event', 'dom_content_loaded', {
            event_category: 'performance',
            event_label: 'dcl_time',
            value: Math.round(navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart),
            non_interaction: true,
          });
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
  } catch (error) {
    console.warn('Performance tracking not available:', error);
  }
}

// Consent management
export function updateConsentSettings(consentSettings: {
  analytics_storage?: 'granted' | 'denied';
  ad_storage?: 'granted' | 'denied';
  functionality_storage?: 'granted' | 'denied';
  personalization_storage?: 'granted' | 'denied';
  security_storage?: 'granted' | 'denied';
}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('consent', 'update', consentSettings);
}

const analyticsUtils = {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackConversion,
  trackEngagement,
  trackEcommerce,
  trackPerformance,
  setUserProperties,
  setCustomDimensions,
  updateConsentSettings,
};

export default analyticsUtils;