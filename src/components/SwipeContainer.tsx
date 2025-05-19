import React, { useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { App } from '@capacitor/app';

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
  // 设置物理返回键监听
  useEffect(() => {
    if (disabled || !onBack) return;

    const setupBackButton = async () => {
      try {
        await App.addListener('backButton', () => {
          if (onBack) onBack();
        });
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
  }, [disabled, onBack]);

  // 设置侧滑手势
  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      // 只在左侧边缘开始的侧滑触发返回操作
      if (eventData.initial[0] < 50 && onBack && !disabled) {
        onBack();
      }
    },
    // 提高灵敏度
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: false,
  });

  return (
    <div {...handlers} className="h-full w-full">
      {children}
    </div>
  );
};

export default SwipeContainer; 