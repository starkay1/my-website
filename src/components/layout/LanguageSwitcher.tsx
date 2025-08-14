'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LANGUAGES } from '@/lib/constants';
import { useClickOutside } from '@/hooks';
import type { ComponentProps, Language } from '@/types';

interface LanguageSwitcherProps extends ComponentProps {
  variant?: 'default' | 'compact';
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'default',
  showLabel = true,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    const locale = segments[1];
    return LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];
  };

  const currentLanguage = getCurrentLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLanguageChange = (langCode: string) => {
    const segments = pathname.split('/');
    segments[1] = langCode;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef} {...props}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 transition-all duration-200 rounded-xl active:scale-95',
          'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          variant === 'compact' && 'px-2 py-1',
          !showLabel && 'space-x-1'
        )}
      >
        <Globe size={variant === 'compact' ? 14 : 18} />
        {showLabel && (
          <>
            <span className="hidden sm:block">{currentLanguage.name}</span>
            <span className="sm:hidden">{currentLanguage.flag}</span>
          </>
        )}
        {!showLabel && (
          <span>{currentLanguage.flag}</span>
        )}
        <ChevronDown size={variant === 'compact' ? 12 : 16} className={cn(
          'transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={cn(
            'absolute top-full right-0 mt-2 glass-card rounded-2xl shadow-apple-lg z-20',
            variant === 'compact' ? 'w-32' : 'w-40'
          )}>
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200',
                  'first:rounded-t-2xl last:rounded-b-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700',
                  variant === 'compact' && 'px-3 py-2 space-x-2',
                  currentLanguage.code === language.code
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                )}
              >
                <span className={cn(
                  'text-lg',
                  variant === 'compact' && 'text-base'
                )}>
                  {language.flag}
                </span>
                <span className={cn(
                  'text-sm',
                  variant === 'compact' && 'text-xs'
                )}>
                  {language.name}
                </span>
                {currentLanguage.code === language.code && (
                  <div className="ml-auto w-2 h-2 bg-primary-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;