'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  FileText, 
  Send, 
  Phone, 
  Users,
  CheckCircle,
  ArrowRight,
  Clock,
  MessageCircle,
  User,
  Building,
  Mail,
  Calendar,
  Award,
  Target
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ANIMATION_CONFIG } from '@/lib/constants';
import type { ComponentProps } from '@/types';

// ApplicationProcess Props接口
export interface ApplicationProcessProps extends ComponentProps {
  // 可以添加自定义属性
}

// ApplicationProcess组件
export const ApplicationProcess: React.FC<ApplicationProcessProps> = ({ className }) => {
  const t = useTranslations('careers');
  const [activeStep, setActiveStep] = useState(0);

  // 申请流程步骤
  const processSteps = [
    {
      icon: FileText,
      title: '在线申请',
      description: '提交简历和申请表',
      details: [
        '填写个人信息',
        '上传简历文件',
        '选择意向职位',
        '提交申请材料'
      ],
      duration: '5-10分钟',
      tips: '请确保简历信息完整准确，突出相关经验和技能'
    },
    {
      icon: Send,
      title: '简历筛选',
      description: 'HR初步筛选简历',
      details: [
        '简历内容审核',
        '岗位匹配度评估',
        '基本条件筛选',
        '初步评分排序'
      ],
      duration: '1-3个工作日',
      tips: '我们会仔细审阅每一份简历，符合条件的候选人将收到面试邀请'
    },
    {
      icon: Phone,
      title: '电话面试',
      description: '初步电话沟通',
      details: [
        '基本情况了解',
        '工作经验交流',
        '薪资期望沟通',
        '面试时间安排'
      ],
      duration: '15-30分钟',
      tips: '请保持电话畅通，我们会在工作时间联系您'
    },
    {
      icon: Users,
      title: '现场面试',
      description: '深入面试交流',
      details: [
        '专业技能测试',
        '团队协作评估',
        '文化匹配度考察',
        '综合能力评价'
      ],
      duration: '1-2小时',
      tips: '建议提前了解公司文化，准备相关案例和作品展示'
    },
    {
      icon: CheckCircle,
      title: '录用通知',
      description: '发放录用通知',
      details: [
        '面试结果评估',
        '薪资待遇确定',
        '入职时间协商',
        '正式录用通知'
      ],
      duration: '3-5个工作日',
      tips: '恭喜您！我们将与您确认入职相关事宜'
    }
  ];

  // 面试准备建议
  const interviewTips = [
    {
      icon: User,
      title: '个人准备',
      tips: [
        '了解自己的优势和不足',
        '准备自我介绍和职业规划',
        '整理工作经验和成就',
        '思考为什么选择我们公司'
      ]
    },
    {
      icon: Building,
      title: '公司了解',
      tips: [
        '研究公司背景和业务',
        '了解行业发展趋势',
        '关注公司最新动态',
        '了解企业文化和价值观'
      ]
    },
    {
      icon: Target,
      title: '职位匹配',
      tips: [
        '深入了解职位要求',
        '准备相关技能展示',
        '思考如何为公司创造价值',
        '准备具体的工作案例'
      ]
    },
    {
      icon: MessageCircle,
      title: '沟通技巧',
      tips: [
        '保持自信和真诚',
        '积极主动提问',
        '清晰表达观点',
        '展现团队合作精神'
      ]
    }
  ];

  // 常见问题
  const faqs = [
    {
      question: '简历投递后多久会收到回复？',
      answer: '我们会在收到简历后的3个工作日内给出初步反馈。如果您的背景符合我们的要求，我们会尽快安排面试。'
    },
    {
      question: '面试过程中会考察哪些方面？',
      answer: '我们主要考察专业技能、工作经验、团队协作能力、学习能力以及与公司文化的匹配度。'
    },
    {
      question: '是否接受应届毕业生？',
      answer: '是的，我们欢迎优秀的应届毕业生加入。我们有完善的新员工培训体系，帮助新人快速成长。'
    },
    {
      question: '薪资待遇如何确定？',
      answer: '薪资会根据候选人的经验、能力、市场水平以及岗位要求综合确定，我们提供具有竞争力的薪酬包。'
    },
    {
      question: '是否支持远程工作？',
      answer: '部分岗位支持远程或混合办公模式，具体政策会在面试过程中详细说明。'
    }
  ];

  // 快速申请表单状态
  const [quickApplication, setQuickApplication] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: ''
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理快速申请提交
    console.log('Quick application submitted:', quickApplication);
  };

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ANIMATION_CONFIG.smooth}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            申请流程
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            简单透明的申请流程，让您清楚了解每个环节，轻松加入我们的团队
          </p>
        </motion.div>

        {/* 流程步骤 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
          className="mb-20"
        >
          {/* 步骤导航 */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                
                return (
                  <div key={index} className="flex items-center">
                    <motion.button
                      onClick={() => setActiveStep(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 min-w-[120px] ${
                        isActive 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                        isActive 
                          ? 'bg-white/20' 
                          : isCompleted
                          ? 'bg-green-200'
                          : 'bg-white'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          isActive 
                            ? 'text-white' 
                            : isCompleted
                            ? 'text-green-700'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-center">
                        {step.title}
                      </span>
                    </motion.button>
                    
                    {index < processSteps.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-400 mx-2 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 步骤详情 */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={ANIMATION_CONFIG.smooth}
            className="bg-gray-50 rounded-3xl p-8 md:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 左侧：步骤信息 */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mr-4">
                    {React.createElement(processSteps[activeStep].icon, {
                      className: 'w-8 h-8 text-white'
                    })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {processSteps[activeStep].title}
                    </h3>
                    <p className="text-gray-600">
                      {processSteps[activeStep].description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-blue-600 font-medium">
                    预计时长：{processSteps[activeStep].duration}
                  </span>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">💡 温馨提示</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {processSteps[activeStep].tips}
                  </p>
                </div>
              </div>

              {/* 右侧：详细步骤 */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  具体步骤
                </h4>
                <ul className="space-y-4">
                  {processSteps[activeStep].details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        ...ANIMATION_CONFIG.smooth, 
                        delay: index * 0.1 
                      }}
                      className="flex items-center bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-700">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 面试准备建议 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              面试准备建议
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              充分的准备是面试成功的关键，以下建议帮助您更好地展现自己
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {interviewTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...ANIMATION_CONFIG.smooth, 
                    delay: 0.3 + index * 0.1 
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {tip.title}
                  </h4>
                  <ul className="space-y-2">
                    {tip.tips.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 快速申请表单 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              快速申请
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              填写基本信息，我们会尽快与您联系
            </p>
          </div>

          <form onSubmit={handleQuickSubmit} className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                type="text"
                placeholder="姓名"
                value={quickApplication.name}
                onChange={(e) => setQuickApplication(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white"
                required
              />
              <Input
                type="email"
                placeholder="邮箱"
                value={quickApplication.email}
                onChange={(e) => setQuickApplication(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white"
                required
              />
              <Input
                type="tel"
                placeholder="电话"
                value={quickApplication.phone}
                onChange={(e) => setQuickApplication(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white"
                required
              />
              <Input
                type="text"
                placeholder="意向职位"
                value={quickApplication.position}
                onChange={(e) => setQuickApplication(prev => ({ ...prev, position: e.target.value }))}
                className="bg-white"
                required
              />
            </div>
            <Input
              type="text"
              placeholder="工作经验（简述）"
              value={quickApplication.experience}
              onChange={(e) => setQuickApplication(prev => ({ ...prev, experience: e.target.value }))}
              className="bg-white mb-6"
              required
            />
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                提交申请
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
        </motion.div>

        {/* 常见问题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              常见问题
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              解答您在申请过程中可能遇到的问题
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  ...ANIMATION_CONFIG.smooth, 
                  delay: 0.5 + index * 0.1 
                }}
                className="bg-white rounded-2xl p-6 mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationProcess;