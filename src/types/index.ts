// 六神类型
export type SixGod = '青龙' | '朱雀' | '勾陈' | '腾蛇' | '白虎' | '玄武';

// 五行类型
export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

// 六亲类型
export type SixRelatives = '父母' | '兄弟' | '官鬼' | '妻财' | '子孙';

// 六宫位置类型
export type PalacePosition = 1 | 2 | 3 | 4 | 5 | 6;

// 卦象类型
export type HexagramType = '大安' | '留连' | '速喜' | '赤口' | '小吉' | '空亡';

// 三宫类型
export type PalaceType = '天宫' | '地宫' | '人宫';

// 卦象与五行对应关系
export interface HexagramElementMap {
  '大安': FiveElement;
  '留连': FiveElement;
  '速喜': FiveElement;
  '赤口': FiveElement;
  '小吉': FiveElement;
  '空亡': FiveElement;
}

// 卦象信息
export interface HexagramInfo {
  name: HexagramType;
  element: FiveElement;
  description: string;
  interpretation: string;
  position: PalacePosition;
  sixGod: SixGod;
  sixRelative: SixRelatives;
}

// 三宫卦象结果
export interface ThreePalaceResult {
  skyPalace: { // 天宫（月）
    hexagram: HexagramInfo;
    description: string;
  };
  earthPalace: { // 地宫（日）
    hexagram: HexagramInfo;
    description: string;
  };
  humanPalace: { // 人宫（时）
    hexagram: HexagramInfo;
    description: string;
  };
  overallDescription: string; // 三宫综合解读
}

// 生成的卦象结果
export interface DivinationResult {
  id: string;
  timestamp: number;
  hexagram: HexagramInfo;
  threePalaces?: ThreePalaceResult; // 新增三宫结果
  query?: string;
  notes?: string;
  aiReading?: string; // 新增详细解读内容
  isTimeHexagram: boolean; // 是正时卦还是活时卦
  timeInfo?: {
    lunarDate: string;
    hour: number;
    lunarMonth?: number; // 新增月份信息
  };
  randomNumbers?: [number, number, number];
}

// 用户输入模式
export type InputMode = 'time' | 'random';

// 应用程序主题
export type ThemeMode = 'light' | 'dark' | 'chinese';

// 字体类型 - 精简版本，添加霞鹜文楷、文源圆体和上图东观体
export type FontFamily = 'default' | 'noto' | 'sourceHan' | 'lxgwWenkai' | 'wenYuanRounded' | 'dongGuanTi' | 'custom';

// 设置选项
export interface AppSettings {
  language: string;
  theme: ThemeMode;
  vibration: boolean;
  liuLianElement: FiveElement; // 留连五行属性
  xiaoJiElement: FiveElement; // 小吉五行属性
  useColorSymbols: boolean; // 是否使用色盲友好的符号
  // 简化的字体设置
  fontFamily: FontFamily; // 统一字体
  fontSize: number; // 字体大小值 (0-15级别)
  lineHeight?: number; // 行高值
  customFontUrl?: string; // 可选的自定义字体URL
}