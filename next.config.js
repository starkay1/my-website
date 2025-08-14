const createNextIntlPlugin = require('next-intl/plugin');

// 引入polyfills
require('./polyfills');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 静态导出配置（仅在GitHub Pages部署时启用）
  ...(process.env.GITHUB_PAGES && { 
    output: 'export',
    distDir: 'out'
  }),
  trailingSlash: true,
  
  // 图片配置（GitHub Pages 需要 unoptimized）
  images: {
    unoptimized: true,
    domains: ['localhost', 'spaceplusworldwide.club'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // 生产环境优化
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // 自定义域名配置
  assetPrefix: process.env.GITHUB_PAGES ? '' : (process.env.NODE_ENV === 'production' ? 'https://spaceplusworldwide.club' : ''),
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'admin-token',
            value: undefined,
          },
        ],
      },
    ];
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 修复 'self is not defined' 错误
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // 添加 self polyfill
      config.plugins.push(
        new webpack.DefinePlugin({
          'typeof self': JSON.stringify('object'),
          self: 'global',
        })
      );
    }
    
    // 生产环境优化 - 暂时禁用vendor分割以避免self错误
    // if (!dev) {
    //   config.optimization.splitChunks = {
    //     chunks: 'all',
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\/]node_modules[\/]/,
    //         name: 'vendors',
    //         chunks: 'all',
    //       },
    //     },
    //   };
    // }
    
    return config;
  },
};

module.exports = withNextIntl(nextConfig);