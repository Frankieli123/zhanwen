// 重导出 types/index.ts 中的所有类型
export * from './types/index';

// 本地定义的 AppSettings (将覆盖 types/index.ts 中的同名接口)
import { ThemeMode, FontFamily, FiveElement } from './types/index';

// 应用设置
export interface AppSettings {
  // 外观
  theme: ThemeMode;
  fontSize: number; // 0-15 级别
  fontFamily: FontFamily;
  lineHeight?: number; // 行高
  customFontUrl?: string;
  
  // 功能
  language: string;
  vibration: boolean; // 触感
  
  // 占卦设置
  liuLianElement: FiveElement; // 留连变五行
  xiaoJiElement: FiveElement; // 小吉变五行
  useColorSymbols: boolean;  // 色盲友好符号
} 