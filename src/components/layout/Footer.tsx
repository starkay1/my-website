'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, Facebook, Twitter, Instagram, Linkedin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientOnly } from '@/components/ui';

const Footer = () => {
  const t = useTranslations();

  const footerLinks = {
    services: [
      { name: t('navigation.management'), href: '/services#management' },
      { name: t('navigation.consulting'), href: '/services#consulting' },
      { name: t('navigation.brand'), href: '/services#incubation' },
    ],
    company: [
      { name: t('navigation.about'), href: '/about' },
      { name: t('navigation.cases'), href: '/cases' },
      { name: t('navigation.news'), href: '/news' },
      { name: t('navigation.careers'), href: '/careers' },
    ],
    support: [
      { name: '联系我们', href: '/contact' },
      { name: '隐私政策', href: '/privacy' },
      { name: '服务条款', href: '/terms' },
      { name: '免责声明', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { name: 'WeChat', icon: MessageCircle, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <ClientOnly fallback={
      <footer className="relative bg-gradient-to-br from-neutral-900 via-primary-900/10 to-secondary-900/10 border-t border-white/10">
        <div className="responsive-container py-16 lg:py-20">
          <div className="text-center text-neutral-300">
            <p>© 2024 Spaceplus Worldwide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    }>
      <footer className="relative bg-gradient-to-br from-neutral-900 via-primary-900/10 to-secondary-900/10 border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="responsive-container py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-2xl opacity-20 blur-xl" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Spaceplus Worldwide
                </span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-neutral-300 leading-relaxed max-w-md text-base"
              >
                全球夜生活品牌管理与孵化平台，提供专业的夜店项目托管、品牌顾问、品牌孵化与授权服务，致力于打造独特的夜生活体验。
              </motion.p>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 text-neutral-300">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p>上海市黄浦区南京东路123号</p>
                    <p className="text-sm text-neutral-400">Spaceplus总部大厦</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-neutral-300">
                  <div className="w-8 h-8 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary-400" />
                  </div>
                  <a
                    href="tel:+8621-1234-5678"
                    className="hover:text-secondary-400 transition-colors duration-200"
                  >
                    +86 21-1234-5678
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-neutral-300">
                  <div className="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-accent-400" />
                  </div>
                  <a
                    href="mailto:hello@spaceplus.com"
                    className="hover:text-accent-400 transition-colors duration-200"
                  >
                    hello@spaceplus.com
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-white">{t('navigation.services')}</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-white">公司</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-300 hover:text-secondary-400 transition-colors duration-200 text-base group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-white">支持</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-300 hover:text-accent-400 transition-colors duration-200 text-base group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="responsive-container py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              {/* Copyright */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-neutral-400 text-sm"
              >
                © 2024 Spaceplus Worldwide. 保留所有权利。
              </motion.p>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex space-x-4"
              >
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-neutral-300 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </ClientOnly>
  );
};

export default Footer;