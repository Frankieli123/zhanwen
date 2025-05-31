import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FontFamily } from '../../types/index';
import { extendedFontOptions, getFontSize, getFontSizeText, mapLevelToPx, getTextScaleClass } from '../../utils/fontUtils';

{/* @font-tool组件：字体设置 */}

const FontSettings: React.FC = () => {
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const [customUrl, setCustomUrl] = useState(settings.customFontUrl || '');
  const fontSize = settings.fontSize; // 获取当前字体大小

  // 定义5个档位对应的像素值 - 保持之前的标准大小18px
  const fontSizeLevels = [14, 16, 18, 21, 25]; // 超小、小、标准、大、超大 (与之前的档位像素值一致)

  // 获取当前字体大小档位 (0-4) - 基于像素值
  const getFontSizeLevel = (value: number) => {
    // 寻找最接近的档位
    let closest = 2; // 默认标准档位
    let minDistance = Math.abs(value - fontSizeLevels[2]);

    for (let i = 0; i < fontSizeLevels.length; i++) {
      const distance = Math.abs(value - fontSizeLevels[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    }
    return closest;
  };

  const [fontSizeSliderValue, setFontSizeSliderValue] = useState(() => {
    // 将现有的fontSize值映射到0-4的级别
    const currentFontSize = settings.fontSize;
    return getFontSizeLevel(currentFontSize);
  });
  const sliderTimeout = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useAppStore(state => state.settings.theme);

  // 在组件加载时，只设置滑块位置，不强制更新fontSize值
  useEffect(() => {
    const level = getFontSizeLevel(settings.fontSize);
    setFontSizeSliderValue(level);

    // 在开发模式下验证档位值与像素值的映射
    if (process.env.NODE_ENV === 'development') {
      console.log('字体大小档位映射测试:');
      fontSizeLevels.forEach((pixelValue, index) => {
        console.log(`档位 ${index} (${['超小', '小', '标准', '大', '超大'][index]}) = ${pixelValue}px`);
      });
      console.log(`当前fontSize: ${settings.fontSize}px, 对应档位: ${level}`);
    }
  }, []);

  // 添加全局样式
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* 滑块容器样式 */
      .font-size-slider, .line-height-slider {
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
        pointer-events: none;
      }

      .slider-stop-point {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #f8f8f8;
        border: 1px solid #d0d0d0;
        transition: all 0.2s ease;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        transform: translate(-50%, -50%);
        top: 50%;
        cursor: pointer;
        pointer-events: auto;
      }

      .slider-stop-point.active {
        background: var(--active-stop-color, #007AFF);
        border-color: var(--active-stop-color, #007AFF);
        width: 12px;
        height: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
        width: auto !important; /* 宽度自适应 */
        padding: 0 12px !important; /* 调整内边距 */
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
        max-width: 150px; /* 调整以适应布局 */
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

  // 处理字体大小滑块变化 (0-4级别)
  const handleFontSizeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value, 10);
    setFontSizeSliderValue(level);

    if (sliderTimeout.current) {
      clearTimeout(sliderTimeout.current);
    }

    sliderTimeout.current = setTimeout(() => {
      const fontSizeValue = fontSizeLevels[level];
      updateSettings({ fontSize: fontSizeValue });
    }, 150);
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

    if (!file.name.endsWith('.woff2') && !file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
      alert('请上传WOFF2、TTF或OTF格式的字体文件');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setCustomUrl(fileUrl);
    updateSettings({ customFontUrl: fileUrl });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getFileDisplayName = (url: string) => {
    if (!url) return '';
    if (url.startsWith('blob:')) return '已上传字体';
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1] || url;
    } catch (e) {
      return url;
    }
  };

  // 计算字体大小滑块轨道填充宽度 (0-4级别)
  const getFontSizeTrackFilledWidth = () => {
    return `${(fontSizeSliderValue / 4) * 100}%`;
  };

  return (
    <div className="space-y-6">
      {/* 字体选择 */}
      <div>
        <label className="block text-sm font-medium text-iosSecondary mb-2">
          应用字体
        </label>
        <div className="bg-iosBg rounded-ios divide-y divide-iosSeparator">
          {extendedFontOptions.map(option => (
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

      {/* 自定义字体区块 (仅当选择自定义字体时显示) */}
      {settings.fontFamily === 'custom' && (
        <div className="border-t border-iosSeparator pt-4">
          <label className="block text-sm font-medium text-iosSecondary mb-2">
            自定义字体设置
          </label>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={triggerFileUpload}
                className={`font-control-button ${theme === 'chinese' ? 'bg-chineseRed hover:bg-opacity-80' : 'bg-water hover:bg-opacity-80'} text-white rounded-ios upload-btn`}
              >
                上传字体文件
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".woff2,.ttf,.otf"
                  className="hidden"
                />
              </button>
              {customUrl && (
                <span className="text-sm text-iosText file-name truncate">
                  {getFileDisplayName(customUrl)}
                </span>
              )}
            </div>
            {/* @font-tool：文件格式说明 - 提示文字 */}
            <p className={`text-iosSecondary ${getTextScaleClass(fontSize-5)}`}>
              支持 .woff2, .ttf, .otf 格式。上传后将自动应用。
            </p>
            <div className="flex">
              <input
                type="text"
                value={customUrl.startsWith('blob:') ? '' : customUrl} // 如果是blob URL，输入框显示为空，避免混淆
                onChange={handleCustomUrlChange}
                className="font-control-input flex-1 bg-iosBg border border-iosSeparator rounded-l-ios py-2.5 px-3 text-iosText focus:ring-2 focus:ring-water focus:border-transparent"
                placeholder="或粘贴字体URL (e.g., .woff2)"
                disabled={customUrl.startsWith('blob:')} // 如果已上传文件，则禁用URL输入
              />
              <button
                className={`font-control-button ${theme === 'chinese' ? 'bg-chineseRed hover:bg-opacity-80' : 'bg-water hover:bg-opacity-80'} text-white rounded-r-ios`}
                onClick={handleSaveCustomUrl}
                disabled={customUrl.startsWith('blob:')}
              >
                应用URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 字体大小滑块 (0-4级别) */}
      <div className="border-t border-iosSeparator pt-4">
        <div className="flex justify-between items-center mb-1">
          {/* @font-tool：字体大小标签 - 辅助文字 */}
          <label className={`block font-medium text-iosSecondary ${getTextScaleClass(fontSize-2)}`}>
            字体大小
          </label>
          {/* @font-tool：当前档位显示 - 辅助文字 */}
          <span className={`font-medium ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosText'} ${getTextScaleClass(fontSize-2)}`}>
            {getFontSizeText(fontSizeLevels[fontSizeSliderValue])}
          </span>
        </div>
        <div className="px-2">
          <div className="font-size-slider relative h-10 my-2 w-full" style={{
            '--track-color': theme === 'chinese' ? 'var(--color-chineseRed)' : 'var(--color-water)',
            '--thumb-color': theme === 'chinese' ? 'var(--color-chineseRed)' : 'var(--color-water)',
            '--active-stop-color': theme === 'chinese' ? 'var(--color-chineseRed)' : 'var(--color-water)'
          } as React.CSSProperties}>
            <div className="slider-track absolute top-1/2 left-2.5 right-2.5 w-[calc(100%-20px)] h-1.5 bg-gray-200 rounded-full transform -translate-y-1/2 shadow-inner">
              <div
                className="slider-track-filled absolute top-0 left-0 h-full rounded-full"
                style={{ width: getFontSizeTrackFilledWidth(), backgroundColor: 'var(--track-color)' }}
              ></div>
            </div>

            {/* 添加5个锚点 */}
            <div className="slider-stops-container">
              {[0, 1, 2, 3, 4].map(level => {
                const isActive = fontSizeSliderValue === level;

                return (
                  <div
                    key={level}
                    className={`slider-stop-point ${isActive ? 'active' : ''}`}
                    style={{
                      left: `${(level / 4) * 100}%`
                    }}
                    onClick={() => {
                      setFontSizeSliderValue(level);
                      updateSettings({ fontSize: fontSizeLevels[level] });
                    }}
                  />
                );
              })}
            </div>

            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={fontSizeSliderValue}
              onChange={handleFontSizeSliderChange}
              className="slider-input absolute top-0 left-0 w-full h-full m-0 p-0 bg-transparent z-10 appearance-none"
            />
          </div>

          {/* 添加5个档位标签 */}
          <div className="flex justify-between mt-1 px-1 text-iosSecondary">
            {['超小', '小', '标准', '大', '超大'].map((label, index) => (
              <span
                key={label}
                className={`cursor-pointer hover:text-iosText transition-colors ${getTextScaleClass(fontSize-2)}`}
                onClick={() => {
                  setFontSizeSliderValue(index);
                  updateSettings({ fontSize: fontSizeLevels[index] });
                }}
              >
                {/* @font-tool：档位标签 - 辅助文字 */}
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="mt-6 p-4 bg-iosBg rounded-ios border border-iosSeparator">
        {/* @font-tool：预览标题 - 小标题 */}
        <h4 className={`font-medium mb-2 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosText'} ${getTextScaleClass(fontSizeLevels[fontSizeSliderValue] + 1)}`} style={{
          fontFamily: extendedFontOptions.find(f => f.value === settings.fontFamily)?.family,
          lineHeight: '1.5'
        }}>
          预览：静夜思
        </h4>
        {/* @font-tool：预览正文 - 正文 */}
        <p className={getTextScaleClass(fontSizeLevels[fontSizeSliderValue])} style={{
          fontFamily: extendedFontOptions.find(f => f.value === settings.fontFamily)?.family,
          lineHeight: '1.5'
        }}>
          床前明月光，疑是地上霜。<br />
          举头望明月，低头思故乡。
        </p>
        {/* @font-tool：预览说明 - 辅助文字 */}
        <p className={`mt-3 text-iosSecondary ${getTextScaleClass(fontSizeLevels[fontSizeSliderValue] - 2)}`} style={{
          fontFamily: extendedFontOptions.find(f => f.value === settings.fontFamily)?.family,
          lineHeight: '1.5'
        }}>
          (李白 · 唐) 这是字体设置的预览效果。您可以调整上方的选项来查看不同字体大小。
        </p>
      </div>
    </div>
  );
};

export default FontSettings;