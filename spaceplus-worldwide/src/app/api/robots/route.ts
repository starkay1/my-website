import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spaceplus-worldwide.vercel.app';
  
  const robots = `# SpacePlus Worldwide - Robots.txt
# 允许所有搜索引擎爬虫访问网站

User-agent: *
Allow: /

# 禁止访问的路径
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /.well-known/

# 站点地图位置
Sitemap: ${baseUrl}/sitemap.xml

# 爬取延迟（可选）
Crawl-delay: 1

# 特定搜索引擎的规则
# Google
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /_next/

# Bing
User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /_next/

# 百度
User-agent: Baiduspider
Allow: /
Disallow: /api/
Disallow: /_next/

# 搜狗
User-agent: Sogou
Allow: /
Disallow: /api/
Disallow: /_next/`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24小时缓存
    },
  });
}