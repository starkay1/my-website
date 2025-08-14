'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  Bell,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // 自动消失时间（毫秒），0表示不自动消失
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean; // 是否持久化显示
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  settings: NotificationSettings;
}

interface NotificationSettings {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications: number;
  defaultDuration: number;
  enableSound: boolean;
  enableAnimation: boolean;
}

const defaultSettings: NotificationSettings = {
  position: 'top-right',
  maxNotifications: 5,
  defaultDuration: 5000,
  enableSound: false,
  enableAnimation: true,
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// 通知图标映射
const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

// 通知颜色映射
const notificationColors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-800',
    message: 'text-green-700',
    button: 'text-green-600 hover:text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    message: 'text-red-700',
    button: 'text-red-600 hover:text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    button: 'text-yellow-600 hover:text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    message: 'text-blue-700',
    button: 'text-blue-600 hover:text-blue-800',
  },
};

// 位置样式映射
const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

// 单个通知组件
interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  settings: NotificationSettings;
}

function NotificationItem({ notification, onRemove, settings }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const Icon = notificationIcons[notification.type];
  const colors = notificationColors[notification.type];
  
  useEffect(() => {
    // 入场动画
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // 自动消失
    if (notification.duration && notification.duration > 0 && !notification.persistent) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.persistent]);
  
  const handleRemove = () => {
    if (settings.enableAnimation) {
      setIsRemoving(true);
      setTimeout(() => onRemove(notification.id), 300);
    } else {
      onRemove(notification.id);
    }
  };
  
  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      handleRemove();
    }
  };
  
  return (
    <div
      className={`
        relative max-w-sm w-full ${colors.bg} ${colors.border} border rounded-lg shadow-lg p-4 mb-3
        ${settings.enableAnimation ? 'transition-all duration-300 ease-in-out' : ''}
        ${
          settings.enableAnimation
            ? isRemoving
              ? 'opacity-0 transform translate-x-full scale-95'
              : isVisible
              ? 'opacity-100 transform translate-x-0 scale-100'
              : 'opacity-0 transform translate-x-full scale-95'
            : 'opacity-100'
        }
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        
        <div className="ml-3 flex-1">
          <h4 className={`text-sm font-medium ${colors.title}`}>
            {notification.title}
          </h4>
          <p className={`mt-1 text-sm ${colors.message}`}>
            {notification.message}
          </p>
          
          {notification.action && (
            <div className="mt-3">
              <button
                onClick={handleAction}
                className={`text-sm font-medium ${colors.button} transition-colors`}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleRemove}
            className={`inline-flex ${colors.button} transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 进度条（仅在有持续时间时显示） */}
      {notification.duration && notification.duration > 0 && !notification.persistent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' :
              notification.type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            } transition-all ease-linear`}
            style={{
              animation: `shrink ${notification.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// 通知容器组件
interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  settings: NotificationSettings;
}

function NotificationContainer({ notifications, onRemove, settings }: NotificationContainerProps) {
  // 限制显示的通知数量
  const visibleNotifications = notifications.slice(0, settings.maxNotifications);
  
  return (
    <div
      className={`fixed z-50 ${positionStyles[settings.position]} pointer-events-none`}
      style={{ maxWidth: '400px' }}
    >
      <div className="pointer-events-auto">
        {visibleNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
            settings={settings}
          />
        ))}
      </div>
    </div>
  );
}

// 通知设置组件
interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

function NotificationSettingsModal({ settings, onUpdate, isOpen, onClose }: NotificationSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  
  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              通知设置
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* 位置设置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                显示位置
              </label>
              <select
                value={localSettings.position}
                onChange={(e) => setLocalSettings(prev => ({ 
                  ...prev, 
                  position: e.target.value as NotificationSettings['position']
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="top-right">右上角</option>
                <option value="top-left">左上角</option>
                <option value="bottom-right">右下角</option>
                <option value="bottom-left">左下角</option>
                <option value="top-center">顶部居中</option>
                <option value="bottom-center">底部居中</option>
              </select>
            </div>
            
            {/* 最大通知数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大显示数量
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={localSettings.maxNotifications}
                onChange={(e) => setLocalSettings(prev => ({ 
                  ...prev, 
                  maxNotifications: parseInt(e.target.value) || 5
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* 默认持续时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                默认显示时间（秒）
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={localSettings.defaultDuration / 1000}
                onChange={(e) => setLocalSettings(prev => ({ 
                  ...prev, 
                  defaultDuration: (parseInt(e.target.value) || 5) * 1000
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* 开关设置 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  启用声音提示
                </label>
                <button
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ 
                    ...prev, 
                    enableSound: !prev.enableSound
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.enableSound ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.enableSound ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  启用动画效果
                </label>
                <button
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ 
                    ...prev, 
                    enableAnimation: !prev.enableAnimation
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.enableAnimation ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.enableAnimation ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存设置
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 通知提供者组件
interface NotificationProviderProps {
  children: React.ReactNode;
  initialSettings?: Partial<NotificationSettings>;
}

export function NotificationProvider({ children, initialSettings }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    ...defaultSettings,
    ...initialSettings,
  });
  
  // 从localStorage加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }
  }, []);
  
  // 保存设置到localStorage
  const updateNotificationSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      duration: notification.duration ?? settings.defaultDuration,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // 播放声音（如果启用）
    if (settings.enableSound) {
      // 这里可以添加声音播放逻辑
      // 例如：new Audio('/notification-sound.mp3').play().catch(() => {});
    }
    
    return id;
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateNotificationSettings,
    settings,
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        settings={settings}
      />
      <style jsx global>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

// 通知管理器组件（用于显示通知中心）
interface NotificationManagerProps {
  className?: string;
}

export function NotificationManager({ className }: NotificationManagerProps) {
  const { notifications, clearAllNotifications, settings, updateNotificationSettings } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.length;
  
  return (
    <div className={className}>
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  通知中心
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      清空全部
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>暂无通知</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {React.createElement(notificationIcons[notification.type], {
                            className: `w-4 h-4 ${notificationColors[notification.type].icon}`,
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.createdAt.toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <NotificationSettingsModal
        settings={settings}
        onUpdate={updateNotificationSettings}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

// 便捷的通知函数
export const createNotificationHelpers = () => {
  const { addNotification } = useNotifications();
  
  return {
    success: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'success', title, message, ...options }),
    
    error: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'error', title, message, ...options }),
    
    warning: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'warning', title, message, ...options }),
    
    info: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ type: 'info', title, message, ...options }),
  };
};

export default NotificationProvider;