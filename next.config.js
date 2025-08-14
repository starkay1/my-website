const createNextIntlPlugin = require('next-intl/plugin');

// 引入polyfills
require('./polyfills');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 静态导出配置
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  trailingSlash: process.env.GITHUB_PAGES === 'true',
  distDir: process.env.GITHUB_PAGES === 'true' ? 'out' : '.next',
  
  // 处理缺失的翻译消息
  experimental: {
    missingSuspenseWithCSRBailout: false,
    esmExternals: 'loose',
    forceSwcTransforms: true,
    // 强制客户端渲染以避免window.location错误
    clientRouterFilter: false,
    serverComponentsExternalPackages: [],
  },
  
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
  
  assetPrefix: '',
  basePath: '',
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  

  
  // 转译第三方包以解决 SSR 问题
  transpilePackages: ['framer-motion'],
  
  // 重定向配置 - 暂时禁用以解决 window.location 错误
  // async redirects() {
  //   return [
  //     {
  //       source: '/admin',
  //       destination: '/admin/login',
  //       permanent: false,
  //     },
  //   ];
  // },
  
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
    // 在服务器端排除 framer-motion
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('framer-motion');
    }

    // 添加全局变量定义
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.__NEXT_GLOBAL_POLYFILL__': JSON.stringify(true),
        'typeof global': JSON.stringify(isServer ? 'object' : 'undefined'),
        'typeof window': JSON.stringify(isServer ? 'undefined' : 'object'),
      })
    );

    // 提供全局变量 polyfill
    config.plugins.push(
      new webpack.ProvidePlugin({
        global: require.resolve('./polyfills.js'),
      })
    );

    return config;
  },
};

module.exports = withNextIntl(nextConfig);