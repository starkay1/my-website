'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface GoogleOptimizeProps {
  optimizeId?: string;
}

export default function GoogleOptimize({ optimizeId }: GoogleOptimizeProps) {
  const OPTIMIZE_ID = optimizeId || process.env.NEXT_PUBLIC_OPTIMIZE_ID;

  useEffect(() => {
    if (OPTIMIZE_ID && typeof window !== 'undefined') {
      // 初始化 Optimize
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function() {
        (window as any).dataLayer.push(arguments);
      };
      
      // 配置 Optimize
      (window as any).gtag('config', OPTIMIZE_ID);
      
      // 设置页面隐藏超时（防止闪烁）
      (window as any).gtag('config', OPTIMIZE_ID, {
        optimize_id: OPTIMIZE_ID,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [OPTIMIZE_ID]);

  if (!OPTIMIZE_ID) return null;

  return (
    <>
      {/* Google Optimize 反闪烁代码 */}
      <style dangerouslySetInnerHTML={{
        __html: `.async-hide { opacity: 0 !important}`
      }} />
      <Script
        id="google-optimize-hide"
        dangerouslySetInnerHTML={{
          __html: `
            (function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
            h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')}
            ;(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
            })(window,document.documentElement,'async-hide','dataLayer',4000,
            {'${OPTIMIZE_ID}':true});
          `
        }}
      />
      <Script
        src={`https://www.googleoptimize.com/optimize.js?id=${OPTIMIZE_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}

// A/B 测试辅助函数
export const trackExperiment = (experimentId: string, variantId: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'optimize.callback', {
      name: experimentId,
      callback: () => {
        console.log(`A/B Test: ${experimentId} - Variant: ${variantId}`);
      }
    });
  }
};

// 获取实验变体
export const getExperimentVariant = (experimentId: string): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'optimize.callback', {
        name: experimentId,
        callback: (value: string) => {
          resolve(value || '0'); // 0 为原始版本
        }
      });
    } else {
      resolve('0');
    }
  });
};