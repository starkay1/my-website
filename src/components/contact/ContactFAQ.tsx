'use client';

import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  Zap,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/lib/constants';
import { Card, CardContent, Button } from '@/components/ui';
import type { ComponentProps } from '@/types';

interface ContactFAQProps extends ComponentProps {}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
}

export default function ContactFAQ({ className }: ContactFAQProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories: FAQCategory[] = [
    {
      id: 'all',
      name: '全部问题',
      icon: HelpCircle,
      color: 'text-gray-600',
      count: 12
    },
    {
      id: 'service',
      name: '服务相关',
      icon: Users,
      color: 'text-blue-600',
      count: 4
    },
    {
      id: 'pricing',
      name: '价格咨询',
      icon: DollarSign,
      color: 'text-green-600',
      count: 3
    },
    {
      id: 'process',
      name: '流程时间',
      icon: Clock,
      color: 'text-orange-600',
      count: 3
    },
    {
      id: 'security',
      name: '安全保障',
      icon: Shield,
      color: 'text-purple-600',
      count: 2
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'service',
      question: '你们主要提供哪些服务？',
      answer: '我们主要提供三大核心服务：项目托管管理、品牌战略顾问和品牌孵化服务。项目托管管理包括全流程项目管理、团队协调、进度监控等；品牌战略顾问涵盖品牌定位、市场分析、竞争策略等；品牌孵化服务则专注于新品牌的从0到1建设，包括品牌设计、营销推广、渠道建设等全方位支持。',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: '2',
      category: 'service',
      question: '服务覆盖哪些行业？',
      answer: '我们服务覆盖科技互联网、消费品牌、金融服务、教育培训、医疗健康、制造业等多个行业。我们拥有不同行业背景的专业顾问团队，能够深入理解各行业特点，提供针对性的解决方案。无论是传统行业的数字化转型，还是新兴行业的快速发展，我们都有丰富的实战经验。',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: '3',
      category: 'service',
      question: '你们的服务优势是什么？',
      answer: '我们的核心优势包括：1）10年+行业经验，服务过1000+企业客户；2）专业团队，平均从业经验8年以上；3）全程项目管理，确保按时按质交付；4）定制化解决方案，不是标准化产品；5）持续跟踪服务，项目结束后仍提供6个月免费咨询；6）成果导向，以客户业务增长为最终目标。',
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      id: '4',
      category: 'service',
      question: '如何保证服务质量？',
      answer: '我们建立了完善的质量保障体系：1）ISO 9001质量管理体系认证；2）项目启动前详细需求调研和方案确认；3）项目过程中定期汇报和阶段性验收；4）专业项目经理全程跟踪；5）多轮内部评审和客户确认；6）项目结束后客户满意度调研；7）不满意全额退款承诺。',
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      id: '5',
      category: 'pricing',
      question: '服务费用如何计算？',
      answer: '我们的收费模式灵活多样：1）项目制收费：根据项目规模、复杂度、周期等因素综合定价；2）顾问制收费：按月或按年提供持续顾问服务；3）成果制收费：与客户业务增长挂钩的成果分享模式。具体费用需要根据您的实际需求进行评估，我们会提供详细的报价方案和性价比分析。',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: '6',
      category: 'pricing',
      question: '是否提供免费咨询？',
      answer: '是的，我们为所有潜在客户提供30分钟免费初步咨询。在这30分钟内，我们的专业顾问会了解您的需求，分析现状，提供初步建议和解决思路。如果需要更深入的分析和详细方案，我们会根据工作量提供有偿的深度咨询服务。',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: '7',
      category: 'pricing',
      question: '付款方式是怎样的？',
      answer: '我们支持多种付款方式：1）银行转账；2）支票支付；3）在线支付（支付宝、微信）；4）分期付款。付款节点通常为：签约时支付30%，项目中期支付40%，项目完成验收后支付30%。对于长期合作客户，我们也可以提供更灵活的付款安排。',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: '8',
      category: 'process',
      question: '项目周期一般多长？',
      answer: '项目周期因服务类型和复杂度而异：1）品牌战略咨询：通常2-4周；2）项目托管管理：根据项目本身周期，我们提供全程管理；3）品牌孵化服务：一般3-6个月；4）数字化转型项目：通常6-12个月。我们会在项目启动前制定详细的时间计划，并严格按照计划执行。',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      id: '9',
      category: 'process',
      question: '项目流程是怎样的？',
      answer: '我们的标准项目流程包括：1）需求调研（1-2天）：深入了解客户需求和现状；2）方案设计（3-5天）：制定详细解决方案；3）方案确认（1天）：与客户确认方案细节；4）项目实施（根据项目而定）：按计划执行各项工作；5）阶段验收（定期）：定期汇报进展和阶段性成果；6）项目交付（1天）：最终成果交付和验收；7）后续跟踪（6个月）：提供免费咨询支持。',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      id: '10',
      category: 'process',
      question: '如何跟踪项目进度？',
      answer: '我们提供多种进度跟踪方式：1）专属项目经理一对一服务；2）每周进度报告邮件；3）在线项目管理系统实时查看；4）定期视频会议汇报；5）关键节点现场汇报；6）24小时客服热线随时沟通。您可以随时了解项目最新进展，我们承诺信息透明，进度可控。',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      id: '11',
      category: 'security',
      question: '如何保护客户信息安全？',
      answer: '信息安全是我们的重中之重：1）所有员工签署保密协议；2）项目资料加密存储和传输；3）严格的权限管理，仅相关人员可访问；4）定期安全审计和漏洞检测；5）符合GDPR等国际数据保护标准；6）项目结束后按约定销毁或归还资料；7）购买专业责任保险，为客户提供额外保障。',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      id: '12',
      category: 'security',
      question: '签署保密协议吗？',
      answer: '是的，我们会在项目开始前与客户签署详细的保密协议（NDA）。协议内容包括：1）保密信息的定义和范围；2）保密义务和责任；3）信息使用限制；4）违约责任和赔偿；5）协议有效期（通常为项目结束后5年）。我们严格遵守保密协议，确保客户商业机密和敏感信息的绝对安全。',
      icon: Shield,
      color: 'text-purple-600'
    }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.smooth}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          常见问题
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          这里整理了客户最关心的问题，如果没有找到您想要的答案，请随时联系我们
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.smooth}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'flex items-center px-4 py-2 rounded-full border-2 transition-all duration-300',
                  activeCategory === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                )}
              >
                <Icon className={cn(
                  'w-4 h-4 mr-2',
                  activeCategory === category.id ? 'text-blue-600' : category.color
                )} />
                <span className="font-medium">{category.name}</span>
                <span className={cn(
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  activeCategory === category.id
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                )}>
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={ANIMATION_CONFIG.smooth}
        className="space-y-4 mb-12"
      >
        {filteredFAQs.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_CONFIG.smooth, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="flex items-center flex-1">
                      <Icon className={cn('w-5 h-5 mr-4', item.color)} />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.question}
                      </h3>
                    </div>
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={ANIMATION_CONFIG.smooth}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="pl-9 text-gray-600 leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={ANIMATION_CONFIG.smooth}
        viewport={{ once: true }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              没有找到您想要的答案？
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              我们的专业顾问团队随时为您解答疑问，提供个性化的咨询服务
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                在线咨询
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                <Phone className="w-4 h-4 mr-2" />
                电话咨询
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>📞 咨询热线：400-123-4567 | 💬 在线客服：9:00-18:00</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}