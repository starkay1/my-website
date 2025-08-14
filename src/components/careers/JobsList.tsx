'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  MapPin, 
  Clock, 
  Users, 
  Filter,
  Search,
  Briefcase,
  ArrowRight,
  Building,
  Calendar
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps, JobPosition } from '@/types';

// JobsList Props接口
export interface JobsListProps extends ComponentProps {
  searchParams?: {
    department?: string;
    type?: string;
    location?: string;
    search?: string;
  };
}

// 模拟职位数据
const mockJobs: JobPosition[] = [
  {
    id: '1',
    title: '高级品牌策略师',
    department: '品牌设计',
    type: 'full-time',
    location: '上海',
    experience: '3-5年',
    salary: '25-35K',
    description: '负责品牌策略制定和执行，具备丰富的品牌管理经验',
    requirements: [
      '本科及以上学历，市场营销或相关专业',
      '3年以上品牌策略或品牌管理经验',
      '具备优秀的策略思维和创意能力',
      '熟悉夜生活行业者优先'
    ],
    responsibilities: [
      '制定品牌发展策略和年度规划',
      '负责品牌定位和差异化策略',
      '协调品牌传播和营销活动',
      '监控品牌表现和市场反馈'
    ],
    benefits: [
      '五险一金',
      '年终奖金',
      '带薪年假',
      '培训机会'
    ],
    postedAt: '2024-01-15',
    deadline: '2024-02-15',
    isUrgent: true,
    isRemote: false,
    status: 'published',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    title: '空间设计师',
    department: '品牌设计',
    type: 'full-time',
    location: '北京',
    experience: '2-4年',
    salary: '20-30K',
    description: '负责夜店空间设计，打造独特的视觉体验',
    requirements: [
      '建筑设计或室内设计专业背景',
      '2年以上商业空间设计经验',
      '熟练使用设计软件',
      '具备创新思维和美学素养'
    ],
    responsibilities: [
      '负责夜店空间概念设计',
      '制作设计方案和效果图',
      '协调施工和装修过程',
      '确保设计效果的实现'
    ],
    benefits: [
      '五险一金',
      '设计津贴',
      '项目奖金',
      '学习机会'
    ],
    postedAt: '2024-01-12',
    deadline: '2024-02-12',
    isUrgent: false,
    isRemote: false,
    status: 'published',
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z'
  },
  {
    id: '3',
    title: '运营管理专员',
    department: '运营管理',
    type: 'full-time',
    location: '深圳',
    experience: '1-3年',
    salary: '15-25K',
    description: '负责项目运营管理，确保项目顺利执行',
    requirements: [
      '本科学历，管理或相关专业',
      '1年以上运营管理经验',
      '具备良好的沟通协调能力',
      '熟悉项目管理流程'
    ],
    responsibilities: [
      '制定运营计划和流程',
      '协调各部门工作',
      '监控项目进度和质量',
      '处理运营中的问题'
    ],
    benefits: [
      '五险一金',
      '绩效奖金',
      '职业发展',
      '团建活动'
    ],
    postedAt: '2024-01-10',
    deadline: '2024-02-10',
    isUrgent: false,
    isRemote: true,
    status: 'published',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '4',
    title: '数字营销经理',
    department: '市场营销',
    type: 'full-time',
    location: '广州',
    experience: '3-5年',
    salary: '22-32K',
    description: '负责数字营销策略制定和执行，提升品牌影响力',
    requirements: [
      '市场营销或相关专业背景',
      '3年以上数字营销经验',
      '熟悉各类营销工具和平台',
      '具备数据分析能力'
    ],
    responsibilities: [
      '制定数字营销策略',
      '管理社交媒体账号',
      '执行线上推广活动',
      '分析营销效果数据'
    ],
    benefits: [
      '五险一金',
      '营销预算',
      '培训机会',
      '弹性工作'
    ],
    postedAt: '2024-01-08',
    deadline: '2024-02-08',
    isUrgent: true,
    isRemote: false,
    status: 'published',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-08T09:00:00Z'
  },
  {
    id: '5',
    title: 'UI/UX设计师',
    department: '技术开发',
    type: 'full-time',
    location: '杭州',
    experience: '2-4年',
    salary: '18-28K',
    description: '负责产品界面设计，提升用户体验',
    requirements: [
      '设计相关专业背景',
      '2年以上UI/UX设计经验',
      '熟练使用设计工具',
      '具备用户体验思维'
    ],
    responsibilities: [
      '设计产品界面和交互',
      '制作设计规范和组件',
      '优化用户体验流程',
      '配合开发团队实现'
    ],
    benefits: [
      '五险一金',
      '设备补贴',
      '设计培训',
      '创意奖金'
    ],
    postedAt: '2024-01-05',
    deadline: '2024-02-05',
    isUrgent: false,
    isRemote: true,
    status: 'published',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-05T09:00:00Z'
  },
  {
    id: '6',
    title: 'HR专员',
    department: '人力资源',
    type: 'full-time',
    location: '成都',
    experience: '1-3年',
    salary: '12-18K',
    description: '负责人力资源管理，支持公司人才发展',
    requirements: [
      '人力资源或相关专业',
      '1年以上HR工作经验',
      '熟悉劳动法规',
      '具备良好的沟通能力'
    ],
    responsibilities: [
      '负责招聘和面试',
      '员工关系管理',
      '薪酬福利管理',
      '培训组织实施'
    ],
    benefits: [
      '五险一金',
      '节日福利',
      'HR认证',
      '职业发展'
    ],
    postedAt: '2024-01-03',
    deadline: '2024-02-03',
    isUrgent: false,
    isRemote: false,
    status: 'published',
    createdAt: '2024-01-03T09:00:00Z',
    updatedAt: '2024-01-03T09:00:00Z'
  }
];

// 部门列表
const departments = [
  { id: 'all', label: '全部部门', count: mockJobs.length },
  { id: '品牌设计', label: '品牌设计', count: mockJobs.filter(job => job.department === '品牌设计').length },
  { id: '运营管理', label: '运营管理', count: mockJobs.filter(job => job.department === '运营管理').length },
  { id: '市场营销', label: '市场营销', count: mockJobs.filter(job => job.department === '市场营销').length },
  { id: '技术开发', label: '技术开发', count: mockJobs.filter(job => job.department === '技术开发').length },
  { id: '人力资源', label: '人力资源', count: mockJobs.filter(job => job.department === '人力资源').length }
];

// 工作类型
const jobTypes = [
  { id: 'all', label: '全部类型' },
  { id: 'full-time', label: '全职' },
  { id: 'part-time', label: '兼职' },
  { id: 'contract', label: '合同工' },
  { id: 'internship', label: '实习' }
];

// 工作地点
const locations = [
  { id: 'all', label: '全部地点' },
  { id: '上海', label: '上海' },
  { id: '北京', label: '北京' },
  { id: '深圳', label: '深圳' },
  { id: '广州', label: '广州' },
  { id: '杭州', label: '杭州' },
  { id: '成都', label: '成都' }
];

// JobsList组件
export const JobsList: React.FC<JobsListProps> = ({ 
  searchParams = {},
  className 
}) => {
  const t = useTranslations('careers');
  
  // 状态管理
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.department || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.type || 'all');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.location || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // 筛选后的职位列表
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
      const matchesType = selectedType === 'all' || job.type === selectedType;
      const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
      const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDepartment && matchesType && matchesLocation && matchesSearch;
    });
  }, [selectedDepartment, selectedType, selectedLocation, searchQuery]);

  // 获取工作类型标签
  const getJobTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'full-time': '全职',
      'part-time': '兼职',
      'contract': '合同工',
      'internship': '实习'
    };
    return typeMap[type] || type;
  };

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* 标题和搜索 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ANIMATION_CONFIG.smooth}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            开放职位
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            发现适合你的职业机会，加入我们的团队，一起创造精彩的未来
          </p>
          
          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="搜索职位名称或关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* 筛选器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="mb-12"
        >
          {/* 筛选器切换按钮 */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-semibold text-gray-900">
              找到 {filteredJobs.length} 个职位
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              筛选
            </Button>
          </div>

          {/* 筛选器面板 */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={ANIMATION_CONFIG.smooth}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 部门筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    部门
                  </label>
                  <div className="space-y-2">
                    {departments.map(dept => (
                      <label key={dept.id} className="flex items-center">
                        <input
                          type="radio"
                          name="department"
                          value={dept.id}
                          checked={selectedDepartment === dept.id}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          {dept.label} ({dept.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 类型筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    工作类型
                  </label>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={selectedType === type.id}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 地点筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    工作地点
                  </label>
                  <div className="space-y-2">
                    {locations.map(location => (
                      <label key={location.id} className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          value={location.id}
                          checked={selectedLocation === location.id}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          {location.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 职位列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                ...ANIMATION_CONFIG.smooth, 
                delay: index * 0.1 
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* 职位头部 */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    {job.isUrgent && (
                      <Badge variant="error" size="sm">
                        急招
                      </Badge>
                    )}
                    {job.isRemote && (
                      <Badge variant="success" size="sm">
                        远程
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* 职位信息 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span className="text-sm">{job.department}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{getJobTypeLabel(job.type)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{job.experience}</span>
                </div>
              </div>

              {/* 薪资和时间 */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold text-blue-600">
                  {job.salary}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>发布于 {job.postedAt}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 group-hover:bg-blue-600 transition-colors"
                >
                  立即申请
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="px-6"
                >
                  查看详情
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              暂无匹配的职位
            </h3>
            <p className="text-gray-600 mb-6">
              请尝试调整筛选条件或搜索关键词
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDepartment('all');
                setSelectedType('all');
                setSelectedLocation('all');
                setSearchQuery('');
              }}
            >
              清除筛选条件
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default JobsList;