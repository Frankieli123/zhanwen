import React from 'react';
import { HexagramInfo, FiveElement, HexagramType } from '../../types';
import { fiveElementStyles } from '../../data/hexagramData';
import { hexagramDetailData } from '../../data/hexagramDetailData';
import { useAppStore } from '../../store/useAppStore';
import { mapLevelToPx } from '../../utils/fontUtils';

interface HexagramCardProps {
  hexagram: HexagramInfo;
  showDetails?: boolean;
  onDetailsClick?: () => void;
}

{/* @font-tool组件：卦象卡片 */}
const HexagramCard: React.FC<HexagramCardProps> = ({ hexagram, showDetails = false, onDetailsClick }) => {
  const useColorSymbols = useAppStore(state => state.settings.useColorSymbols);
  const theme = useAppStore(state => state.settings.theme);
  const fontSize = useAppStore(state => state.settings.fontSize);
  
  // 获取五行对应的样式
  const elementStyle = fiveElementStyles[hexagram.element];
  
  // 获取五行中文名称
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
  
  const elementName = getElementName(hexagram.element);
  
  // 从 hexagramDetailData 中提取季节和方位信息
  const getSeason = (hexagramName: HexagramType): string => {
    const hexDetail = hexagramDetailData[hexagramName];
    if (!hexDetail) return '未知';
    
    // 从描述中提取季节信息
    const desc = hexDetail.basicMeaning.coreMeaning;
    
    if (desc.includes('季节属春')) return '春';
    if (desc.includes('季节属夏')) return '夏';
    if (desc.includes('季节属秋')) return '秋';
    if (desc.includes('季节属冬')) return '冬';
    if (desc.includes('季节属长夏')) return '长夏';
    if (desc.includes('季节属四季')) return '四季交替';
    
    return '未知';
  };
  
  const getDirection = (hexagramName: HexagramType): string => {
    const hexDetail = hexagramDetailData[hexagramName];
    if (!hexDetail) return '未知';
    
    // 从描述中提取方位信息
    const desc = hexDetail.basicMeaning.coreMeaning;
    
    if (desc.includes('方位为东方')) return '东';
    if (desc.includes('方位为南方')) return '南';
    if (desc.includes('方位为西方')) return '西';
    if (desc.includes('方位为北方')) return '北';
    if (desc.includes('方位为中央')) return '中央';
    
    return '未知';
  };
  
  // 获取与五行对应的iOS颜色
  const getElementColor = (element: FiveElement, useChineseTheme: boolean): string => {
    return useChineseTheme ? 
      `var(--color-${element})` : // 使用CSS变量以确保颜色一致
      {
        wood: '#34C759', // 苹果绿色 - 木
        fire: '#FF3B30', // 苹果红色 - 火
        earth: '#FFCC00', // 苹果黄色 - 土
        metal: '#F2F2F7', // iOS浅灰 - 金
        water: '#007AFF'  // 苹果蓝色 - 水
      }[element] || '#007AFF';
  };
  
  const elementColor = getElementColor(hexagram.element, theme === 'chinese');
  
  // 获取季节和方位
  const season = getSeason(hexagram.name as HexagramType);
  const direction = getDirection(hexagram.name as HexagramType);
  
  return (
    <div className="bg-iosCard rounded-ios shadow-ios p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-medium flex items-center`} style={{ fontSize: `${mapLevelToPx(fontSize+3)}px` }}>
          {/* @font-tool：卦象名称 */}
          <div
            className="inline-block w-4 h-4 mr-2 rounded-full"
            style={{ backgroundColor: elementColor }}
            aria-label={`五行属性: ${elementName}`}
          ></div>
          <span className="text-iosText">{hexagram.name}</span>
          {useColorSymbols && (
            <span className={`ml-2`} style={{ fontSize: `${mapLevelToPx(fontSize)}px` }} title={`五行属性: ${elementName}`}>
              {/* @font-tool：五行符号 */}
              {elementStyle.symbol}
            </span>
          )}
        </h3>
      </div>
      
      <div className="mt-1 text-sm">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center">
            {/* @font-tool：五行属性标签 */}
            <span className={`bg-iosBg text-iosSecondary px-2 py-0.5 rounded-full mr-1`} style={{ fontSize: `${mapLevelToPx(fontSize-3)}px` }}>五行</span>
            {/* @font-tool：五行属性值 */}
            <span className={`text-iosText`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>{elementName}</span>
          </div>
          <div className="flex items-center">
            {/* @font-tool：六神属性标签 */}
            <span className={`bg-iosBg text-iosSecondary px-2 py-0.5 rounded-full mr-1`} style={{ fontSize: `${mapLevelToPx(fontSize-3)}px` }}>六神</span>
            {/* @font-tool：六神属性值 */}
            <span className={`text-iosText`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>{hexagram.sixGod}</span>
          </div>
          <div className="flex items-center">
            {/* @font-tool：季节属性标签 */}
            <span className={`bg-iosBg text-iosSecondary px-2 py-0.5 rounded-full mr-1`} style={{ fontSize: `${mapLevelToPx(fontSize-3)}px` }}>季节</span>
            {/* @font-tool：季节属性值 */}
            <span className={`text-iosText`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>{season}</span>
          </div>
          <div className="flex items-center">
            {/* @font-tool：方位属性标签 */}
            <span className={`bg-iosBg text-iosSecondary px-2 py-0.5 rounded-full mr-1`} style={{ fontSize: `${mapLevelToPx(fontSize-3)}px` }}>方位</span>
            {/* @font-tool：方位属性值 */}
            <span className={`text-iosText`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>{direction}</span>
          </div>
        </div>
        
        <div className="mt-2 p-3 bg-iosBg rounded-ios">
          {/* @font-tool：卦象描述 */}
          <p className={`text-center font-medium text-iosText`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>{hexagram.description}</p>
        </div>
        
        {showDetails && (
          <div className="mt-4 p-3 bg-iosBg rounded-ios">
            {/* @font-tool：解卦标题 */}
            <h4 className={`font-medium mb-2 text-iosText`} style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}>解卦说明:</h4>
            {/* @font-tool：解卦内容 */}
            <p className={`text-iosText`} style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}>{hexagram.interpretation}</p>
          </div>
        )}
      </div>
      
      {!showDetails && (
        <button 
          className={`mt-3 hover:opacity-90 self-end flex ml-auto items-center ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}
          style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}
          aria-label={`查看${hexagram.name}的详细解释`}
          onClick={onDetailsClick}
        >
          {/* @font-tool：详情按钮 */}
          查看详情
          <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HexagramCard;