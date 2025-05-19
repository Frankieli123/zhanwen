import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getFontSize, getFontFamilyStyle, getCustomFontFaceRule } from '../utils/fontUtils';

// 这个组件负责将选定的字体样式应用到整个应用
const FontStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useAppStore(state => state.settings);
  
  useEffect(() => {
    // 获取或创建style元素
    let styleEl = document.getElementById('app-font-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'app-font-styles';
      document.head.appendChild(styleEl);
    }
    
    // 生成字体样式
    const fontFamily = getFontFamilyStyle(settings.fontFamily, settings.customFontUrl);
    const fontSizes = getFontSize(settings.fontSize);
    
    // 生成自定义字体@font-face规则（如果有）
    const customFontFace = getCustomFontFaceRule(settings.customFontUrl);
    
    // 构建CSS内容
    const cssContent = `
      ${customFontFace}
      
      body {
        font-family: ${fontFamily};
        font-size: ${fontSizes.base};
      }
      
      h1, h2, h3, h4, h5, h6, .title-font {
        font-family: ${fontFamily};
      }
      
      h1, .text-xl, .text-2xl {
        font-size: ${fontSizes.heading};
      }
      
      h2, h3, .text-lg, .text-xl {
        font-size: calc(${fontSizes.base} * 1.25);
      }
    `;
    
    // 应用样式
    styleEl.textContent = cssContent;
    
    // 清理函数
    return () => {
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, [settings.fontFamily, settings.fontSize, settings.customFontUrl]);
  
  return <>{children}</>;
};

export default FontStyleProvider; 