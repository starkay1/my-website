import { socialScheduler } from './social-scheduler';

// 应用初始化函数
export async function initializeApp() {
  try {
    console.log('🚀 正在初始化应用...');
    
    // 启动社交媒体调度器
    console.log('📱 启动社交媒体调度器...');
    await socialScheduler.start();
    console.log('✅ 社交媒体调度器启动成功');
    
    console.log('✅ 应用初始化完成');
  } catch (error) {
    console.error('❌ 应用初始化失败:', error);
    // 不抛出错误，避免影响应用启动
  }
}

// 应用关闭时的清理函数
export async function cleanupApp() {
  try {
    console.log('🔄 正在清理应用资源...');
    
    // 停止社交媒体调度器
    console.log('📱 停止社交媒体调度器...');
    await socialScheduler.stop();
    console.log('✅ 社交媒体调度器已停止');
    
    console.log('✅ 应用清理完成');
  } catch (error) {
    console.error('❌ 应用清理失败:', error);
  }
}

// 监听进程退出事件
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    console.log('\n收到 SIGINT 信号，正在优雅关闭...');
    await cleanupApp();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n收到 SIGTERM 信号，正在优雅关闭...');
    await cleanupApp();
    process.exit(0);
  });
}

// 自动初始化（仅在服务器端，且非静态构建）
if (typeof window === 'undefined' && process.env.GITHUB_PAGES !== 'true') {
  // 延迟初始化，确保数据库连接等已准备就绪
  setTimeout(() => {
    initializeApp();
  }, 1000);
}