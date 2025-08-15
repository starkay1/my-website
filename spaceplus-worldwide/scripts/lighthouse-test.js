const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// 配置选项
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'interactive',
      'cumulative-layout-shift',
      'total-blocking-time',
      'max-potential-fid',
      'server-response-time',
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-responsive-images',
      'efficient-animated-content',
      'preload-lcp-image',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'critical-request-chains',
      'user-timings',
      'bootup-time',
      'mainthread-work-breakdown',
      'diagnostics',
      'network-requests',
      'network-rtt',
      'network-server-latency',
      'main-thread-tasks',
      'metrics',
      'performance-budget',
      'timing-budget',
      'resource-summary',
      'third-party-summary',
      'third-party-facades',
      'largest-contentful-paint-element',
      'layout-shift-elements',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'uses-text-compression',
      'uses-responsive-images',
      'efficient-animated-content',
      'duplicated-javascript',
      'legacy-javascript',
      'dom-size',
      'no-document-write',
      'uses-http2',
      'uses-passive-event-listeners',
      'no-vulnerable-libraries',
      'js-libraries',
      'notification-on-start',
      'geolocation-on-start',
      'uses-rel-preconnect',
      'font-display',
      'third-party-cookies'
    ],
    // 移动端测试
    emulatedFormFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4
    },
    // 桌面端测试
    // emulatedFormFactor: 'desktop',
    // throttling: {
    //   rttMs: 40,
    //   throughputKbps: 10240,
    //   cpuSlowdownMultiplier: 1
    // }
  }
};

// 测试URL列表
const urls = [
  'http://localhost:3000',
  'http://localhost:3000/en',
  'http://localhost:3000/zh'
];

// 运行Lighthouse测试
async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port
  };

  const results = [];

  for (const url of urls) {
    console.log(`\n🔍 Testing: ${url}`);
    
    try {
      const runnerResult = await lighthouse(url, options, config);
      
      // 提取关键指标
      const { lhr } = runnerResult;
      const metrics = {
        url,
        performanceScore: Math.round(lhr.categories.performance.score * 100),
        metrics: {
          'First Contentful Paint': lhr.audits['first-contentful-paint'].displayValue,
          'Largest Contentful Paint': lhr.audits['largest-contentful-paint'].displayValue,
          'Speed Index': lhr.audits['speed-index'].displayValue,
          'Time to Interactive': lhr.audits['interactive'].displayValue,
          'Total Blocking Time': lhr.audits['total-blocking-time'].displayValue,
          'Cumulative Layout Shift': lhr.audits['cumulative-layout-shift'].displayValue
        },
        opportunities: lhr.audits['render-blocking-resources']?.details?.items?.length || 0,
        diagnostics: {
          'Server Response Time': lhr.audits['server-response-time']?.displayValue,
          'DOM Size': lhr.audits['dom-size']?.displayValue,
          'Total Byte Weight': lhr.audits['total-byte-weight']?.displayValue
        }
      };

      results.push(metrics);

      // 保存详细报告
      const reportPath = path.join(__dirname, '../lighthouse-reports');
      if (!fs.existsSync(reportPath)) {
        fs.mkdirSync(reportPath, { recursive: true });
      }
      
      const urlSlug = url.replace(/[^a-zA-Z0-9]/g, '-');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `lighthouse-${urlSlug}-${timestamp}.html`;
      
      fs.writeFileSync(
        path.join(reportPath, filename),
        runnerResult.report
      );
      
      console.log(`✅ Performance Score: ${metrics.performanceScore}/100`);
      console.log(`📊 Report saved: ${filename}`);
      
    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message);
    }
  }

  await chrome.kill();

  // 生成汇总报告
  generateSummaryReport(results);
}

// 生成汇总报告
function generateSummaryReport(results) {
  console.log('\n📋 Performance Summary Report');
  console.log('=' .repeat(50));
  
  results.forEach(result => {
    console.log(`\n🌐 URL: ${result.url}`);
    console.log(`🎯 Performance Score: ${result.performanceScore}/100`);
    
    if (result.performanceScore >= 90) {
      console.log('✅ Excellent performance!');
    } else if (result.performanceScore >= 70) {
      console.log('⚠️  Good performance, room for improvement');
    } else {
      console.log('❌ Poor performance, needs optimization');
    }
    
    console.log('\n📊 Core Web Vitals:');
    Object.entries(result.metrics).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    console.log('\n🔧 Diagnostics:');
    Object.entries(result.diagnostics).forEach(([key, value]) => {
      if (value) {
        console.log(`   ${key}: ${value}`);
      }
    });
  });
  
  // 计算平均分数
  const avgScore = Math.round(
    results.reduce((sum, result) => sum + result.performanceScore, 0) / results.length
  );
  
  console.log(`\n🎯 Average Performance Score: ${avgScore}/100`);
  
  if (avgScore >= 90) {
    console.log('🎉 Congratulations! Your site meets performance standards.');
  } else {
    console.log('💡 Consider implementing the suggested optimizations.');
  }
  
  // 保存JSON报告
  const summaryPath = path.join(__dirname, '../lighthouse-reports/summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    averageScore: avgScore,
    results
  }, null, 2));
  
  console.log(`\n💾 Summary saved to: ${summaryPath}`);
}

// 性能预算检查
function checkPerformanceBudget(results) {
  const budget = {
    performanceScore: 90,
    firstContentfulPaint: 1500, // ms
    largestContentfulPaint: 2500, // ms
    cumulativeLayoutShift: 0.1,
    totalBlockingTime: 200 // ms
  };
  
  console.log('\n💰 Performance Budget Check');
  console.log('=' .repeat(30));
  
  results.forEach(result => {
    console.log(`\n🌐 ${result.url}`);
    
    // 检查性能分数
    if (result.performanceScore >= budget.performanceScore) {
      console.log(`✅ Performance Score: ${result.performanceScore}/100 (Budget: ${budget.performanceScore})`);
    } else {
      console.log(`❌ Performance Score: ${result.performanceScore}/100 (Budget: ${budget.performanceScore})`);
    }
  });
}

// 错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 运行测试
if (require.main === module) {
  console.log('🚀 Starting Lighthouse Performance Test...');
  console.log('📱 Testing in mobile mode with throttling');
  
  runLighthouse().catch(error => {
    console.error('❌ Lighthouse test failed:', error);
    process.exit(1);
  });
}

module.exports = { runLighthouse, generateSummaryReport, checkPerformanceBudget };