import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactMap from '@/components/contact/ContactMap';
import ContactFAQ from '@/components/contact/ContactFAQ';
import ContactCTA from '@/components/contact/ContactCTA';

interface ContactPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const t = await getTranslations('contact');
  
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