'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/Card';
import { Upload, File, X, Eye, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  fileType?: 'resume' | 'image';
  onUploadSuccess?: (file: UploadedFile) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

interface UploadedFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
  downloadUrl: string;
  previewUrl: string;
}

export function FileUpload({
  accept = '.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB
  fileType = 'resume',
  onUploadSuccess,
  onUploadError,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setError('');
    setIsUploading(true);
    setUploadProgress(0);

    // 验证文件大小
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      const error = `文件大小超过限制，最大允许 ${maxSizeMB}MB`;
      setError(error);
      setIsUploading(false);
      onUploadError?.(error);
      return;
    }

    // 验证文件类型
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      const error = `不支持的文件类型，请上传 ${allowedTypes.join(', ')} 格式的文件`;
      setError(error);
      setIsUploading(false);
      onUploadError?.(error);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success) {
        setUploadedFile(data.data);
        onUploadSuccess?.(data.data);
      } else {
        const error = data.message || '文件上传失败';
        setError(error);
        onUploadError?.(error);
      }
    } catch (error) {
      console.error('文件上传失败:', error);
      const errorMessage = '网络错误，请稍后重试';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled || isUploading) return;
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {!uploadedFile ? (
        <div
          className={cn(
            'border-2 border-dashed transition-colors cursor-pointer rounded-lg',
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
            disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p className="text-sm text-gray-600 mb-2">正在上传文件...</p>
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}%</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  点击上传或拖拽文件到此处
                </p>
                <p className="text-xs text-gray-500">
                  支持 {accept} 格式，最大 {formatFileSize(maxSize)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(uploadedFile.previewUrl, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(uploadedFile.downloadUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}