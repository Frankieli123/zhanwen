import React from 'react';
import { HexagramInfo, FiveElement } from '../../types';
import { fiveElementStyles } from '../../data/hexagramData';
import { useAppStore } from '../../store/useAppStore';

interface HexagramCardProps {
  hexagram: HexagramInfo;
  showDetails?: boolean;
  onDetailsClick?: () => void;
}

const HexagramCard: React.FC<HexagramCardProps> = ({ hexagram, showDetails = false, onDetailsClick }) => {
  const useColorSymbols = useAppStore(state => state.settings.useColorSymbols);
  const theme = useAppStore(state => state.settings.theme);
  
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
  
  return (
    <div className="bg-iosCard rounded-ios shadow-ios p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-medium flex items-center">
          <div
            className="inline-block w-4 h-4 mr-2 rounded-full"
            style={{ backgroundColor: elementColor }}
            aria-label={`五行属性: ${elementName}`}
          ></div>
          <span className="text-iosText">{hexagram.name}</span>
          {useColorSymbols && (
            <span className="ml-2 text-sm" title={`五行属性: ${elementName}`}>
              {elementStyle.symbol}
            </span>
          )}
        </h3>
      </div>
      
      <div className="mt-1 text-sm">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center">
            <span className="bg-iosBg text-iosSecondary px-2 py-0.5 rounded-full text-xs mr-1">五行</span>
            <span className="text-iosText">{elementName}</span>
          </div>
          <div className="flex items-center">
            <span className="bg-iosBg text-iosSecondary px-2 py-0.5 rounded-full text-xs mr-1">六神</span>
            <span className="text-iosText">{hexagram.sixGod}</span>
          </div>
          <div className="flex items-center col-span-2 mt-1">
            <span className="bg-iosBg text-iosSecondary px-2 py-0.5 rounded-full text-xs mr-1">宫位</span>
            <span className="text-iosText">{hexagram.position}</span>
          </div>
        </div>
        
        <div className="mt-2 p-3 bg-iosBg rounded-ios">
          <p className="text-center font-medium text-iosText">{hexagram.description}</p>
        </div>
        
        {showDetails && (
          <div className="mt-4 p-3 bg-iosBg rounded-ios">
            <h4 className="font-medium mb-2 text-iosText">解卦说明:</h4>
            <p className="text-sm text-iosText">{hexagram.interpretation}</p>
          </div>
        )}
      </div>
      
      {!showDetails && (
        <button 
          className={`mt-3 text-sm hover:opacity-90 self-end flex ml-auto items-center ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}
          aria-label={`查看${hexagram.name}的详细解释`}
          onClick={onDetailsClick}
        >
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