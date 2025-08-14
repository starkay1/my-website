import { Metadata } from 'next';
import SocialSourceManager from '@/components/admin/SocialSourceManager';

export const metadata: Metadata = {
  title: '社交媒体管理 - 管理后台',
  description: '管理社交媒体内容抓取和自动化新闻生成'
};

export default function SocialMediaPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">社交媒体管理</h1>
        <p className="text-gray-600">
          配置和管理Instagram、微信公众号等社交媒体平台的内容自动抓取，
          并将优质内容自动转换为网站新闻。
        </p>
      </div>
      
      <SocialSourceManager />
    </div>
  );
}