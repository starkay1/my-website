import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface AnalyticsEvent {
  type: string;
  element?: string;
  value?: string | number;
  metadata?: Record<string, any>;
  timestamp: number;
  pathname: string;
  userId?: string;
  sessionId: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  referrer: string;
}

// 简单的内存存储（生产环境应使用数据库）
const analyticsEvents: AnalyticsEvent[] = [];
const MAX_EVENTS = 10000; // 最大存储事件数

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';
    
    const eventData: AnalyticsEvent = await request.json();
    
    // 验证必需字段
    if (!eventData.type || !eventData.timestamp || !eventData.sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, timestamp, sessionId' },
        { status: 400 }
      );
    }
    
    // 添加服务器端信息
    const enrichedEvent: AnalyticsEvent = {
      ...eventData,
      userAgent: eventData.userAgent || userAgent,
      referrer: eventData.referrer || referer,
      timestamp: eventData.timestamp || Date.now(),
    };
    
    // 存储事件（生产环境应存储到数据库）
    analyticsEvents.push(enrichedEvent);
    
    // 保持数组大小在限制内
    if (analyticsEvents.length > MAX_EVENTS) {
      analyticsEvents.splice(0, analyticsEvents.length - MAX_EVENTS);
    }
    
    // 实时处理特定事件类型
    await processEvent(enrichedEvent);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const eventType = searchParams.get('type');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    let filteredEvents = [...analyticsEvents];
    
    // 按会话ID过滤
    if (sessionId) {
      filteredEvents = filteredEvents.filter(event => event.sessionId === sessionId);
    }
    
    // 按事件类型过滤
    if (eventType) {
      filteredEvents = filteredEvents.filter(event => event.type === eventType);
    }
    
    // 按时间范围过滤
    if (startTime) {
      const start = parseInt(startTime);
      filteredEvents = filteredEvents.filter(event => event.timestamp >= start);
    }
    
    if (endTime) {
      const end = parseInt(endTime);
      filteredEvents = filteredEvents.filter(event => event.timestamp <= end);
    }
    
    // 排序并限制结果
    filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
    filteredEvents = filteredEvents.slice(0, limit);
    
    // 生成统计信息
    const stats = generateStats(filteredEvents);
    
    return NextResponse.json({
      events: filteredEvents,
      stats,
      total: filteredEvents.length,
    });
  } catch (error) {
    console.error('Analytics data retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data' },
      { status: 500 }
    );
  }
}

// 处理特定事件类型
async function processEvent(event: AnalyticsEvent) {
  try {
    switch (event.type) {
      case 'form_submit':
        // 处理表单提交事件
        await handleFormSubmission(event);
        break;
        
      case 'download':
        // 处理下载事件
        await handleDownload(event);
        break;
        
      case 'contact':
        // 处理联系事件
        await handleContact(event);
        break;
        
      case 'page_view':
        // 处理页面浏览事件
        await handlePageView(event);
        break;
        
      default:
        // 默认处理
        break;
    }
  } catch (error) {
    console.error('Event processing error:', error);
  }
}

// 处理表单提交
async function handleFormSubmission(event: AnalyticsEvent) {
  // 这里可以添加表单提交的特殊处理逻辑
  // 例如：发送通知、更新转化率统计等
  console.log('Form submitted:', event.metadata?.formId);
}

// 处理下载事件
async function handleDownload(event: AnalyticsEvent) {
  // 这里可以添加下载事件的特殊处理逻辑
  // 例如：更新下载统计、记录热门文件等
  console.log('File downloaded:', event.metadata?.fileName);
}

// 处理联系事件
async function handleContact(event: AnalyticsEvent) {
  // 这里可以添加联系事件的特殊处理逻辑
  // 例如：发送通知给销售团队等
  console.log('Contact initiated:', event.pathname);
}

// 处理页面浏览
async function handlePageView(event: AnalyticsEvent) {
  // 这里可以添加页面浏览的特殊处理逻辑
  // 例如：更新热门页面统计等
  console.log('Page viewed:', event.pathname);
}

// 生成统计信息
function generateStats(events: AnalyticsEvent[]) {
  const stats = {
    totalEvents: events.length,
    eventTypes: {} as Record<string, number>,
    topPages: {} as Record<string, number>,
    avgSessionDuration: 0,
    bounceRate: 0,
    conversionEvents: 0,
  };
  
  // 统计事件类型
  events.forEach(event => {
    stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
    
    // 统计页面浏览
    if (event.type === 'page_view') {
      stats.topPages[event.pathname] = (stats.topPages[event.pathname] || 0) + 1;
    }
    
    // 统计转化事件
    if (['form_submit', 'contact', 'download'].includes(event.type)) {
      stats.conversionEvents++;
    }
  });
  
  // 计算会话统计
  const sessions = new Map<string, AnalyticsEvent[]>();
  events.forEach(event => {
    if (!sessions.has(event.sessionId)) {
      sessions.set(event.sessionId, []);
    }
    sessions.get(event.sessionId)!.push(event);
  });
  
  // 计算平均会话时长
  let totalDuration = 0;
  let validSessions = 0;
  
  sessions.forEach(sessionEvents => {
    if (sessionEvents.length > 1) {
      const sortedEvents = sessionEvents.sort((a, b) => a.timestamp - b.timestamp);
      const duration = sortedEvents[sortedEvents.length - 1].timestamp - sortedEvents[0].timestamp;
      totalDuration += duration;
      validSessions++;
    }
  });
  
  stats.avgSessionDuration = validSessions > 0 ? totalDuration / validSessions : 0;
  
  // 计算跳出率（单页面会话的比例）
  const singlePageSessions = Array.from(sessions.values()).filter(
    sessionEvents => sessionEvents.filter(e => e.type === 'page_view').length === 1
  ).length;
  
  stats.bounceRate = sessions.size > 0 ? (singlePageSessions / sessions.size) * 100 : 0;
  
  return stats;
}