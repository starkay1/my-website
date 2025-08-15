'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { TouchOptimizedButton, LazyImage, PerformanceMonitor, PreloadCriticalResources } from '../../components/MobileOptimization';

export default function HomePage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('提交成功！我们会尽快联系您。');
        setFormData({ name: '', email: '', phone: '', requirements: '' });
      } else {
        alert('提交失败，请稍后重试。');
      }
    } catch (error) {
      alert('提交失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <PerformanceMonitor />
      <PreloadCriticalResources />
      <LanguageSwitcher />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TouchOptimizedButton
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                {t('hero.cta')}
              </TouchOptimizedButton>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
                {t('hero.downloadBrochure')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('stats.investmentValue')}</div>
              <div className="text-gray-600 text-lg">{t('stats.investment')}</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('stats.projectsValue')}</div>
              <div className="text-gray-600 text-lg">{t('stats.projects')}</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('stats.countriesValue')}</div>
              <div className="text-gray-600 text-lg">{t('stats.countries')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('form.title')}</h2>
          </div>
          <form id="contact-form" onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('form.namePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('form.emailPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('form.phonePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.requirements')}
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder={t('form.requirementsPlaceholder')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <TouchOptimizedButton
              onClick={() => {
                const form = document.getElementById('contact-form') as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '提交中...' : t('form.submit')}
            </TouchOptimizedButton>
          </form>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('team.title')}</h2>
            <p className="text-lg text-gray-600">{t('team.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">顾问 {i}</span>
                </div>
                <h3 className="font-semibold text-gray-900">投资顾问 {i}</h3>
                <p className="text-sm text-gray-600">资深投资专家</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partners.title')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-20">
                <span className="text-gray-400 text-sm">合作伙伴 {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
