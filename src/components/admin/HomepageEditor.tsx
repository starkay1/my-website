import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface HeroSectionConfig {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundType: 'gradient' | 'image' | 'video';
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity: number;
}

interface AboutSectionConfig {
  title: string;
  description: string;
  features: string[];
}

interface ServicesSectionConfig {
  title: string;
  description: string;
  services: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

interface CasesSectionConfig {
  title: string;
  description: string;
  featured: boolean;
}

interface ClientsSectionConfig {
  title: string;
  description: string;
  logos: string[];
}

interface ContactSectionConfig {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

interface HomepageConfig {
  heroSection: HeroSectionConfig;
  aboutSection: AboutSectionConfig;
  servicesSection: ServicesSectionConfig;
  casesSection: CasesSectionConfig;
  clientsSection: ClientsSectionConfig;
  contactSection: ContactSectionConfig;
  seo: SEOConfig;
}

const defaultConfig: HomepageConfig = {
  heroSection: {
    title: 'SPACEPLUS WORLDWIDE',
    subtitle: '专业的空间设计与建设服务',
    description: '我们致力于为客户提供最优质的空间设计和建设解决方案',
    buttonText: '了解更多',
    buttonLink: '/about',
    backgroundType: 'gradient',
    overlayOpacity: 0.6
  },
  aboutSection: {
    title: '关于我们',
    description: 'SPACEPLUS WORLDWIDE 是一家专业的空间设计与建设公司',
    features: ['专业设计', '优质施工', '完善服务']
  },
  servicesSection: {
    title: '我们的服务',
    description: '提供全方位的空间解决方案',
    services: [
      { title: '空间设计', description: '专业的空间设计服务', icon: 'design' },
      { title: '工程建设', description: '高质量的工程建设', icon: 'construction' },
      { title: '项目管理', description: '全程项目管理服务', icon: 'management' }
    ]
  },
  casesSection: {
    title: '成功案例',
    description: '查看我们的精选项目案例',
    featured: true
  },
  clientsSection: {
    title: '合作伙伴',
    description: '与众多知名企业建立长期合作关系',
    logos: []
  },
  contactSection: {
    title: '联系我们',
    description: '欢迎与我们取得联系',
    email: 'info@spaceplus.com',
    phone: '+86 400-123-4567',
    address: '上海市浦东新区'
  },
  seo: {
    title: 'SPACEPLUS WORLDWIDE - 专业空间设计与建设',
    description: '专业的空间设计与建设服务提供商',
    keywords: '空间设计,建设,装修,SPACEPLUS'
  }
};

export default function HomepageEditor() {
  const [config, setConfig] = useState<HomepageConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/homepage');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load homepage config:', error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('配置保存成功！');
      } else {
        alert('保存失败，请重试');
      }
    } catch (error) {
      console.error('Failed to save homepage config:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const updateHeroSection = (field: keyof HeroSectionConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      heroSection: {
        ...prev.heroSection,
        [field]: value
      }
    }));
  };

  const updateAboutSection = (field: keyof AboutSectionConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        [field]: value
      }
    }));
  };

  const updateSEO = (field: keyof SEOConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }));
  };

  const updateServicesSection = (field: keyof ServicesSectionConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      servicesSection: {
        ...prev.servicesSection,
        [field]: value
      }
    }));
  };

  const updateCasesSection = (field: keyof CasesSectionConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      casesSection: {
        ...prev.casesSection,
        [field]: value
      }
    }));
  };

  const updateClientsSection = (field: keyof ClientsSectionConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      clientsSection: {
        ...prev.clientsSection,
        [field]: value
      }
    }));
  };

  const updateContactSection = (field: keyof ContactSectionConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      contactSection: {
        ...prev.contactSection,
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">主页内容管理</h1>
        <p className="text-gray-600">管理主页的所有内容和配置</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'hero', label: '英雄区域' },
            { id: 'about', label: '关于我们' },
            { id: 'services', label: '服务' },
            { id: 'cases', label: '案例' },
            { id: 'clients', label: '客户' },
            { id: 'contact', label: '联系我们' },
            { id: 'seo', label: 'SEO设置' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">英雄区域配置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <Input
                value={config.heroSection.title}
                onChange={(e) => updateHeroSection('title', e.target.value)}
                placeholder="输入主标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">副标题</label>
              <Input
                value={config.heroSection.subtitle}
                onChange={(e) => updateHeroSection('subtitle', e.target.value)}
                placeholder="输入副标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <Textarea
                value={config.heroSection.description}
                onChange={(e) => updateHeroSection('description', e.target.value)}
                placeholder="输入描述文字"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">按钮文字</label>
              <Input
                value={config.heroSection.buttonText}
                onChange={(e) => updateHeroSection('buttonText', e.target.value)}
                placeholder="输入按钮文字"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">按钮链接</label>
              <Input
                value={config.heroSection.buttonLink}
                onChange={(e) => updateHeroSection('buttonLink', e.target.value)}
                placeholder="输入按钮链接"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">背景类型</label>
              <select
                value={config.heroSection.backgroundType}
                onChange={(e) => updateHeroSection('backgroundType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gradient">渐变背景</option>
                <option value="image">图片背景</option>
                <option value="video">视频背景</option>
              </select>
            </div>
            {config.heroSection.backgroundType === 'image' && (
              <div>
                <label className="block text-sm font-medium mb-2">背景图片URL</label>
                <Input
                  value={config.heroSection.backgroundImage || ''}
                  onChange={(e) => updateHeroSection('backgroundImage', e.target.value)}
                  placeholder="输入图片URL"
                />
              </div>
            )}
            {config.heroSection.backgroundType === 'video' && (
              <div>
                <label className="block text-sm font-medium mb-2">背景视频URL</label>
                <Input
                  value={config.heroSection.backgroundVideo || ''}
                  onChange={(e) => updateHeroSection('backgroundVideo', e.target.value)}
                  placeholder="输入视频URL"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">叠加层透明度: {config.heroSection.overlayOpacity}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.heroSection.overlayOpacity}
                onChange={(e) => updateHeroSection('overlayOpacity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      {activeTab === 'about' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">关于我们配置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <Input
                value={config.aboutSection.title}
                onChange={(e) => updateAboutSection('title', e.target.value)}
                placeholder="输入标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <Textarea
                value={config.aboutSection.description}
                onChange={(e) => updateAboutSection('description', e.target.value)}
                placeholder="输入描述"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">特色功能 (每行一个)</label>
              <Textarea
                value={config.aboutSection.features.join('\n')}
                onChange={(e) => updateAboutSection('features', e.target.value.split('\n').filter(f => f.trim()))}
                placeholder="输入特色功能，每行一个"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Section */}
      {activeTab === 'seo' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">SEO设置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">页面标题</label>
              <Input
                value={config.seo.title}
                onChange={(e) => updateSEO('title', e.target.value)}
                placeholder="输入页面标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">页面描述</label>
              <Textarea
                value={config.seo.description}
                onChange={(e) => updateSEO('description', e.target.value)}
                placeholder="输入页面描述"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">关键词</label>
              <Input
                value={config.seo.keywords}
                onChange={(e) => updateSEO('keywords', e.target.value)}
                placeholder="输入关键词，用逗号分隔"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">OG图片URL</label>
              <Input
                value={config.seo.ogImage || ''}
                onChange={(e) => updateSEO('ogImage', e.target.value)}
                placeholder="输入OG图片URL"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Section */}
      {activeTab === 'services' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">服务配置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <Input
                value={config.servicesSection.title}
                onChange={(e) => updateServicesSection('title', e.target.value)}
                placeholder="输入服务区域标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <Textarea
                value={config.servicesSection.description}
                onChange={(e) => updateServicesSection('description', e.target.value)}
                placeholder="输入服务区域描述"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">服务列表</label>
              {config.servicesSection.services.map((service, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">服务名称</label>
                      <Input
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...config.servicesSection.services];
                          newServices[index].title = e.target.value;
                          updateServicesSection('services', newServices);
                        }}
                        placeholder="服务名称"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">服务描述</label>
                      <Input
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...config.servicesSection.services];
                          newServices[index].description = e.target.value;
                          updateServicesSection('services', newServices);
                        }}
                        placeholder="服务描述"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">图标</label>
                      <Input
                        value={service.icon}
                        onChange={(e) => {
                          const newServices = [...config.servicesSection.services];
                          newServices[index].icon = e.target.value;
                          updateServicesSection('services', newServices);
                        }}
                        placeholder="图标名称"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cases Section */}
      {activeTab === 'cases' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">案例配置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <Input
                value={config.casesSection.title}
                onChange={(e) => updateCasesSection('title', e.target.value)}
                placeholder="输入案例区域标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <Textarea
                value={config.casesSection.description}
                onChange={(e) => updateCasesSection('description', e.target.value)}
                placeholder="输入案例区域描述"
                rows={3}
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.casesSection.featured}
                  onChange={(e) => updateCasesSection('featured', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">显示为特色案例</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients Section */}
      {activeTab === 'clients' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">客户配置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <Input
                value={config.clientsSection.title}
                onChange={(e) => updateClientsSection('title', e.target.value)}
                placeholder="输入客户区域标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <Textarea
                value={config.clientsSection.description}
                onChange={(e) => updateClientsSection('description', e.target.value)}
                placeholder="输入客户区域描述"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">客户Logo列表</label>
              <p className="text-sm text-gray-600 mb-2">每行一个Logo URL</p>
              <Textarea
                value={config.clientsSection.logos.join('\n')}
                onChange={(e) => updateClientsSection('logos', e.target.value.split('\n').filter(url => url.trim()))}
                placeholder="输入客户Logo URL，每行一个"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Section */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">联系我们配置</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <Input
                value={config.contactSection.title}
                onChange={(e) => updateContactSection('title', e.target.value)}
                placeholder="输入联系区域标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <Textarea
                value={config.contactSection.description}
                onChange={(e) => updateContactSection('description', e.target.value)}
                placeholder="输入联系区域描述"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">邮箱</label>
                <Input
                  value={config.contactSection.email}
                  onChange={(e) => updateContactSection('email', e.target.value)}
                  placeholder="输入联系邮箱"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">电话</label>
                <Input
                  value={config.contactSection.phone}
                  onChange={(e) => updateContactSection('phone', e.target.value)}
                  placeholder="输入联系电话"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">地址</label>
              <Input
                value={config.contactSection.address}
                onChange={(e) => updateContactSection('address', e.target.value)}
                placeholder="输入联系地址"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={saveConfig}
          disabled={loading}
          className="px-6 py-2"
        >
          {loading ? '保存中...' : '保存配置'}
        </Button>
      </div>
    </div>
  );
}