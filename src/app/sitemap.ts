import { MetadataRoute } from 'next';

const baseUrl = 'https://spaceplusworldwide.club';
const locales = ['zh-CN', 'en', 'th'];

// 静态页面路由
const staticRoutes = [
  '',
  '/about',
  '/services',
  '/cases',
  '/news',
  '/careers',
  '/contact',
];

// 生成多语言URL
function generateLocalizedUrls(route: string) {
  return locales.map(locale => ({
    url: `${baseUrl}${locale === 'zh-CN' ? '' : `/${locale}`}${route}`,
    lastModified: new Date(),
    changeFrequency: getChangeFrequency(route),
    priority: getPriority(route),
    alternates: {
      languages: Object.fromEntries(
        locales.map(lang => [
          lang,
          `${baseUrl}${lang === 'zh-CN' ? '' : `/${lang}`}${route}`
        ])
      )
    }
  }));
}

// 根据路由确定更新频率
function getChangeFrequency(route: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  switch (route) {
    case '':
      return 'weekly';
    case '/news':
      return 'daily';
    case '/cases':
    case '/careers':
      return 'weekly';
    case '/about':
    case '/services':
    case '/contact':
      return 'monthly';
    default:
      return 'monthly';
  }
}

// 根据路由确定优先级
function getPriority(route: string): number {
  switch (route) {
    case '':
      return 1.0;
    case '/about':
    case '/services':
      return 0.9;
    case '/cases':
    case '/news':
      return 0.8;
    case '/careers':
    case '/contact':
      return 0.7;
    default:
      return 0.5;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // 生成所有静态页面的多语言版本
  const staticPages = staticRoutes.flatMap(route => 
    generateLocalizedUrls(route)
  );

  // TODO: 添加动态页面（如博客文章、案例详情等）
  // const dynamicPages = await getDynamicPages();

  return [
    ...staticPages,
    // ...dynamicPages,
  ];
}

// 未来可以添加的动态页面生成函数
// async function getDynamicPages() {
//   try {
//     // 从数据库或API获取动态内容
//     const posts = await fetch(`${baseUrl}/api/posts`).then(res => res.json());
//     const cases = await fetch(`${baseUrl}/api/cases`).then(res => res.json());
    
//     const dynamicRoutes = [
//       ...posts.map((post: any) => `/news/${post.slug}`),
//       ...cases.map((case: any) => `/cases/${case.slug}`),
//     ];
    
//     return dynamicRoutes.flatMap(route => generateLocalizedUrls(route));
//   } catch (error) {
//     console.error('Error generating dynamic sitemap:', error);
//     return [];
//   }
// }