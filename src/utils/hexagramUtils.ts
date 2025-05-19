import { hexagramNames, hexagramInfo, sixGods, sixRelatives } from '../data/hexagramData';
import { DivinationResult, HexagramInfo, HexagramType, PalacePosition, SixGod, SixRelatives, ThreePalaceResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 基于小六壬方法的正确计算步骤
 * @param lunarMonth 农历月份 (1-12)
 * @param lunarDay 农历日期 (1-30)
 * @param hour 时辰 (0-11, 对应子时0点到亥时11点)
 * @returns 天宫、地宫、人宫三个卦象结果
 */
export const calculateThreePalaces = (
  lunarMonth: number,
  lunarDay: number,
  hour: number
): ThreePalaceResult => {
  // 1. 天宫（月）: 从"大安"开始，顺时针数到当前农历月
  const skyPalaceIndex = (lunarMonth - 1) % 6;
  const skyHexagramName = hexagramNames[skyPalaceIndex];
  
  // 2. 地宫（日）: 从天宫落点开始，继续顺时针数到当前农历日
  const earthPalaceIndex = (skyPalaceIndex + lunarDay - 1) % 6;
  const earthHexagramName = hexagramNames[earthPalaceIndex];
  
  // 3. 人宫（时）: 从地宫落点开始，继续顺时针数到当前时辰
  // 注意：时辰需要转换为1-12，而不是0-11
  const adjustedHour = hour + 1;
  const humanPalaceIndex = (earthPalaceIndex + adjustedHour - 1) % 6;
  const humanHexagramName = hexagramNames[humanPalaceIndex];
  
  // 生成完整的卦象信息
  const skyHexagram = {
    ...hexagramInfo[skyHexagramName],
    position: (skyPalaceIndex + 1) as PalacePosition,
    sixGod: sixGods[skyPalaceIndex],
    sixRelative: sixRelatives[skyPalaceIndex % 5]
  };
  
  const earthHexagram = {
    ...hexagramInfo[earthHexagramName],
    position: (earthPalaceIndex + 1) as PalacePosition,
    sixGod: sixGods[earthPalaceIndex],
    sixRelative: sixRelatives[earthPalaceIndex % 5]
  };
  
  const humanHexagram = {
    ...hexagramInfo[humanHexagramName],
    position: (humanPalaceIndex + 1) as PalacePosition,
    sixGod: sixGods[humanPalaceIndex],
    sixRelative: sixRelatives[humanPalaceIndex % 5]
  };
  
  // 生成三宫描述
  const skyDescription = `天宫(月): ${skyHexagram.name} - ${skyHexagram.description}`;
  const earthDescription = `地宫(日): ${earthHexagram.name} - ${earthHexagram.description}`;
  const humanDescription = `人宫(时): ${humanHexagram.name} - ${humanHexagram.description}`;
  
  // 生成综合解读
  const overallDescription = generateOverallDescription(skyHexagram, earthHexagram, humanHexagram);
  
  return {
    skyPalace: {
      hexagram: skyHexagram,
      description: skyDescription
    },
    earthPalace: {
      hexagram: earthHexagram,
      description: earthDescription
    },
    humanPalace: {
      hexagram: humanHexagram,
      description: humanDescription
    },
    overallDescription
  };
};

/**
 * 生成综合解读
 * @param skyHexagram 天宫卦象
 * @param earthHexagram 地宫卦象
 * @param humanHexagram 人宫卦象
 * @returns 综合解读文本
 */
const generateOverallDescription = (
  skyHexagram: HexagramInfo,
  earthHexagram: HexagramInfo,
  humanHexagram: HexagramInfo
): string => {
  // 计算吉凶卦数量
  const auspiciousCount = countAuspiciousHexagrams(skyHexagram, earthHexagram, humanHexagram);
  
  // 不同组合的解读
  if (auspiciousCount === 3) {
    return "三宫皆吉，事事顺遂，可大胆行事，有贵人相助。";
  } else if (auspiciousCount === 2) {
    return "两吉一凶，大势向好，但需注意细节，谨慎行事可成。";
  } else if (auspiciousCount === 1) {
    return "一吉两凶，事多阻滞，需耐心等待，不宜强求。";
  } else {
    return "三宫皆凶，不宜行事，应退守观望，待时而动。";
  }
};

/**
 * 统计吉卦数量
 * 吉卦: 大安、速喜、小吉
 * 凶卦: 留连、赤口、空亡
 */
const countAuspiciousHexagrams = (...hexagrams: HexagramInfo[]): number => {
  const auspiciousNames = ['大安', '速喜', '小吉'];
  return hexagrams.filter(h => auspiciousNames.includes(h.name)).length;
};

/**
 * 基于天时地利人和三个数字计算卦象
 * @param first 第一个数字 (1-100)
 * @param second 第二个数字 (1-100)
 * @param third 第一个数字 (1-100)
 * @returns 计算出的卦象
 */
export const calculateHexagramFromNumbers = (
  first: number,
  second: number,
  third: number
): HexagramInfo => {
  // 计算三数之和
  const sum = first + second + third;
  
  // 通过模6计算得到宫位索引 (0-5)
  const index = (sum % 6);
  
  // 根据索引获取对应的卦象名称
  const hexagramName = hexagramNames[index];
  
  // 返回完整的卦象信息
  return {
    ...hexagramInfo[hexagramName],
    position: (index + 1) as PalacePosition, // 宫位从1开始，使用类型断言
    sixGod: sixGods[index],
    sixRelative: sixRelatives[index % 5]
  };
};

/**
 * 基于农历时辰计算卦象 - 向后兼容的版本
 * @param lunarDay 农历日期数字 (1-30)
 * @param hour 时辰 (0-11, 对应子时0点到亥时11点)
 * @param lunarMonth 农历月份 (1-12)，默认为1
 * @returns 计算出的卦象（主要是人宫卦）
 */
export const calculateHexagramFromTime = (
  lunarDay: number,
  hour: number,
  lunarMonth: number = 1 // 默认为正月
): HexagramInfo => {
  // 使用新的三宫卦计算方法，返回人宫卦作为主卦
  const threePalaces = calculateThreePalaces(lunarMonth, lunarDay, hour);
  return threePalaces.humanPalace.hexagram;
};

/**
 * 生成三个随机数 (1-100)
 * @returns 三个随机数组成的数组
 */
export const generateRandomNumbers = (): [number, number, number] => {
  return [
    Math.floor(Math.random() * 100) + 1,
    Math.floor(Math.random() * 100) + 1,
    Math.floor(Math.random() * 100) + 1
  ];
};

/**
 * 基于三个随机数计算三宫卦象
 * @param first 第一个随机数 (对应天宫)
 * @param second 第二个随机数 (对应地宫)
 * @param third 第三个随机数 (对应人宫)
 * @returns 三宫卦象结果
 */
export const calculateThreePalacesFromNumbers = (
  first: number,
  second: number,
  third: number
): ThreePalaceResult => {
  // 计算天宫卦象 (基于第一个数)
  const skyPalaceIndex = (first % 6);
  const skyHexagramName = hexagramNames[skyPalaceIndex];
  
  // 计算地宫卦象 (基于第二个数)
  const earthPalaceIndex = (second % 6);
  const earthHexagramName = hexagramNames[earthPalaceIndex];
  
  // 计算人宫卦象 (基于第三个数)
  const humanPalaceIndex = (third % 6);
  const humanHexagramName = hexagramNames[humanPalaceIndex];
  
  // 生成完整的卦象信息
  const skyHexagram = {
    ...hexagramInfo[skyHexagramName],
    position: (skyPalaceIndex + 1) as PalacePosition,
    sixGod: sixGods[skyPalaceIndex],
    sixRelative: sixRelatives[skyPalaceIndex % 5]
  };
  
  const earthHexagram = {
    ...hexagramInfo[earthHexagramName],
    position: (earthPalaceIndex + 1) as PalacePosition,
    sixGod: sixGods[earthPalaceIndex],
    sixRelative: sixRelatives[earthPalaceIndex % 5]
  };
  
  const humanHexagram = {
    ...hexagramInfo[humanHexagramName],
    position: (humanPalaceIndex + 1) as PalacePosition,
    sixGod: sixGods[humanPalaceIndex],
    sixRelative: sixRelatives[humanPalaceIndex % 5]
  };
  
  // 生成三宫描述
  const skyDescription = `天宫(第一数): ${skyHexagram.name} - ${skyHexagram.description}`;
  const earthDescription = `地宫(第二数): ${earthHexagram.name} - ${earthHexagram.description}`;
  const humanDescription = `人宫(第三数): ${humanHexagram.name} - ${humanHexagram.description}`;
  
  // 生成综合解读
  const overallDescription = generateOverallDescription(skyHexagram, earthHexagram, humanHexagram);
  
  return {
    skyPalace: {
      hexagram: skyHexagram,
      description: skyDescription
    },
    earthPalace: {
      hexagram: earthHexagram,
      description: earthDescription
    },
    humanPalace: {
      hexagram: humanHexagram,
      description: humanDescription
    },
    overallDescription
  };
};

/**
 * 创建卦象结果对象
 * @param hexagram 卦象信息
 * @param options 其他选项
 * @returns 完整的卦象结果对象
 */
export const createDivinationResult = (
  hexagram: HexagramInfo,
  options: {
    isTimeHexagram: boolean;
    timeInfo?: {
      lunarDate: string;
      hour: number;
      lunarMonth?: number; // 新增月份信息
    };
    randomNumbers?: [number, number, number];
    query?: string;
    threePalaces?: ThreePalaceResult; // 新增三宫卦信息
  }
): DivinationResult => {
  return {
    id: uuidv4(),
    timestamp: Date.now(),
    hexagram,
    threePalaces: options.threePalaces,
    isTimeHexagram: options.isTimeHexagram,
    timeInfo: options.timeInfo,
    randomNumbers: options.randomNumbers,
    query: options.query
  };
};

/**
 * 获取流转顺序中下一个卦象
 * @param currentHexagram 当前卦象
 * @returns 下一个卦象
 */
export const getNextHexagram = (currentHexagram: HexagramType): HexagramType => {
  const currentIndex = hexagramNames.indexOf(currentHexagram);
  const nextIndex = (currentIndex + 1) % 6;
  return hexagramNames[nextIndex];
};

/**
 * 判断两个卦象之间的五行关系
 * @param source 源卦象
 * @param target 目标卦象
 * @returns 关系类型: "generating" | "overcoming" | "weakening" | "counteracting" | "none"
 */
export const getElementRelationship = (
  source: HexagramInfo,
  target: HexagramInfo
): "generating" | "overcoming" | "weakening" | "counteracting" | "none" => {
  const sourceElement = source.element;
  const targetElement = target.element;
  
  // 五行相生关系
  const generatesMap: Record<string, string> = {
    'wood': 'fire',   // 木生火
    'fire': 'earth',  // 火生土
    'earth': 'metal', // 土生金
    'metal': 'water', // 金生水
    'water': 'wood'   // 水生木
  };
  
  // 五行相克关系
  const overcomesMap: Record<string, string> = {
    'wood': 'earth',  // 木克土
    'earth': 'water', // 土克水
    'water': 'fire',  // 水克火
    'fire': 'metal',  // 火克金
    'metal': 'wood'   // 金克木
  };
  
  if (generatesMap[sourceElement] === targetElement) {
    return "generating"; // 相生
  } else if (overcomesMap[sourceElement] === targetElement) {
    return "overcoming"; // 相克
  } else if (generatesMap[targetElement] === sourceElement) {
    return "weakening"; // 被生 (被泄)
  } else if (overcomesMap[targetElement] === sourceElement) {
    return "counteracting"; // 被克
  } else {
    return "none"; // 无直接关系
  }
}; 