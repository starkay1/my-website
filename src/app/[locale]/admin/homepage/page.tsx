'use client';

import HomepageEditor from '@/components/admin/HomepageEditor';

export default function AdminHomepagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">主页内容编辑</h1>
        <p className="text-gray-600 mt-1">管理网站主页的各个区域内容</p>
      </div>
      <HomepageEditor />
    </div>
  );
}