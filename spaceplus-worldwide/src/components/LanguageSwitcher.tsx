'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '../i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLanguage(loc)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              locale === loc
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {loc === 'zh' ? '中文' : 'English'}
          </button>
        ))}
      </div>
    </div>
  );
}