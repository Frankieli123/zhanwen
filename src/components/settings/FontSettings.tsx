import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FontFamily } from '../../types';
import { fontOptions, getFontSize } from '../../utils/fontUtils';

const FontSettings: React.FC = () => {
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const [customUrl, setCustomUrl] = useState(settings.customFontUrl || '');
  const [sliderValue, setSliderValue] = useState(settings.fontSize);
  const sliderTimeout = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useAppStore(state => state.settings.theme);
  
  // 添加全局样式
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* 滑块容器样式 */
      .font-size-slider {
        position: relative;
        height: 40px;
        margin: 10px 0;
        width: 100%;
        padding: 0 10px; /* 为左右两侧的点留出足够空间 */
      }
      
      /* 滑块轨道样式 - 凹陷效果 */
      .slider-track {
        position: absolute;
        top: 50%;
        left: 10px;
        right: 10px;
        width: calc(100% - 20px);
        height: 6px;
        background-color: #f0f0f0;
        border-radius: 3px;
        transform: translateY(-50%);
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.2); /* 内阴影创造凹陷感 */
        border: 1px solid rgba(255,255,255,0.7); /* 上边缘亮色边框增强凹陷感 */
      }
      
      /* 已填充部分的轨道 */
      .slider-track-filled {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: var(--track-color, #007AFF);
        border-radius: 3px;
      }
      
      /* 原生滑块样式重置 */
      .slider-input {
        -webkit-appearance: none;
        appearance: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
        z-index: 10;
      }
      
      /* 隐藏默认轨道 - 但保留控件功能 */
      .slider-input::-webkit-slider-runnable-track {
        width: 100%;
        height: 6px;
        background: transparent;
        border: none;
        cursor: pointer;
      }
      
      .slider-input::-moz-range-track {
        width: 100%;
        height: 6px;
        background: transparent;
        border: none;
        cursor: pointer;
      }
      
      /* 滑块拇指样式 */
      .slider-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--thumb-color, #007AFF);
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        margin-top: -8px; /* 垂直居中调整 */
        z-index: 11;
      }
      
      .slider-input::-moz-range-thumb {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--thumb-color, #007AFF);
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        z-index: 11;
      }
      
      /* 增加滑动时的反馈 */
      .slider-input:active::-webkit-slider-thumb {
        transform: scale(1.1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .slider-input:active::-moz-range-thumb {
        transform: scale(1.1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      /* 停顿点样式 */
      .slider-stops-container {
        position: absolute;
        top: 50%;
        left: 10px;
        right: 10px;
        width: calc(100% - 20px);
        height: 10px;
        transform: translateY(-50%);
        z-index: 5;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
      }
      
      .slider-stop-point {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #f8f8f8;
        border: 1px solid #d0d0d0;
        transition: all 0.2s ease;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      .slider-stop-point.active {
        background: var(--active-stop-color, #007AFF);
        border-color: var(--active-stop-color, #007AFF);
        transform: scale(1.2);
      }
      
      /* 确保字体设置区域的元素固定大小 */
      .font-control-input {
        font-size: 14px !important; /* 固定字体大小 */
        height: 40px !important; /* 固定高度 */
        line-height: 1.5 !important; /* 固定行高 */
      }
      
      .font-control-button {
        font-size: 14px !important; /* 固定字体大小 */
        height: 40px !important; /* 固定高度 */
        line-height: 1.5 !important; /* 固定行高 */
        width: 72px !important; /* 固定宽度 */
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      /* 上传按钮样式 */
      .upload-btn {
        position: relative;
        overflow: hidden;
        cursor: pointer;
      }
      
      .upload-btn input[type=file] {
        position: absolute;
        top: 0;
        right: 0;
        min-width: 100%;
        min-height: 100%;
        font-size: 100px;
        text-align: right;
        filter: alpha(opacity=0);
        opacity: 0;
        outline: none;
        cursor: inherit;
        display: block;
      }
      
      /* 文件名显示样式 */
      .file-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px;
      }
    `;
    document.head.appendChild(styleElement);
    
    // 组件卸载时移除样式标签
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // 处理字体选择
  const handleFontChange = (value: FontFamily) => {
    updateSettings({ fontFamily: value });
  };
  
  // 处理字体大小滑块变化 - 实时更新显示值
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    
    // 添加吸附功能 - 当值接近预设点时自动吸附
    const stopPoints = [1, 2, 3, 4, 5];
    for (const point of stopPoints) {
      if (Math.abs(value - point) < 0.15) {
        value = point;
        break;
      }
    }
    
    setSliderValue(value);
    
    // 防抖处理 - 用户停止滑动后再更新全局设置
    if (sliderTimeout.current) {
      clearTimeout(sliderTimeout.current);
    }
    sliderTimeout.current = setTimeout(() => {
      updateSettings({ fontSize: value });
    }, 100);
  };
  
  // 处理自定义字体URL
  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
  };
  
  // 保存自定义字体URL
  const handleSaveCustomUrl = () => {
    updateSettings({ customFontUrl: customUrl });
  };
  
  // 处理文件上传
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.name.endsWith('.woff2') && !file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
      alert('请上传WOFF2、TTF或OTF格式的字体文件');
      return;
    }
    
    // 创建文件URL
    const fileUrl = URL.createObjectURL(file);
    setCustomUrl(fileUrl);
    
    // 自动保存
    updateSettings({ customFontUrl: fileUrl });
  };
  
  // 触发文件选择对话框
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 获取当前字体大小的展示文本
  const getFontSizeText = (sizeLevel: number): string => {
    // 定义停顿点
    const stopPoints = [1, 2, 3, 4, 5];
    
    // 找到最近的停顿点
    const closestPoint = stopPoints.reduce((prev, curr) => 
      Math.abs(curr - sizeLevel) < Math.abs(prev - sizeLevel) ? curr : prev
    );
    
    // 当值非常接近停顿点时（±0.1以内），显示停顿点的文本
    if (Math.abs(closestPoint - sizeLevel) <= 0.1) {
      switch (closestPoint) {
        case 1: return '很小';
        case 2: return '小';
        case 3: return '中等';
        case 4: return '大';
        case 5: return '很大';
        default: return '中等';
      }
    }
    
    // 否则，显示介于两个停顿点之间的文本
    if (sizeLevel < 1.5) return '很小-小';
    if (sizeLevel < 2.5) return '小-中等';
    if (sizeLevel < 3.5) return '中等-大';
    if (sizeLevel < 4.5) return '大-很大';
    return '很大';
  };
  
  // 计算轨道填充宽度
  const getTrackFilledWidth = () => {
    return `${((sliderValue - 1) / 4) * 100}%`;
  };
  
  // 确定哪个停顿点应该激活
  const isStopActive = (stopValue: number) => {
    return Math.abs(sliderValue - stopValue) <= 0.1;
  };
  
  // 获取文件名或URL显示文本
  const getFileDisplayName = (url: string) => {
    if (!url) return '';
    
    // 如果是Blob URL (本地上传的文件)
    if (url.startsWith('blob:')) {
      return '已上传的字体文件';
    }
    
    // 如果是常规URL，只显示文件名部分
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1] || url;
    } catch (e) {
      return url;
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-iosSecondary mb-2">
          应用字体
        </label>
        <div className="bg-iosBg rounded-ios divide-y divide-iosSeparator">
          {fontOptions.map(option => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                settings.fontFamily === option.value 
                  ? theme === 'chinese' ? 'text-chineseRed' : 'text-water' 
                  : 'text-iosText'
              }`}
              onClick={() => handleFontChange(option.value)}
            >
              <span style={{ fontFamily: option.family }}>{option.label}</span>
              {settings.fontFamily === option.value && (
                <svg className={`h-5 w-5 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {settings.fontFamily === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-iosSecondary mb-2">
            自定义字体
          </label>
          
          {/* 字体文件上传 */}
          <div className="flex flex-col space-y-2 mb-3">
            <div className="flex">
              <button
                type="button"
                onClick={triggerFileUpload}
                className={`font-control-button ${theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'} text-white px-4 rounded-ios upload-btn`}
              >
                上传字体
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".woff2,.ttf,.otf"
                  className="hidden"
                />
              </button>
              
              <div className="ml-3 flex items-center">
                {customUrl && (
                  <span className="text-sm text-iosText file-name">
                    {getFileDisplayName(customUrl)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-iosSecondary">
              支持WOFF2、TTF或OTF格式字体文件
            </p>
          </div>
          
          {/* URL输入 */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-iosSecondary mb-2">
              或者输入字体URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={customUrl}
                onChange={handleCustomUrlChange}
                className="font-control-input flex-1 bg-iosBg border-none rounded-l-ios py-2.5 px-3 text-iosText focus:ring-2 focus:ring-water"
                placeholder="https://example.com/font.woff2"
              />
              <button
                className={`font-control-button ${theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'} text-white py-2.5 px-4 rounded-r-ios`}
                onClick={handleSaveCustomUrl}
              >
                保存
              </button>
            </div>
            <p className="text-xs text-iosSecondary mt-1">
              请输入有效的字体文件URL，支持woff2、ttf或otf格式
            </p>
          </div>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-iosSecondary">
            字体大小
          </label>
          <span className={`text-sm font-medium ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosText'}`}>
            {getFontSizeText(sliderValue)}
          </span>
        </div>
        <div className="px-2">
          {/* 使用重新设计的滑块 */}
          <div className="font-size-slider" style={{ 
            '--track-color': theme === 'chinese' ? 'var(--color-chineseRed)' : 'var(--color-water)',
            '--thumb-color': theme === 'chinese' ? 'var(--color-chineseRed)' : 'var(--color-water)',
            '--active-stop-color': theme === 'chinese' ? 'var(--color-chineseRed)' : 'var(--color-water)'
          } as React.CSSProperties}>
            {/* 基础轨道 - 凹陷效果 */}
            <div className="slider-track">
              <div 
                className="slider-track-filled"
                style={{ width: getTrackFilledWidth() }}
              ></div>
            </div>
            
            {/* 停顿点标记 - 使用flex布局确保均匀分布 */}
            <div className="slider-stops-container">
              {[1, 2, 3, 4, 5].map((stop) => (
                <div 
                  key={stop} 
                  className={`slider-stop-point ${isStopActive(stop) ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            
            {/* 滑块输入 */}
            <input
              type="range"
              min="1"
              max="5"
              step="0.01"
              value={sliderValue}
              onChange={handleSliderChange}
              className="slider-input"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-iosBg rounded-ios">
        <h4 className={`font-medium mb-2 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosText'}`} style={{ 
          fontFamily: fontOptions.find(f => f.value === settings.fontFamily)?.family,
          fontSize: getFontSize(sliderValue).heading
        }}>
          预览标题文本
        </h4>
        <p style={{ 
          fontFamily: fontOptions.find(f => f.value === settings.fontFamily)?.family,
          fontSize: getFontSize(sliderValue).base
        }}>
          这是字体预览文本，您可以在此看到所选字体的效果。小六壬是中国传统的占卜方法之一，起源于唐代，结合了六爻、奇门、太乙等多种术数理论。
        </p>
      </div>
    </div>
  );
};

export default FontSettings; 