import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

// 动态导入所有组件以避免 SSR 问题
const ContactHero = dynamic(() => import('@/components/contact/ContactHero'), { ssr: false });
const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), { ssr: false });
const ContactInfo = dynamic(() => import('@/components/contact/ContactInfo'), { ssr: false });
const ContactMap = dynamic(() => import('@/components/contact/ContactMap'), { ssr: false });
const ContactFAQ = dynamic(() => import('@/components/contact/ContactFAQ'), { ssr: false });
const ContactCTA = dynamic(() => import('@/components/contact/ContactCTA'), { ssr: false });

interface ContactPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  // 在静态构建时使用固定语言环境
  const staticLocale = process.env.GITHUB_PAGES === 'true' ? 'zh-CN' : params.locale;
  const t = await getTranslations({ locale: staticLocale, namespace: 'contact' });
  
  return {
    title: '联系我们 - SpacePlus',
    description: '联系SpacePlus专业团队，获取定制化的数字化转型和品牌发展解决方案。多种联系方式，快速响应您的需求。',
    keywords: ['联系我们', '咨询服务', '项目合作', '客户服务', '商务洽谈', '技术支持'],
    openGraph: {
      title: '联系我们 - SpacePlus',
      description: '联系SpacePlus专业团队，获取定制化解决方案',
      type: 'website',
      locale: params.locale,
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = params;
  
  // Validate locale
  if (!['en', 'zh'].includes(locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <ContactHero />
      
      {/* Contact Form & Info */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Contact Form */}
            <ContactForm />
            
            {/* Contact Info */}
            <ContactInfo />
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <ContactMap />
      
      {/* FAQ Section */}
      <ContactFAQ />
      
      {/* CTA Section */}
      <ContactCTA />
    </main>
  );
}