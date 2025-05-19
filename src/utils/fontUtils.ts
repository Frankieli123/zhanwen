import { FontFamily } from '../types';

// 字体选项
export const fontOptions: { value: FontFamily; label: string; family: string }[] = [
  { value: 'default', label: '系统默认', family: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { value: 'noto', label: '思源宋体', family: '"Noto Serif SC", serif' },
  { value: 'sourceHan', label: '思源黑体', family: '"Source Han Sans CN", sans-serif' },
  { value: 'pingFang', label: '苹方', family: '"PingFang SC", "SF Pro SC", sans-serif' },
  { value: 'custom', label: '自定义字体', family: 'CustomFont, sans-serif' }
];

// 字体大小计算函数 - 支持浮点数的无极调整
export const getFontSize = (sizeLevel: number): { base: string; heading: string } => {
  // 限制在1.0-5.0范围内
  const level = Math.max(1.0, Math.min(5.0, sizeLevel));
  
  // 基础大小从14px到20px，线性插值
  const baseSize = 14 + (level - 1) * 1.5;
  // 标题大小从20px到32px，线性插值
  const headingSize = 20 + (level - 1) * 3;
  
  return {
    base: `${baseSize}px`,
    heading: `${headingSize}px`,
  };
};

// 获取当前字体CSS
export const getFontFamilyStyle = (fontFamily: FontFamily, customUrl?: string): string => {
  const font = fontOptions.find(f => f.value === fontFamily);
  if (!font) return fontOptions[0].family;
  
  // 如果是自定义字体且有自定义URL，则返回自定义字体名称
  if (fontFamily === 'custom' && customUrl) {
    return 'CustomFont, sans-serif';
  }
  
  return font.family;
};

// 生成自定义字体的@font-face规则
export const getCustomFontFaceRule = (customUrl?: string): string => {
  if (!customUrl) return '';
  
  return `
    @font-face {
      font-family: 'CustomFont';
      src: url('${customUrl}') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
};

// 根据字体大小设置文本缩放级别
export const getTextScaleClass = (sizeLevel: number): string => {
  // 四舍五入到最接近的级别
  const roundedLevel = Math.round(sizeLevel);
  
  switch (roundedLevel) {
    case 1: return 'text-sm';
    case 2: return 'text-base';
    case 3: return 'text-lg';
    case 4: return 'text-xl';
    case 5: return 'text-2xl';
    default: return 'text-base';
  }
}; 