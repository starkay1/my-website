import type { 
  ApiResponse, 
  ContactFormData, 
  Case, 
  NewsArticle, 
  JobPosition,
  PaginatedResponse 
} from '@/types';
import { API_ENDPOINTS, ERROR_MESSAGES } from './constants';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_TIMEOUT = 10000; // 10秒超时

// 请求拦截器
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Request successful',
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
            message: ERROR_MESSAGES.NETWORK_ERROR,
          };
        }
        
        return {
          success: false,
          error: error.message,
          message: ERROR_MESSAGES.NETWORK_ERROR,
        };
      }

      return {
        success: false,
        error: 'Unknown error',
        message: ERROR_MESSAGES.SERVER_ERROR,
      };
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// 创建 API 客户端实例
const apiClient = new ApiClient();

// 联系表单 API
export const contactApi = {
  // 提交联系表单
  submit: async (data: ContactFormData): Promise<ApiResponse<{ id: string }>> => {
    return apiClient.post(API_ENDPOINTS.contact, data);
  },

  // 订阅邮件列表
  subscribe: async (email: string): Promise<ApiResponse<{ id: string }>> => {
    return apiClient.post(API_ENDPOINTS.newsletter, { email });
  },
};

// 案例 API
export const casesApi = {
  // 获取案例列表
  getList: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Case>>> => {
    const queryParams = params ? {
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '12',
      ...(params.category && { category: params.category }),
      ...(params.search && { search: params.search }),
    } : undefined;

    return apiClient.get(API_ENDPOINTS.cases, queryParams);
  },

  // 获取单个案例
  getById: async (id: string): Promise<ApiResponse<Case>> => {
    return apiClient.get(`${API_ENDPOINTS.cases}/${id}`);
  },

  // 获取特色案例
  getFeatured: async (limit: number = 6): Promise<ApiResponse<Case[]>> => {
    return apiClient.get(`${API_ENDPOINTS.cases}/featured`, {
      limit: limit.toString(),
    });
  },
};

// 新闻 API
export const newsApi = {
  // 获取新闻列表
  getList: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<NewsArticle>>> => {
    const queryParams = params ? {
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '12',
      ...(params.category && { category: params.category }),
      ...(params.search && { search: params.search }),
    } : undefined;

    return apiClient.get(API_ENDPOINTS.news, queryParams);
  },

  // 获取单篇新闻
  getById: async (id: string): Promise<ApiResponse<NewsArticle>> => {
    return apiClient.get(`${API_ENDPOINTS.news}/${id}`);
  },

  // 获取最新新闻
  getLatest: async (limit: number = 6): Promise<ApiResponse<NewsArticle[]>> => {
    return apiClient.get(`${API_ENDPOINTS.news}/latest`, {
      limit: limit.toString(),
    });
  },
};

// 职位 API
export const jobsApi = {
  // 获取职位列表
  getList: async (params?: {
    page?: number;
    limit?: number;
    department?: string;
    type?: string;
    location?: string;
  }): Promise<ApiResponse<PaginatedResponse<JobPosition>>> => {
    const queryParams = params ? {
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '12',
      ...(params.department && { department: params.department }),
      ...(params.type && { type: params.type }),
      ...(params.location && { location: params.location }),
    } : undefined;

    return apiClient.get(API_ENDPOINTS.jobs, queryParams);
  },

  // 获取单个职位
  getById: async (id: string): Promise<ApiResponse<JobPosition>> => {
    return apiClient.get(`${API_ENDPOINTS.jobs}/${id}`);
  },

  // 申请职位
  apply: async (jobId: string, data: FormData): Promise<ApiResponse<{ id: string }>> => {
    // 对于文件上传，使用特殊的请求方法
    const url = `${API_ENDPOINTS.jobs}/${jobId}/apply`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data, // FormData 不需要设置 Content-Type
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Application submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },
};

// 通用 API 工具函数
export const apiUtils = {
  // 处理 API 响应
  handleResponse: <T>(response: ApiResponse<T>) => {
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || response.error || 'API request failed');
    }
  },

  // 创建查询参数
  createQueryParams: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },

  // 重试机制
  retry: async <T>(
    fn: () => Promise<ApiResponse<T>>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<ApiResponse<T>> => {
    let lastError: ApiResponse<T>;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await fn();
        if (result.success) {
          return result;
        }
        lastError = result;
      } catch (error) {
        lastError = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: ERROR_MESSAGES.NETWORK_ERROR,
        };
      }
      
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    
    return lastError!;
  },
};

// 导出默认 API 客户端
export default apiClient;