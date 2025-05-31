import React from 'react';
import { HexagramInfo, FiveElement, HexagramType } from '../../types';
import { fiveElementRelations, fiveElementStyles, hexagramInfo, getHexagramAttributes } from '../../data/hexagramData';
import { getElementRelationship } from '../../utils/hexagramUtils';
import { useAppStore } from '../../store/useAppStore';
import { getTextScaleClass } from '../../utils/fontUtils';

{/* @font-tool组件：元素分析面板 */}

interface ElementAnalysisPanelProps {
  hexagram: HexagramInfo;
}

const ElementAnalysisPanel: React.FC<ElementAnalysisPanelProps> = ({ hexagram }) => {
  const settings = useAppStore(state => state.settings);
  const theme = useAppStore(state => state.settings.theme);
  const fontSize = useAppStore(state => state.settings.fontSize);

  // 根据设置获取自定义五行属性
  const getHexagramWithCustomElements = (name: string): HexagramInfo => {
    const base = hexagramInfo[name as keyof typeof hexagramInfo];

    // 根据用户指定的六宫卦象与五行元素对应关系设置五行属性
    let element: FiveElement;

    // 使用用户指定的对应关系作为默认值
    switch(name) {
      case '大安':
        element = 'wood'; // 木
        break;
      case '留连':
        element = 'water'; // 水
        break;
      case '速喜':
        element = 'fire'; // 火
        break;
      case '赤口':
        element = 'metal'; // 金
        break;
      case '小吉':
        element = 'wood'; // 木
        break;
      case '空亡':
        element = 'earth'; // 土
        break;
      default:
        element = base.element;
    }

    // 应用设置中的自定义属性（如果有）
    if (name === '留连' && settings.liuLianElement !== 'water') {
      element = settings.liuLianElement;
    } else if (name === '小吉' && settings.xiaoJiElement !== 'wood') {
      element = settings.xiaoJiElement;
    }

    return {
      ...base,
      element,
      position: 1, // 临时值，不影响分析
      sixGod: '青龙', // 临时值，不影响分析
      sixRelative: '父母' // 临时值，不影响分析
    };
  };

  // 获取五行属性对应的中文名称
  const getElementName = (element: FiveElement): string => {
    const names: Record<FiveElement, string> = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水'
    };
    return names[element];
  };

  // 获取六宫卦象对应的颜色（按照用户指定的五行属性）
  const getHexagramIOSColor = (hexagramName: HexagramType): string => {
    const element = getElementByHexagram(hexagramName);
    return theme === 'chinese'
      ? `var(--color-${element})`  // 中国风主题使用CSS变量
      : {
          wood: '#34C759', // 木（苹果系统绿色）
          fire: '#FF3B30', // 火（苹果系统红色）
          earth: '#FFCC00', // 土（苹果系统黄色）
          metal: '#F2F2F7', // 金（iOS浅灰背景色）
          water: '#007AFF'  // 水（苹果系统蓝色）
        }[element] || '#007AFF';
  };

  // 获取五行关系的描述
  const getRelationshipDescription = (
    source: string,
    target: string,
    relationship: string
  ): string => {
    switch (relationship) {
      case 'generating':
        return `${source}生${target}`;
      case 'overcoming':
        return `${source}克${target}`;
      case 'weakening':
        return `${source}被${target}泄`;
      case 'counteracting':
        return `${source}被${target}克`;
      default:
        return `${source}与${target}无直接关系`;
    }
  };

  // 获取五行关系的颜色 - 统一使用标准文本颜色
  const getRelationshipColor = (relationship: string): string => {
    // 根据用户要求，文字不需要特殊颜色
    return 'text-iosText';
  };

  // 获取主题适配的五行颜色
  const getThemeElementColor = (element: FiveElement): string => {
    return theme === 'chinese'
      ? `var(--color-${element})`
      : {
          wood: '#34C759', // 木
          fire: '#FF3B30', // 火
          earth: '#FFCC00', // 土
          metal: '#F2F2F7', // 金
          water: '#007AFF'  // 水
        }[element] || '#007AFF';
  };

  // 获取固定的卦象五行映射
  const getFixedHexagramElement = (hexagramName: HexagramType): FiveElement => {
    const fixedElements: Record<HexagramType, FiveElement> = {
      '大安': 'wood',  // 木
      '留连': 'earth', // 改为土
      '速喜': 'fire',  // 火
      '赤口': 'metal', // 金
      '小吉': 'water', // 改为水
      '空亡': 'earth'  // 土
    };
    return fixedElements[hexagramName];
  };

  // 根据卦象名称获取五行属性 - 移到analyzeRelationships前面解决初始化顺序问题
  const getElementByHexagram = (hexName: string) => {
    // 使用统一的属性获取函数
    return getHexagramAttributes(hexName as HexagramType).element;
  };

  // 分析与其他卦象的五行关系 - 使用新的自定义关系逻辑
  const analyzeRelationships = () => {
    // 当前卦象的名称
    const currentHexagramName = hexagram.name as HexagramType;

    // 所有其他卦象
    const otherHexagrams: HexagramType[] = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'].filter(
      (name) => name !== currentHexagramName
    ) as HexagramType[];

    return otherHexagrams.map((targetHexagramName) => {
      // 使用统一属性获取函数获取对应五行
      const currentElement = getElementByHexagram(currentHexagramName);
      const targetElement = getElementByHexagram(targetHexagramName);

      let relationship = '';
      let description = '';

      // 根据五行相生相克规则生成描述
      if (currentElement === targetElement) {
        description = `${currentHexagramName}(${getElementName(currentElement)})与${targetHexagramName}(${getElementName(targetElement)})同性`;
        relationship = 'neutral';
      } else if (
        (currentElement === 'wood' && targetElement === 'fire') ||
        (currentElement === 'fire' && targetElement === 'earth') ||
        (currentElement === 'earth' && targetElement === 'metal') ||
        (currentElement === 'metal' && targetElement === 'water') ||
        (currentElement === 'water' && targetElement === 'wood')
      ) {
        description = `${currentHexagramName}(${getElementName(currentElement)})生${targetHexagramName}(${getElementName(targetElement)})`;
        relationship = 'generating';
      } else if (
        (currentElement === 'wood' && targetElement === 'earth') ||
        (currentElement === 'earth' && targetElement === 'water') ||
        (currentElement === 'water' && targetElement === 'fire') ||
        (currentElement === 'fire' && targetElement === 'metal') ||
        (currentElement === 'metal' && targetElement === 'wood')
      ) {
        description = `${currentHexagramName}(${getElementName(currentElement)})克${targetHexagramName}(${getElementName(targetElement)})`;
        relationship = 'overcoming';
      } else if (
        (currentElement === 'earth' && targetElement === 'wood') ||
        (currentElement === 'water' && targetElement === 'earth') ||
        (currentElement === 'fire' && targetElement === 'water') ||
        (currentElement === 'metal' && targetElement === 'fire') ||
        (currentElement === 'wood' && targetElement === 'metal')
      ) {
        description = `${currentHexagramName}(${getElementName(currentElement)})被${targetHexagramName}(${getElementName(targetElement)})克`;
        relationship = 'counteracting';
      } else {
        description = `${currentHexagramName}(${getElementName(currentElement)})被${targetHexagramName}(${getElementName(targetElement)})泄`;
        relationship = 'weakening';
      }

      return {
        name: targetHexagramName,
        relationship,
        description,
        color: getRelationshipColor(relationship),
        targetElement: targetElement
      };
    });
  };

  const relationships = analyzeRelationships();

  // 添加新的五行关系映射
  const getHexagramRelationship = (mainHex: string, otherHex: string) => {
    // 每个卦象与速喜(火)的具体关系
    if (mainHex === '速喜') {
      switch(otherHex) {
        case '大安': return { type: 'weakened', description: '被大安(木)泄' };
        case '留连': return { type: 'restrained', description: '被留连(土)克' };
        case '赤口': return { type: 'conquers', description: '克赤口(金)' };
        case '小吉': return { type: 'restrained', description: '被小吉(水)克' };
        case '空亡': return { type: 'generates', description: '生空亡(土)' };
      }
    }

    // 添加其他卦象之间的关系
    // ... (可以根据需要继续添加)

    // 默认关系 - 使用标准五行相生相克关系
    const elementRelations: Record<string, Record<string, any>> = {
      'wood': {
        'wood': { type: 'neutral', description: '同性' },
        'fire': { type: 'generates', description: '木生火' },
        'earth': { type: 'conquers', description: '木克土' },
        'metal': { type: 'restrained', description: '被金克' },
        'water': { type: 'strengthened', description: '水生木' }
      },
      'fire': {
        'wood': { type: 'strengthened', description: '木生火' },
        'fire': { type: 'neutral', description: '同性' },
        'earth': { type: 'generates', description: '火生土' },
        'metal': { type: 'conquers', description: '火克金' },
        'water': { type: 'restrained', description: '被水克' }
      },
      'earth': {
        'wood': { type: 'restrained', description: '被木克' },
        'fire': { type: 'strengthened', description: '火生土' },
        'earth': { type: 'neutral', description: '同性' },
        'metal': { type: 'generates', description: '土生金' },
        'water': { type: 'conquers', description: '土克水' }
      },
      'metal': {
        'wood': { type: 'conquers', description: '金克木' },
        'fire': { type: 'restrained', description: '被火克' },
        'earth': { type: 'strengthened', description: '土生金' },
        'metal': { type: 'neutral', description: '同性' },
        'water': { type: 'generates', description: '金生水' }
      },
      'water': {
        'wood': { type: 'generates', description: '水生木' },
        'fire': { type: 'conquers', description: '水克火' },
        'earth': { type: 'restrained', description: '被土克' },
        'metal': { type: 'strengthened', description: '金生水' },
        'water': { type: 'neutral', description: '同性' }
      }
    };

    // 获取两个卦象的五行属性
    const mainElement = getElementByHexagram(mainHex);
    const otherElement = getElementByHexagram(otherHex);

    // 返回对应的关系
    return elementRelations[mainElement]?.[otherElement] || { type: 'unknown', description: '关系未知' };
  };

  return (
    <div className="bg-iosCard rounded-ios-lg shadow-ios p-5">
      {/* @font-tool：五行分析标题 */}
      <h3 className={`font-medium mb-3 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'} ${getTextScaleClass(fontSize-2)}`}>
        五行分析
      </h3>

      <div className="mb-5">
        <div className="flex items-center mb-3 bg-iosBg p-3 rounded-ios">
          <div
            className="w-6 h-6 mr-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getHexagramIOSColor(hexagram.name) }}
          >
            {settings.useColorSymbols && (
              <>
                {/* @font-tool：五行符号 */}
                <span className={`text-white font-bold ${getTextScaleClass(fontSize - 3)}`}>
                  {fiveElementStyles[getFixedHexagramElement(hexagram.name)].symbol}
                </span>
              </>
            )}
          </div>
          <div>
            {/* @font-tool：卦象名称 */}
            <h4 className={`text-iosText ${getTextScaleClass(fontSize-2)}`}>
              {hexagram.name}
            </h4>
            {/* @font-tool：五行属性说明 */}
            <p className={`text-iosSecondary ${getTextScaleClass(fontSize-2)}`}>
              五行属性: {getElementName(getFixedHexagramElement(hexagram.name))}
            </p>
          </div>
        </div>

        {/* @font-tool：关系标题 */}
        <h5 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'} ${getTextScaleClass(fontSize-2)}`}>
          {hexagram.name}关系
        </h5>
        <div className="grid grid-cols-2 gap-3">
          {relationships.map((rel) => (
            <div key={rel.name} className="bg-iosBg rounded-ios p-3 shadow-ios">
              <div className="flex items-center mb-2">
                <div
                  className="w-4 h-4 mr-2 rounded-full"
                  style={{ backgroundColor: getHexagramIOSColor(rel.name) }}
                ></div>
                {/* @font-tool：关系卦名 */}
                <span className={`text-iosText font-medium ${getTextScaleClass(fontSize - 3)}`}>
                  {rel.name}
                </span>
              </div>
              {/* @font-tool：关系描述 */}
              <div className={`text-iosSecondary ${getTextScaleClass(fontSize-2)}`}>
                {rel.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {/* @font-tool：相生相克图标题 */}
        <h4 className={`font-medium mb-3 text-iosText ${getTextScaleClass(fontSize - 3)}`}>五行相生相克图
        </h4>
        <div className="relative h-64 bg-iosBg rounded-ios overflow-hidden shadow-inner-sm">
          {/* 相生循环 */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 中心点 */}
            <circle cx="150" cy="150" r="3" fill="#8E8E93" />

            {/* 五行点 - 使用主题适配的颜色 */}
            <circle cx="150" cy="70" r="25" fill={getThemeElementColor('wood')} fillOpacity="0.9" /> {/* 木 */}
            {/* @font-tool：木标签 */}
            <text x="150" y="75" textAnchor="middle" fill="white" fontWeight="bold" className={getTextScaleClass(fontSize - 3)}>
              木
            </text>

            <circle cx="230" cy="150" r="25" fill={getThemeElementColor('fire')} fillOpacity="0.9" /> {/* 火 */}
            {/* @font-tool：火标签 */}
            <text x="230" y="155" textAnchor="middle" fill="white" fontWeight="bold" className={getTextScaleClass(fontSize - 3)}>
              火
            </text>

            <circle cx="190" cy="230" r="25" fill={getThemeElementColor('earth')} fillOpacity="0.9" /> {/* 土 */}
            {/* @font-tool：土标签 */}
            <text x="190" y="235" textAnchor="middle" fill="white" fontWeight="bold" className={getTextScaleClass(fontSize - 3)}>
              土
            </text>

            <circle cx="110" cy="230" r="25" fill={getThemeElementColor('metal')} fillOpacity="0.9" stroke="#C6C6C8" strokeWidth="1" /> {/* 金 */}
            {/* @font-tool：金标签 */}
            <text x="110" y="235" textAnchor="middle" fill="white" fontWeight="bold" className={getTextScaleClass(fontSize - 3)}>
              金
            </text>

            <circle cx="70" cy="150" r="25" fill={getThemeElementColor('water')} fillOpacity="0.9" /> {/* 水 */}
            {/* @font-tool：水标签 */}
            <text x="70" y="155" textAnchor="middle" fill="white" fontWeight="bold" className={getTextScaleClass(fontSize - 3)}>
              水
            </text>

            {/* 相生箭头 (使用各元素的对应颜色) */}
            <path
              d="M150 95 L150 125"
              stroke={getThemeElementColor('wood')}
              strokeWidth="2"
              markerEnd="url(#arrowhead-wood)"
            />
            <path
              d="M205 150 L175 150"
              stroke={getThemeElementColor('fire')}
              strokeWidth="2"
              markerEnd="url(#arrowhead-fire)"
            />
            <path
              d="M165 205 L145 180"
              stroke={getThemeElementColor('earth')}
              strokeWidth="2"
              markerEnd="url(#arrowhead-earth)"
            />
            <path
              d="M110 205 L130 180"
              stroke={getThemeElementColor('metal')}
              strokeWidth="2"
              markerEnd="url(#arrowhead-metal)"
            />
            <path
              d="M95 150 L125 150"
              stroke={getThemeElementColor('water')}
              strokeWidth="2"
              markerEnd="url(#arrowhead-water)"
            />

            {/* 相克箭头 (使用主题相适应的红色) */}
            <path
              d="M135 80 L105 130"
              stroke={theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'}
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#arrowhead-ios-red)"
            />
            <path
              d="M210 150 L180 210"
              stroke={theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'}
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#arrowhead-ios-red)"
            />
            <path
              d="M180 210 L95 160"
              stroke={theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'}
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#arrowhead-ios-red)"
            />
            <path
              d="M90 140 L145 80"
              stroke={theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'}
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#arrowhead-ios-red)"
            />
            <path
              d="M120 210 L210 160"
              stroke={theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'}
              strokeWidth="2"
              strokeDasharray="4"
              markerEnd="url(#arrowhead-ios-red)"
            />

            {/* 箭头标记 */}
            <defs>
              <marker
                id="arrowhead-wood"
                markerWidth="6"
                markerHeight="4"
                refX="0"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill={getThemeElementColor('wood')} />
              </marker>
              <marker
                id="arrowhead-fire"
                markerWidth="6"
                markerHeight="4"
                refX="0"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill={getThemeElementColor('fire')} />
              </marker>
              <marker
                id="arrowhead-earth"
                markerWidth="6"
                markerHeight="4"
                refX="0"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill={getThemeElementColor('earth')} />
              </marker>
              <marker
                id="arrowhead-metal"
                markerWidth="6"
                markerHeight="4"
                refX="0"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill={getThemeElementColor('metal')} />
              </marker>
              <marker
                id="arrowhead-water"
                markerWidth="6"
                markerHeight="4"
                refX="0"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill={getThemeElementColor('water')} />
              </marker>
              <marker
                id="arrowhead-ios-red"
                markerWidth="6"
                markerHeight="4"
                refX="0"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 6 2, 0 4" fill={theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'} />
              </marker>
            </defs>
          </svg>

          {/* 图例 */}
          {/* @font-tool：五行图图例文字 */}
          <div className={`absolute bottom-3 right-3 bg-iosCard rounded-ios shadow-ios p-2 ${getTextScaleClass(fontSize - 3)}`}>
            <div className="flex items-center mb-1">
              <span className="w-4 h-4 mr-2 rounded-full bg-iosCard flex items-center justify-center"
                style={{ border: `2px solid ${getThemeElementColor('wood')}` }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke={getThemeElementColor('wood')} strokeWidth="3">
                  <path d="M5 12h14M12 5v14" />
                </svg>
              </span>
              <span className="text-iosText">相生</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2 rounded-full bg-iosCard flex items-center justify-center"
                style={{ border: `2px solid ${theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'}` }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke={theme === 'chinese' ? 'var(--color-fire)' : '#FF3B30'} strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </span>
              <span className="text-iosText">相克</span>
            </div>
          </div>
        </div>

        {/* 说明文字 */}
        {/* @font-tool：五行图说明文字 */}
        <div className={`mt-4 p-3 bg-iosBg rounded-ios text-iosSecondary ${getTextScaleClass(fontSize - 3)}`}>
          <p>五行相生次序：木生火、火生土、土生金、金生水、水生木</p>
          <p>五行相克次序：木克土、土克水、水克火、火克金、金克木</p>
        </div>
      </div>
    </div>
  );
};

export default ElementAnalysisPanel;