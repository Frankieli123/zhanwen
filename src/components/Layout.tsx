import React from 'react';
import { useAppStore } from '../store/useAppStore';

type AppTab = 'divination' | 'history' | 'settings' | 'result' | 'detail' | 'aireading';
type NavTab = 'divination' | 'history' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: NavTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const theme = useAppStore(state => state.settings.theme);
  
  // 导航项配置
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'divination',
      label: '占卦',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 16V8" />
        </svg>
      )
    },
    {
      id: 'history',
      label: '历史',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: '设置',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];
  
  // 获取页面标题
  const getPageTitle = () => {
    switch (activeTab) {
      case 'result':
        return '卦象结果';
      case 'detail':
        return '卦象详解';
      case 'aireading':
        return '详细解读';
      default:
        return '';
    }
  };
  
  // 是否显示返回按钮
  const showBackButton = activeTab === 'result' || activeTab === 'detail';
  
  // 处理返回逻辑
  const handleBackClick = () => {
    if (activeTab === 'detail') {
      useAppStore.getState().navigateToResult();
    } else {
      onTabChange('divination');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-iosBg ios-safe-area-top">
      {/* 主内容区 - 始终添加底部内边距，为导航栏留出空间 */}
      <main className="flex-1 overflow-auto px-4 pt-0 pb-24">
        {children}
      </main>
      
      {/* iOS风格底部标签栏，固定在底部 */}
      <footer className={`fixed bottom-0 left-0 right-0 bg-iosCard shadow-ios border-t ios-safe-area z-50 ${theme === 'chinese' ? 'border-chineseRed/20' : 'border-iosSeparator'}`} style={{ backdropFilter: 'blur(8px)' }}>
        <div className="flex justify-around pt-2 pb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id || 
                           (activeTab === 'result' && tab.id === 'divination') || 
                           (activeTab === 'detail' && tab.id === 'divination') ||
                           (activeTab === 'aireading' && tab.id === 'divination');
            
            return (
              <button
                key={tab.id}
                className={`flex flex-col items-center py-1.5 px-3 rounded-md ${
                  isActive
                    ? theme === 'chinese' ? 'text-chineseRed' : 'text-water'
                    : 'text-iosSecondary'
                }`}
                onClick={() => onTabChange(tab.id)}
                aria-label={`切换到${tab.label}页面`}
              >
                {tab.icon}
                <span className="text-xs mt-1">{tab.label}</span>
                
                {/* 活跃指示器 - 更美观的指示样式 */}
                {isActive && (
                  <div className={`absolute -bottom-1 w-10 h-0.5 rounded-full ${theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'}`}></div>
                )}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};

export default Layout; 