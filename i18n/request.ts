import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const locale = (await requestLocale) || 'zh-CN';
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});