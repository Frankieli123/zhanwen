import { FiveElement, HexagramElementMap, HexagramInfo, HexagramType, PalacePosition, SixGod, SixRelatives } from '../types';

// 默认的卦象五行属性映射
export const defaultHexagramElementMap: HexagramElementMap = {
  '大安': 'wood',
  '留连': 'earth', // 有些流派认为是水，可通过设置切换
  '速喜': 'fire',
  '赤口': 'metal',
  '小吉': 'water', // 有些流派认为是木，可通过设置切换
  '空亡': 'earth'
};

// 六神 - 修正顺序以与传统六壬学对应
export const sixGods: SixGod[] = ['青龙', '腾蛇', '朱雀', '白虎', '玄武', '勾陈'];

// 六亲 - 修正顺序以与传统六壬学对应
export const sixRelatives: SixRelatives[] = ['父母', '子孙', '官鬼', '妻财', '兄弟'];

// 卦象名称数组，顺序对应宫位
export const hexagramNames: HexagramType[] = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'];

// 宫位信息
export const palacePositions: PalacePosition[] = [1, 2, 3, 4, 5, 6];

// 详细卦象信息
export const hexagramInfo: Record<HexagramType, Omit<HexagramInfo, 'position' | 'sixGod' | 'sixRelative'>> = {
  '大安': {
    name: '大安',
    element: 'wood',
    description: '大安事事昌，求财在北方，失物去不远，宅舍保安康。',
    interpretation: '大安代表平安、顺利，是最吉利的卦象。事业、健康、财运等方面都会有所收获，人际关系融洽，整体运势良好。'
  },
  '留连': {
    name: '留连',
    element: 'earth',
    description: '留连事难成，求谋日未明，官事有忧疑，行人未归程。',
    interpretation: '留连代表拖延、停滞，事情的进展会比较缓慢。需要耐心等待，不宜操之过急。建议调整心态，适当放慢节奏。'
  },
  '速喜': {
    name: '速喜',
    element: 'fire',
    description: '速喜喜气生，求财向南行，失物在内处，婚姻有喜庆。',
    interpretation: '速喜代表好消息即将到来，事情会有转机，特别是在人际关系、感情和社交方面。可以积极把握机会，主动出击。'
  },
  '赤口': {
    name: '赤口',
    element: 'metal',
    description: '赤口主口舌，官司且慢行，失物寻不见，是非在口中。',
    interpretation: '赤口代表言语冲突，容易与人产生口角是非。建议谨言慎行，避免不必要的争端。处理事情需要更加谨慎。'
  },
  '小吉': {
    name: '小吉',
    element: 'water',
    description: '小吉报君知，求财向东移，失物虽已失，尽好在家里。',
    interpretation: '小吉代表小幸运，虽然不是大的突破，但也会有令人愉快的小事发生。适合稳健前行，不宜冒大险。'
  },
  '空亡': {
    name: '空亡',
    element: 'earth',
    description: '空亡无所得，求谋终不成，官事凶多吉，失物寻无踪。',
    interpretation: '空亡代表空虚、无结果，事情可能会有波折或者遇到挫折。建议调整期望，避免做重大决策，保持平和心态。'
  }
};

// 生成完整的卦象信息列表（包含宫位和六神六亲对应关系）
export const generateCompleteHexagramInfo = (): HexagramInfo[] => {
  // 正确的六亲映射关系
  const correctSixRelatives: Record<HexagramType, SixRelatives> = {
    '大安': '父母',
    '留连': '子孙',
    '速喜': '官鬼',
    '赤口': '妻财',
    '小吉': '子孙',
    '空亡': '兄弟'
  } as const;

  return hexagramNames.map((name, index) => {
    const position = palacePositions[index];
    const sixGod = sixGods[index];
    const sixRelative = correctSixRelatives[name];
    
    return {
      ...hexagramInfo[name],
      position,
      sixGod,
      sixRelative
    };
  });
};

// 五行生克关系
export const fiveElementRelations = {
  // 相生关系 (顺序: 木生火, 火生土, 土生金, 金生水, 水生木)
  generating: {
    'wood': 'fire',
    'fire': 'earth',
    'earth': 'metal',
    'metal': 'water',
    'water': 'wood'
  },
  // 相克关系 (顺序: 木克土, 土克水, 水克火, 火克金, 金克木)
  overcoming: {
    'wood': 'earth',
    'earth': 'water',
    'water': 'fire',
    'fire': 'metal',
    'metal': 'wood'
  }
};

// 五行颜色和符号映射
export const fiveElementStyles = {
  'wood': {
    color: '#34C759', // 木（苹果系统绿色）
    symbol: '△'
  },
  'fire': {
    color: '#FF3B30', // 火（苹果系统红色）
    symbol: '☲'
  },
  'earth': {
    color: '#FFCC00', // 土（苹果系统黄色）
    symbol: '□'
  },
  'metal': {
    color: '#F2F2F7', // 金（iOS浅灰背景色）
    symbol: '○'
  },
  'water': {
    color: '#007AFF', // 水（苹果系统蓝色）
    symbol: '☵'
  }
};

// 卦象的基础属性映射，根据传统设置
export const hexagramBaseAttributes = {
  '大安': {
    nature: '主吉（大或无事）', 
    sixGod: '青龙', 
    element: 'wood', 
    direction: '东方', 
    stems: '', 
    branches: '寅卯', 
    sequence: '首、一', 
    trigrams: '震卦为主兼巽卦'
  },
  '留连': {
    nature: '主凶（小，缓）', 
    sixGod: '腾蛇', 
    element: 'earth', 
    direction: '四季土，阴土，四斜方', 
    stems: '己', 
    branches: '辰戌丑未', 
    sequence: '次、二', 
    trigrams: '坤卦为主兼乾卦、巽卦、艮卦'
  },
  '速喜': {
    nature: '主吉（中，快）', 
    sixGod: '朱雀', 
    element: 'fire', 
    direction: '南方', 
    stems: '', 
    branches: '巳午', 
    sequence: '三', 
    trigrams: '离卦'
  },
  '赤口': {
    nature: '主凶（中，快）', 
    sixGod: '白虎', 
    element: 'metal', 
    direction: '西方', 
    stems: '', 
    branches: '申酉', 
    sequence: '四', 
    trigrams: '兑卦为主兼乾卦'
  },
  '小吉': {
    nature: '主吉（小，缓）', 
    sixGod: '玄武', 
    element: 'water', 
    direction: '北方', 
    stems: '', 
    branches: '亥子', 
    sequence: '五', 
    trigrams: '坎卦'
  },
  '空亡': {
    nature: '主凶（大或不详）', 
    sixGod: '勾陈', 
    element: 'earth', 
    direction: '阳土，不在四季，居中', 
    stems: '戊', 
    branches: '', 
    sequence: '六', 
    trigrams: '不在八卦内'
  }
};

// 统一的卦象属性获取函数
export const getHexagramAttributes = (hexName: HexagramType) => {
  const index = hexagramNames.indexOf(hexName);
  const baseAttributes = {
    element: hexagramInfo[hexName].element,
    sixGod: sixGods[index],
    sixRelative: (hexName === '小吉' ? '子孙' : (
      hexName === '大安' ? '父母' :
      hexName === '留连' ? '子孙' :
      hexName === '速喜' ? '官鬼' :
      hexName === '赤口' ? '妻财' :
      '兄弟' // 空亡
    )) as SixRelatives,
  };
  
  // 合并基础属性，但删除可能与baseAttributes冲突的字段
  const { element, sixGod, ...otherAttrs } = hexagramBaseAttributes[hexName] || {};
  
  return {
    ...baseAttributes,
    ...otherAttrs
  };
}; 