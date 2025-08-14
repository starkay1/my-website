import { VALIDATION_RULES } from './constants';
import { isValidEmail, isValidPhone } from './utils';
import type { ContactFormData } from '@/types';

// 验证错误类型
export interface ValidationError {
  field: string;
  message: string;
}

// 验证结果类型
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 验证规则类型
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

// 验证器类
export class Validator {
  private rules: Record<string, ValidationRule> = {};
  private messages: Record<string, Record<string, string>> = {
    zh: {
      required: '此字段为必填项',
      minLength: '长度不能少于 {min} 个字符',
      maxLength: '长度不能超过 {max} 个字符',
      pattern: '格式不正确',
      email: '请输入有效的邮箱地址',
      phone: '请输入有效的手机号码',
    },
    en: {
      required: 'This field is required',
      minLength: 'Must be at least {min} characters',
      maxLength: 'Must be no more than {max} characters',
      pattern: 'Invalid format',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
    },
    th: {
      required: 'ฟิลด์นี้จำเป็นต้องกรอก',
      minLength: 'ต้องมีอย่างน้อย {min} ตัวอักษร',
      maxLength: 'ต้องไม่เกิน {max} ตัวอักษร',
      pattern: 'รูปแบบไม่ถูกต้อง',
      email: 'กรุณากรอกอีเมลที่ถูกต้อง',
      phone: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง',
    },
  };

  constructor(private locale: string = 'zh') {}

  // 添加验证规则
  addRule(field: string, rule: ValidationRule): this {
    this.rules[field] = rule;
    return this;
  }

  // 验证单个字段
  validateField(field: string, value: any): ValidationError | null {
    const rule = this.rules[field];
    if (!rule) return null;

    const messages = this.messages[this.locale] || this.messages.zh;

    // 必填验证
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return {
        field,
        message: messages.required,
      };
    }

    // 如果值为空且非必填，跳过其他验证
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    const stringValue = String(value).trim();

    // 最小长度验证
    if (rule.minLength && stringValue.length < rule.minLength) {
      return {
        field,
        message: messages.minLength.replace('{min}', String(rule.minLength)),
      };
    }

    // 最大长度验证
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return {
        field,
        message: messages.maxLength.replace('{max}', String(rule.maxLength)),
      };
    }

    // 正则表达式验证
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return {
        field,
        message: messages.pattern,
      };
    }

    // 自定义验证
    if (rule.custom) {
      const result = rule.custom(value);
      if (result !== true) {
        return {
          field,
          message: typeof result === 'string' ? result : messages.pattern,
        };
      }
    }

    return null;
  }

  // 验证对象
  validate(data: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];

    Object.keys(this.rules).forEach(field => {
      const error = this.validateField(field, data[field]);
      if (error) {
        errors.push(error);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// 预定义验证器

// 联系表单验证器
export function createContactFormValidator(locale: string = 'zh'): Validator {
  const messages = {
    zh: {
      email: '请输入有效的邮箱地址',
      phone: '请输入有效的手机号码',
    },
    en: {
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
    },
    th: {
      email: 'กรุณากรอกอีเมลที่ถูกต้อง',
      phone: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง',
    },
  };

  const localeMessages = messages[locale as keyof typeof messages] || messages.zh;

  return new Validator(locale)
    .addRule('name', VALIDATION_RULES.name)
    .addRule('email', {
      ...VALIDATION_RULES.email,
      custom: (value: string) => isValidEmail(value) || localeMessages.email,
    })
    .addRule('phone', {
      ...VALIDATION_RULES.phone,
      custom: (value: string) => isValidPhone(value) || localeMessages.phone,
    })
    .addRule('message', VALIDATION_RULES.message);
}

// 邮件订阅验证器
export function createNewsletterValidator(locale: string = 'zh'): Validator {
  const messages = {
    zh: { email: '请输入有效的邮箱地址' },
    en: { email: 'Please enter a valid email address' },
    th: { email: 'กรุณากรอกอีเมลที่ถูกต้อง' },
  };

  const localeMessages = messages[locale as keyof typeof messages] || messages.zh;

  return new Validator(locale)
    .addRule('email', {
      ...VALIDATION_RULES.email,
      custom: (value: string) => isValidEmail(value) || localeMessages.email,
    });
}

// 搜索表单验证器
export function createSearchValidator(locale: string = 'zh'): Validator {
  return new Validator(locale)
    .addRule('query', {
      required: true,
      minLength: 1,
      maxLength: 100,
    });
}

// 文件上传验证器
export function createFileUploadValidator(
  maxSize: number = 10 * 1024 * 1024, // 10MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  locale: string = 'zh'
): Validator {
  const messages = {
    zh: {
      fileSize: `文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`,
      fileType: `只支持以下文件类型: ${allowedTypes.join(', ')}`,
    },
    en: {
      fileSize: `File size must not exceed ${Math.round(maxSize / 1024 / 1024)}MB`,
      fileType: `Only the following file types are supported: ${allowedTypes.join(', ')}`,
    },
    th: {
      fileSize: `ขนาดไฟล์ต้องไม่เกิน ${Math.round(maxSize / 1024 / 1024)}MB`,
      fileType: `รองรับเฉพาะไฟล์ประเภท: ${allowedTypes.join(', ')}`,
    },
  };

  const localeMessages = messages[locale as keyof typeof messages] || messages.zh;

  return new Validator(locale)
    .addRule('file', {
      required: true,
      custom: (file: File) => {
        if (!file) return true;
        
        // 检查文件大小
        if (file.size > maxSize) {
          return localeMessages.fileSize;
        }
        
        // 检查文件类型
        if (!allowedTypes.includes(file.type)) {
          return localeMessages.fileType;
        }
        
        return true;
      },
    });
}

// 快速验证函数

// 验证联系表单
export function validateContactForm(
  data: ContactFormData,
  locale: string = 'zh'
): ValidationResult {
  const validator = createContactFormValidator(locale);
  return validator.validate(data);
}

// 验证邮箱
export function validateEmail(email: string, locale: string = 'zh'): ValidationResult {
  const validator = createNewsletterValidator(locale);
  return validator.validate({ email });
}

// 验证手机号
export function validatePhone(phone: string, locale: string = 'zh'): ValidationResult {
  const messages = {
    zh: { phone: '请输入有效的手机号码' },
    en: { phone: 'Please enter a valid phone number' },
    th: { phone: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง' },
  };

  const localeMessages = messages[locale as keyof typeof messages] || messages.zh;

  const validator = new Validator(locale)
    .addRule('phone', {
      ...VALIDATION_RULES.phone,
      custom: (value: string) => isValidPhone(value) || localeMessages.phone,
    });

  return validator.validate({ phone });
}

// 验证文件
export function validateFile(
  file: File,
  maxSize?: number,
  allowedTypes?: string[],
  locale: string = 'zh'
): ValidationResult {
  const validator = createFileUploadValidator(maxSize, allowedTypes, locale);
  return validator.validate({ file });
}

// 实时验证 Hook 辅助函数
export function createFieldValidator(field: string, rule: ValidationRule, locale: string = 'zh') {
  const validator = new Validator(locale).addRule(field, rule);
  
  return (value: any): string | null => {
    const error = validator.validateField(field, value);
    return error ? error.message : null;
  };
}

// 表单状态管理辅助函数
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  const error = errors.find(err => err.field === field);
  return error?.message;
}

export function hasFieldError(errors: ValidationError[], field: string): boolean {
  return errors.some(err => err.field === field);
}

export function getErrorsForFields(errors: ValidationError[], fields: string[]): ValidationError[] {
  return errors.filter(err => fields.includes(err.field));
}

// 导出别名以保持向后兼容
export const contactFormValidator = createContactFormValidator;