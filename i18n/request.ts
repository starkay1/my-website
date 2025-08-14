import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  // 在静态构建时使用固定语言环境，避免访问headers
  let locale;
  if (process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production') {
    // 在静态导出时，直接从URL参数获取locale，避免使用headers
    locale = 'zh-CN'; // 默认语言
  } else {
    locale = (await requestLocale) || 'zh-CN';
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});