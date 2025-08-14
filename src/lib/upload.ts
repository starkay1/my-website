import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 允许的文件类型
const ALLOWED_FILE_TYPES = {
  resume: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    extensions: ['.pdf', '.doc', '.docx'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  image: {
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    maxSize: 2 * 1024 * 1024 // 2MB
  }
};

// 文件验证结果接口
interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// 文件上传结果接口
interface FileUploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

/**
 * 验证文件类型和大小
 */
export function validateFile(
  file: File,
  fileType: keyof typeof ALLOWED_FILE_TYPES
): FileValidationResult {
  const config = ALLOWED_FILE_TYPES[fileType];
  
  // 检查文件类型
  if (!config.mimeTypes.includes(file.type)) {
    const allowedExtensions = config.extensions.join(', ');
    return {
      isValid: false,
      error: `不支持的文件类型。请上传 ${allowedExtensions} 格式的文件`
    };
  }
  
  // 检查文件大小
  if (file.size > config.maxSize) {
    const maxSizeMB = config.maxSize / (1024 * 1024);
    return {
      isValid: false,
      error: `文件大小超过限制。最大允许 ${maxSizeMB}MB`
    };
  }
  
  return { isValid: true };
}

/**
 * 生成安全的文件名
 */
export function generateSafeFileName(originalName: string, prefix?: string): string {
  // 移除特殊字符，只保留字母、数字、点和连字符
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // 生成时间戳
  const timestamp = Date.now();
  
  // 生成随机字符串
  const randomStr = Math.random().toString(36).substring(2, 8);
  
  // 获取文件扩展名
  const extension = safeName.substring(safeName.lastIndexOf('.'));
  const nameWithoutExt = safeName.substring(0, safeName.lastIndexOf('.'));
  
  // 组合文件名
  const fileName = prefix 
    ? `${prefix}_${timestamp}_${randomStr}_${nameWithoutExt}${extension}`
    : `${timestamp}_${randomStr}_${nameWithoutExt}${extension}`;
  
  return fileName;
}

/**
 * 确保目录存在
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * 上传文件到服务器
 */
export async function uploadFile(
  file: File,
  uploadDir: string,
  fileType: keyof typeof ALLOWED_FILE_TYPES,
  prefix?: string
): Promise<FileUploadResult> {
  try {
    // 验证文件
    const validation = validateFile(file, fileType);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }
    
    // 生成安全的文件名
    const fileName = generateSafeFileName(file.name, prefix);
    
    // 确保上传目录存在
    const fullUploadDir = join(process.cwd(), 'public', uploadDir);
    await ensureDirectoryExists(fullUploadDir);
    
    // 文件路径
    const filePath = join(fullUploadDir, fileName);
    const publicPath = `/${uploadDir}/${fileName}`;
    
    // 将文件转换为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 写入文件
    await writeFile(filePath, buffer);
    
    return {
      success: true,
      filePath: publicPath,
      fileName: fileName
    };
  } catch (error) {
    console.error('文件上传失败:', error);
    return {
      success: false,
      error: '文件上传失败，请重试'
    };
  }
}

/**
 * 上传简历文件
 */
export async function uploadResume(
  file: File,
  applicantName?: string
): Promise<FileUploadResult> {
  const prefix = applicantName ? applicantName.replace(/[^a-zA-Z0-9]/g, '_') : 'resume';
  return uploadFile(file, 'uploads/resumes', 'resume', prefix);
}

/**
 * 上传图片文件
 */
export async function uploadImage(
  file: File,
  category?: string
): Promise<FileUploadResult> {
  const uploadDir = category ? `uploads/images/${category}` : 'uploads/images';
  return uploadFile(file, uploadDir, 'image');
}

/**
 * 删除文件
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const { unlink } = await import('fs/promises');
    const fullPath = join(process.cwd(), 'public', filePath);
    
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('删除文件失败:', error);
    return false;
  }
}

/**
 * 获取文件信息
 */
export function getFileInfo(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
  };
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default {
  validateFile,
  generateSafeFileName,
  ensureDirectoryExists,
  uploadFile,
  uploadResume,
  uploadImage,
  deleteFile,
  getFileInfo,
  formatFileSize,
  ALLOWED_FILE_TYPES
};