import React, { useEffect, useCallback, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { App } from '@capacitor/app';

{/* @font-tool组件：滑动容器 */}

interface SwipeContainerProps {
  children: React.ReactNode;
  onBack?: () => void;
  disabled?: boolean;
}

/**
 * 侧滑容器组件，用于实现侧滑返回功能
 * 
 * @param {React.ReactNode} children - 子元素
 * @param {() => void} onBack - 返回回调函数
 * @param {boolean} disabled - 是否禁用侧滑返回
 */
const SwipeContainer: React.FC<SwipeContainerProps> = ({ 
  children, 
  onBack, 
  disabled = false 
}) => {
  // 使用useRef保存上一个回调函数，避免不必要的重复添加/移除监听器
  const previousOnBackRef = useRef(onBack);
  const previousDisabledRef = useRef(disabled);
  
  // 缓存回调函数，避免不必要的重新创建
  const handleBackButton = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);

  // 设置物理返回键监听，仅在回调或disabled状态真正改变时才重新设置
  useEffect(() => {
    // 检查回调或disabled是否真正改变
    if (disabled === previousDisabledRef.current && onBack === previousOnBackRef.current) {
      return; // 没有变化，不需要更新监听器
    }
    
    // 更新引用
    previousOnBackRef.current = onBack;
    previousDisabledRef.current = disabled;
    
    // 如果禁用或没有回调，不添加监听器
    if (disabled || !onBack) return;

    const setupBackButton = async () => {
      try {
        // 先移除任何现有的监听器
        await App.removeAllListeners();
        // 再添加新的监听器
        await App.addListener('backButton', handleBackButton);
      } catch (error) {
        console.log('不在Capacitor环境中，忽略物理返回键设置:', error);
      }
    };

    setupBackButton();

    return () => {
      const cleanupBackButton = async () => {
        try {
          await App.removeAllListeners();
        } catch (error) {
          console.log('清理物理返回键监听器失败，可能不在Capacitor环境中:', error);
        }
      };
      
      cleanupBackButton();
    };
  }, [disabled, onBack, handleBackButton]);

  // 优化侧滑手势配置
  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      // 只在左侧边缘开始的侧滑触发返回操作，加速响应
      if (eventData.initial[0] < 50 && onBack && !disabled) {
        onBack();
      }
    },
    // 提高灵敏度和响应速度
    trackMouse: false,
    trackTouch: true,
    delta: 30, // 减小阈值以提高响应性
    preventScrollOnSwipe: false,
    swipeDuration: 250, // 减少滑动判定的时间阈值
  });

  return (
    <div {...handlers} className="h-full w-full">
      {children}
    </div>
  );
};

export default React.memo(SwipeContainer); // 使用memo避免不必要的重渲染 