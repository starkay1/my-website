import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = 'zh-CN';
  
  try {
    locale = (await requestLocale) || 'zh-CN';
  } catch (error) {
    console.warn('Failed to get request locale, using default:', error);
    locale = 'zh-CN';
  }
  
  let messages = {};
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to empty messages or default locale
    try {
      messages = (await import(`../messages/zh-CN.json`)).default;
    } catch (fallbackError) {
      console.warn('Failed to load fallback messages:', fallbackError);
    }
  }
  
  return {
    locale,
    messages,
    onError: (error) => {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn('Missing translation:', error.originalMessage);
        return error.originalMessage;
      }
      throw error;
    },
    getMessageFallback: ({ namespace, key, error }) => {
      const path = [namespace, key].filter((part) => part != null).join('.');
      if (error.code === 'MISSING_MESSAGE') {
        return path;
      }
      throw error;
    },
  };
});