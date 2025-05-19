import React, { useEffect, useState } from 'react';
import { HexagramInfo, FiveElement } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { fiveElementStyles } from '../../data/hexagramData';
import { getHexagramDetail } from '../../data/hexagramDetailData';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const HexagramDetailPage: React.FC = () => {
  const currentHexagram = useAppStore(state => state.currentDetailHexagram);
  const navigateToResult = useAppStore(state => state.navigateToResult);
  const theme = useAppStore(state => state.settings.theme);
  
  // 获取五行中文名称
  const getElementName = (element: FiveElement): string => {
    const names: Record<FiveElement, string> = {
      wood: '木', fire: '火', earth: '土', metal: '金', water: '水'
    };
    return names[element];
  };
  
  // 如果没有当前卦象，则返回结果页面
  if (!currentHexagram) {
    setTimeout(() => navigateToResult(), 0);
    return <div className="p-5 text-center">正在返回结果页面...</div>;
  }
  
  const elementStyle = fiveElementStyles[currentHexagram.element];
  
  // 获取元素对应的CSS变量颜色
  const getElementCssColor = (element: FiveElement): string => {
    return theme === 'chinese' ? 
      `var(--color-${element})` : 
      elementStyle.color;
  };
  
  // 获取当前卦象的详细解释
  const hexagramDetail = getHexagramDetail(currentHexagram.name);
  
  return (
    <div className="bg-iosCard dark:bg-iosDarkCard rounded-ios-lg shadow-ios mb-6 overflow-hidden">
      {/* 头部 - 已由Layout.tsx处理 */}
      <div className="p-5">
        {/* 添加返回按钮和标题 */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-iosSeparator dark:border-iosDarkSeparator">
          <button 
            onClick={navigateToResult}
            className="p-2 -m-2 text-iosSecondary dark:text-iosDarkSecondary"
            aria-label="返回"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <h2 className={`text-xl font-medium ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>
            卦象详情
          </h2>
          
          <div className="w-5"></div> {/* 为了对称的空元素 */}
        </div>

        <div className="flex items-center mb-5">
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: getElementCssColor(currentHexagram.element) }}
          >
            <span className="text-2xl font-bold text-white">{currentHexagram.name[0]}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-iosText dark:text-iosDarkText">{currentHexagram.name}卦</h2>
            <div className="flex flex-wrap items-center mt-1">
              <span className="bg-iosBg dark:bg-iosDarkBg text-iosSecondary px-2 py-0.5 rounded-full text-xs mr-2 mb-1">五行</span>
              <span className="text-iosText dark:text-iosDarkText mr-2 mb-1">{getElementName(currentHexagram.element)}</span>
              <span className="bg-iosBg dark:bg-iosDarkBg text-iosSecondary px-2 py-0.5 rounded-full text-xs mr-2 mb-1">六神</span>
              <span className="text-iosText dark:text-iosDarkText mb-1">{currentHexagram.sixGod}</span>
            </div>
          </div>
        </div>
        
        {/* 详细内容 - 使用卡片式布局分区展示 */}
        <div className="space-y-5">
          {/* 一、基本含义与象征 */}
          <div className="bg-iosBg dark:bg-iosDarkBg rounded-ios p-4 border border-iosSeparator dark:border-iosDarkSeparator">
            <h3 className={`text-lg font-bold mb-3 pb-2 border-b border-iosSeparator dark:border-iosDarkSeparator flex items-center ${theme === 'chinese' ? 'text-chineseRed' : ''}`}>
              <span className="inline-block w-1 h-5 mr-2 rounded-sm" style={{ backgroundColor: getElementCssColor(currentHexagram.element) }}></span>
              一、基本含义与象征
            </h3>
            
            <div className="space-y-3">
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>核心意义</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.basicMeaning.coreMeaning}
                </p>
              </div>
              
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>象征物</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.basicMeaning.symbol}
                </p>
              </div>
              
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>断辞解析</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.basicMeaning.interpretation}
                </p>
              </div>
            </div>
          </div>
          
          {/* 二、具体应用场景 */}
          <div className="bg-iosBg dark:bg-iosDarkBg rounded-ios p-4 border border-iosSeparator dark:border-iosDarkSeparator">
            <h3 className={`text-lg font-bold mb-3 pb-2 border-b border-iosSeparator dark:border-iosDarkSeparator flex items-center ${theme === 'chinese' ? 'text-chineseRed' : ''}`}>
              <span className="inline-block w-1 h-5 mr-2 rounded-sm" style={{ backgroundColor: getElementCssColor(currentHexagram.element) }}></span>
              二、具体应用场景
            </h3>
            
            <div className="space-y-3">
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>婚姻与感情</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.applications.loveMarriage}
                </p>
              </div>
              
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>事业与财运</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.applications.careerWealth}
                </p>
              </div>
              
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>健康与灾厄</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.applications.healthDisaster}
                </p>
              </div>
            </div>
          </div>
          
          {/* 三、组合卦象的影响 */}
          <div className="bg-iosBg dark:bg-iosDarkBg rounded-ios p-4 border border-iosSeparator dark:border-iosDarkSeparator">
            <h3 className={`text-lg font-bold mb-3 pb-2 border-b border-iosSeparator dark:border-iosDarkSeparator flex items-center ${theme === 'chinese' ? 'text-chineseRed' : ''}`}>
              <span className="inline-block w-1 h-5 mr-2 rounded-sm" style={{ backgroundColor: getElementCssColor(currentHexagram.element) }}></span>
              三、组合卦象的影响
            </h3>
            
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {hexagramDetail.combinations.map((combo, index) => (
                <div key={index} className="p-2 border rounded-md border-iosSeparator dark:border-iosDarkSeparator">
                  <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>{currentHexagram.name} + {combo.with}</h4>
                  <p className="text-iosText dark:text-iosDarkText text-sm">{combo.result}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* 四、方位与时间宜忌 */}
          <div className="bg-iosBg dark:bg-iosDarkBg rounded-ios p-4 border border-iosSeparator dark:border-iosDarkSeparator">
            <h3 className={`text-lg font-bold mb-3 pb-2 border-b border-iosSeparator dark:border-iosDarkSeparator flex items-center ${theme === 'chinese' ? 'text-chineseRed' : ''}`}>
              <span className="inline-block w-1 h-5 mr-2 rounded-sm" style={{ backgroundColor: getElementCssColor(currentHexagram.element) }}></span>
              四、方位与时间宜忌
            </h3>
            
            <div className="space-y-3">
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>方位</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.timeDirection.direction}
                </p>
              </div>
              
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>时间</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.timeDirection.time}
                </p>
              </div>
            </div>
          </div>
          
          {/* 五、化解方法/增益与注意事项 */}
          <div className="bg-iosBg dark:bg-iosDarkBg rounded-ios p-4 border border-iosSeparator dark:border-iosDarkSeparator">
            <h3 className={`text-lg font-bold mb-3 pb-2 border-b border-iosSeparator dark:border-iosDarkSeparator flex items-center ${theme === 'chinese' ? 'text-chineseRed' : ''}`}>
              <span className="inline-block w-1 h-5 mr-2 rounded-sm" style={{ backgroundColor: getElementCssColor(currentHexagram.element) }}></span>
              五、{currentHexagram.name === '大安' || currentHexagram.name === '小吉' || currentHexagram.name === '速喜' ? '增益与注意事项' : '化解方法'}
            </h3>
            
            <div className="space-y-3">
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>风水调整</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.resolution.fengShui}
                </p>
              </div>
              
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>行为建议</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.resolution.behavior}
                </p>
              </div>
              
              <div>
                <h4 className={`font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-iosPrimary'}`}>宗教仪式</h4>
                <p className="text-iosText dark:text-iosDarkText text-sm">
                  {hexagramDetail.resolution.ritual}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HexagramDetailPage; 