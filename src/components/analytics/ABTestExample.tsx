'use client';

import { useState, useEffect } from 'react';
import { getExperimentVariant, trackExperiment } from './GoogleOptimize';

interface ABTestExampleProps {
  experimentId: string;
  children: React.ReactNode;
  variants: {
    [key: string]: React.ReactNode;
  };
  fallback?: React.ReactNode;
}

/**
 * A/B 测试组件示例
 * 使用方法：
 * <ABTestExample 
 *   experimentId="homepage-hero-test"
 *   variants={{
 *     '1': <HeroVariantA />,
 *     '2': <HeroVariantB />
 *   }}
 *   fallback={<HeroOriginal />}
 * >
 *   <HeroOriginal /> // 原始版本（变体 0）
 * </ABTestExample>
 */
export default function ABTestExample({ 
  experimentId, 
  children, 
  variants, 
  fallback 
}: ABTestExampleProps) {
  const [variant, setVariant] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_AB_TESTING === 'true';
  const sampleRate = parseFloat(process.env.NEXT_PUBLIC_AB_TEST_SAMPLE_RATE || '0.5');

  useEffect(() => {
    if (!isEnabled) {
      setIsLoading(false);
      return;
    }

    // 采样率控制
    if (Math.random() > sampleRate) {
      setIsLoading(false);
      return;
    }

    // 获取实验变体
    getExperimentVariant(experimentId)
      .then((variantId) => {
        setVariant(variantId);
        trackExperiment(experimentId, variantId);
        setIsLoading(false);
      })
      .catch(() => {
        setVariant('0');
        setIsLoading(false);
      });
  }, [experimentId, isEnabled, sampleRate]);

  // 加载状态
  if (isLoading) {
    return fallback || children;
  }

  // 返回对应的变体
  if (variant !== '0' && variants[variant]) {
    return <>{variants[variant]}</>;
  }

  // 返回原始版本
  return <>{children}</>;
}

// Hook 版本的 A/B 测试
export function useABTest(experimentId: string) {
  const [variant, setVariant] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_AB_TESTING === 'true';
  const sampleRate = parseFloat(process.env.NEXT_PUBLIC_AB_TEST_SAMPLE_RATE || '0.5');

  useEffect(() => {
    if (!isEnabled) {
      setIsLoading(false);
      return;
    }

    if (Math.random() > sampleRate) {
      setIsLoading(false);
      return;
    }

    getExperimentVariant(experimentId)
      .then((variantId) => {
        setVariant(variantId);
        trackExperiment(experimentId, variantId);
        setIsLoading(false);
      })
      .catch(() => {
        setVariant('0');
        setIsLoading(false);
      });
  }, [experimentId, isEnabled, sampleRate]);

  return { variant, isLoading };
}

// 简单的变体选择器
export function ABVariant({ 
  variant, 
  children 
}: { 
  variant: string | string[]; 
  children: React.ReactNode; 
}) {
  const variants = Array.isArray(variant) ? variant : [variant];
  
  // 这里需要从上下文或其他方式获取当前变体
  // 简化示例，实际使用时需要配合 ABTestProvider
  return <>{children}</>;
}

// A/B 测试上下文提供者（可选）
import { createContext, useContext } from 'react';

interface ABTestContextType {
  getVariant: (experimentId: string) => string;
  isLoading: boolean;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [experiments, setExperiments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const getVariant = (experimentId: string): string => {
    return experiments[experimentId] || '0';
  };

  return (
    <ABTestContext.Provider value={{ getVariant, isLoading }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTestContext() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTestContext must be used within ABTestProvider');
  }
  return context;
}