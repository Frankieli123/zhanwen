import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import HexagramInput from './components/hexagram/HexagramInput';
import HexagramResult from './components/hexagram/HexagramResult';
import ElementAnalysisPanel from './components/hexagram/ElementAnalysisPanel';
import HistoryList from './components/hexagram/HistoryList';
import Settings from './components/Settings';
import HexagramDetailPage from './components/hexagram/HexagramDetailPage';
import AIReadingResult from './components/hexagram/AIReadingResult';
import { useAppStore, setNavigateToResult, setNavigateToHexagramDetail, NavigationSource } from './store/useAppStore';
import FontStyleProvider from './components/FontStyleProvider';
import { HexagramInfo } from './types';
import { logService } from './services/logService';
import SwipeContainer from './components/SwipeContainer';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import FontSizeDebugger from './components/debug/FontSizeDebugger';

{/* @font-tool组件：应用 */}

// 在开发模式下自动开启API日志功能，在生产模式下关闭
if (process.env.NODE_ENV === 'development') {
  logService.setEnabled(true);
  console.log('API日志功能已自动开启（开发模式）');
} else {
  logService.setEnabled(false);
}

// 主导航标签类型
type NavTab = 'divination' | 'history' | 'settings';
// 所有页面标签类型
type AppTab = 'divination' | 'history' | 'settings' | 'result' | 'detail' | 'aireading';

// 将导航函数的声明移到组件外部，并预先定义
let navigateToAIReading: () => void = () => {};
let setActiveTabFunction: ((tab: AppTab) => void) | null = null;

export const setNavigateToAIReading = (navigateFunction: () => void) => {
  navigateToAIReading = navigateFunction;
};

export const getNavigateToAIReading = () => navigateToAIReading;

// 预先设置导航函数
export const initializeNavigation = (setTabFn: (tab: AppTab) => void) => {
  setActiveTabFunction = setTabFn;
  
  // 提前设置导航函数
  setNavigateToResult(() => {
    if (setActiveTabFunction) setActiveTabFunction('result');
  });
  
  setNavigateToHexagramDetail((hexagram: HexagramInfo) => {
    // 设置当前查看的卦象
    useAppStore.setState((state) => ({ ...state, currentDetailHexagram: hexagram }));
    // 切换到详情页面
    if (setActiveTabFunction) setActiveTabFunction('detail');
  });
  
  setNavigateToAIReading(() => {
    if (setActiveTabFunction) setActiveTabFunction('aireading');
  });
}

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('divination');
  const currentResult = useAppStore(state => state.currentResult);
  const divinationHistory = useAppStore(state => state.divinationHistory);
  const loadDivinationHistory = useAppStore(state => state.loadDivinationHistory);
  const theme = useAppStore(state => state.settings.theme);
  const setNavigationSource = useAppStore(state => state.setNavigationSource);
  const navigateBack = useAppStore(state => state.navigateBack);
  
  // 初始化状态栏
  useEffect(() => {
    const setupStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#00000030' });
        } catch (error) {
          console.error('设置状态栏失败:', error);
        }
      }
    };
    
    setupStatusBar();
  }, []);
  
  // 初始化导航函数
  useEffect(() => {
    initializeNavigation(setActiveTab);
  }, []);
  
  // 在组件加载时加载历史记录
  useEffect(() => {
    loadDivinationHistory();
  }, [loadDivinationHistory]);
  
  // 添加监听自定义导航事件
  useEffect(() => {
    const handleNavigateToHistory = () => {
      setActiveTab('history');
    };
    
    const handleNavigateToDivination = () => {
      setActiveTab('divination');
    };
    
    const handleNavigateToResult = () => {
      setActiveTab('result');
    };
    
    window.addEventListener('navigateToHistory', handleNavigateToHistory);
    window.addEventListener('navigateToDivination', handleNavigateToDivination);
    window.addEventListener('navigateToResult', handleNavigateToResult);
    
    return () => {
      window.removeEventListener('navigateToHistory', handleNavigateToHistory);
      window.removeEventListener('navigateToDivination', handleNavigateToDivination);
      window.removeEventListener('navigateToResult', handleNavigateToResult);
    };
  }, []);
  
  // 判断当前页面是否可以使用侧滑返回
  const canSwipeBack = () => {
    return activeTab === 'result' || activeTab === 'detail' || activeTab === 'aireading';
  };

  // 处理侧滑返回
  const handleSwipeBack = () => {
    navigateBack();
  };
  
  // 渲染不同的主要内容
  const renderMainContent = () => {
    switch (activeTab) {
      case 'divination':
        return (
          <div className="space-y-6 pt-0">
            <div>
              <HexagramInput />
            </div>
          </div>
        );
      
      case 'result':
        if (!currentResult) {
          setTimeout(() => setActiveTab('divination'), 0);
          
          return <div>正在加载...</div>;
        }
        
        return (
          <div className="pt-0">
            <HexagramResult result={currentResult} />
          </div>
        );
      
      case 'detail':
        return (
          <div className="pt-0">
            <HexagramDetailPage />
          </div>
        );
      
      case 'aireading':
        return (
          <div className="pt-0">
            <AIReadingResult />
          </div>
        );
      
      case 'history':
        return (
          <div className="pt-0">
            <HistoryList results={divinationHistory} />
          </div>
        );
      
      case 'settings':
        return (
          <div className="pt-0">
            <Settings />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // 将activeTab同步到Layout组件
  const handleTabChange = (newTab: NavTab) => {
    // 记录导航来源（主导航标签）
    setNavigationSource(newTab);
    setActiveTab(newTab);
  };
  
  return (
    <FontStyleProvider>
      <div className={
        theme === 'dark' ? 'dark' : 
        theme === 'chinese' ? 'chinese chinese-theme-applied' : ''
      }>
        <SwipeContainer 
          onBack={handleSwipeBack} 
          disabled={!canSwipeBack()}
        >
          <Layout activeTab={activeTab} onTabChange={handleTabChange}>
            {renderMainContent()}
          </Layout>
        </SwipeContainer>
      </div>
    </FontStyleProvider>
  );
}

export default App;
