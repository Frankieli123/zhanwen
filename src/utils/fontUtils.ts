import { FontFamily } from '../types/index';

// 字体选项 - 精简版本，添加霞鹜文楷、文源圆体和上图东观体
export const extendedFontOptions: { value: FontFamily; label: string; family: string }[] = [
  { value: 'default', label: '系统默认', family: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { value: 'noto', label: '思源宋体', family: '"Noto Serif SC", serif' },
  { value: 'sourceHan', label: '思源黑体', family: '"Source Han Sans CN", sans-serif' },
  { value: 'lxgwWenkai', label: '霞鹜文楷', family: '"LXGW WenKai TC", "LXGW WenKai", serif' },
  { value: 'wenYuanRounded', label: '文源圆体', family: '"WenYuan Rounded SC M", "WenYuan Rounded", sans-serif' },
  { value: 'dongGuanTi', label: '上图东观体', family: '"STDongGuanTi", serif' },
  { value: 'custom', label: '自定义字体', family: 'CustomFont, sans-serif' }
];

// 旧的fontOptions，可以考虑移除或重定向到extendedFontOptions
export const fontOptions = extendedFontOptions;

/**
 * 简化的字体大小映射 - 直接对应像素值
 * fontSize = 18 对应 18px，fontSize+1 = 19px，fontSize-1 = 17px
 * 范围: 8px - 48px (扩展的字体大小范围，支持更大的字体)
 * @param level The font size level.
 * @returns The corresponding pixel value.
 */
export const mapLevelToPx = (level: number): number => {
  // 限制在合理的字体大小范围内 (8px - 48px)
  // 8px: 最小可读字体大小
  // 48px: 大标题的合理上限
  const clampedLevel = Math.max(8, Math.min(48, level));
  return clampedLevel;
};

// 字体大小计算函数 - 基于0-15的级别
export const getFontSize = (level: number): { base: string; heading: string } => {
  const basePx = mapLevelToPx(level);
  // 标题字号为基础字号的1.25倍，四舍五入到最近的整数
  const headingPx = Math.round(basePx * 1.25);

  return {
    base: `${basePx}px`,
    heading: `${headingPx}px`,
  };
};

// 行高计算函数
export const getLineHeight = (lineHeightLevel: number): string => {
  const level = Math.max(1.0, Math.min(2.0, lineHeightLevel));
  return level.toFixed(2);
};

// 获取当前字体CSS
export const getFontFamilyStyle = (fontFamily: FontFamily, customUrl?: string): string => {
  const font = extendedFontOptions.find(f => f.value === fontFamily);
  if (!font) return extendedFontOptions[0].family; // 默认使用第一个字体

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
      src: url('${customUrl}'); /* 移除 format，更通用 */
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
};

// 根据字体大小级别(0-15)返回Tailwind JIT类名
export const getTextScaleClass = (level: number): string => {
  const pixelValue = mapLevelToPx(level);
  // 添加data-font-tool属性，便于热更新客户端识别元素
  // 格式化level为带符号的字符串，例如+3或-2
  const signedLevel = level >= 0 ? `+${level}` : `${level}`;
  return `text-[${pixelValue}px] data-font-tool="${signedLevel}"`;
};

// 获取字体大小的显示文本 - 基于像素值
export const getFontSizeText = (level: number): string => {
  const px = mapLevelToPx(level);

  // 根据像素值返回描述性文字
  if (px <= 12) return "超小";
  if (px <= 15) return "小";
  if (px <= 19) return "标准";
  if (px <= 23) return "大";
  return "超大";
};

// 获取行高显示文本
export const getLineHeightText = (lineHeightLevel: number): string => {
  if (lineHeightLevel <= 1.1) return '极紧凑';
  if (lineHeightLevel <= 1.3) return '紧凑';
  if (lineHeightLevel <= 1.5) return '标准';
  if (lineHeightLevel <= 1.7) return '较宽松';
  if (lineHeightLevel <= 1.9) return '宽松';
  return '极宽松';
};