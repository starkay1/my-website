import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  // In static build, use default locale to avoid headers dependency
  const locale = process.env.GITHUB_PAGES === 'true' 
    ? 'zh-CN' 
    : (await requestLocale) || 'zh-CN';
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});