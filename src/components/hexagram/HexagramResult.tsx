import React, { useState, useCallback, useRef } from 'react';
import { DivinationResult, HexagramType, FiveElement } from '../../types';
import HexagramCard from './HexagramCard';
import ElementAnalysisPanel from './ElementAnalysisPanel';
import { useAppStore } from '../../store/useAppStore';
import { getNextHexagram } from '../../utils/hexagramUtils';
import { hexagramInfo, getHexagramAttributes } from '../../data/hexagramData';
import { getNavigateToAIReading } from '../../App';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getTextScaleClass } from '../../utils/fontUtils';

interface HexagramResultProps {
  result: DivinationResult;
}

// 使用React.memo包装组件以减少不必要的重渲染
const HexagramResult: React.FC<HexagramResultProps> = React.memo(({ result }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigateToHexagramDetail = useAppStore(state => state.navigateToHexagramDetail);
  const theme = useAppStore(state => state.settings.theme);
  const fontSize = useAppStore(state => state.settings.fontSize); // 获取全局字体大小
  const navigateBack = useAppStore(state => state.navigateBack);

  // 获取导航来源
  const navigationSource = useAppStore(state => state.navigationSource);

  // 生成卦象流转路径
  const generateHexagramPath = useCallback((startHexagram: string): string[] => {
    const path = [startHexagram];
    let currentHex = startHexagram;

    for (let i = 0; i < 5; i++) {
      currentHex = getNextHexagram(currentHex);
      path.push(currentHex);
    }

    return path;
  }, []);

  const flowPath = generateHexagramPath(result.hexagram.name);

  // 处理卦象详情点击
  const handleSingleHexagramDetails = () => {
    setShowDetails(!showDetails);
  };



  // 处理三宫卦象详情点击
  const handlePalaceDetails = (palace: 'sky' | 'earth' | 'human') => {
    if (!result.threePalaces) return;

    let hexagram;
    switch (palace) {
      case 'sky':
        hexagram = result.threePalaces.skyPalace.hexagram;
        break;
      case 'earth':
        hexagram = result.threePalaces.earthPalace.hexagram;
        break;
      case 'human':
        hexagram = result.threePalaces.humanPalace.hexagram;
        break;
    }

    navigateToHexagramDetail(hexagram);
  };

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 时辰转换为中文
  const hourToChinese = (hour: number): string => {
    const hourNames = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
    const hourIndex = Math.floor((hour + 1) / 2) % 12;
    return hourNames[hourIndex];
  };

  // 获取五行对应的颜色
  const getColorByElement = (element: FiveElement, useChineseTheme: boolean): string => {
    return useChineseTheme ?
      `var(--color-${element})` : // 使用CSS变量以确保颜色一致
      {
        wood: '#34C759', // 苹果绿色 - 木
        fire: '#FF3B30', // 苹果红色 - 火
        earth: '#FFCC00', // 苹果黄色 - 土
        metal: '#8E8E93', // iOS灰色 - 金
        water: '#007AFF'  // 苹果蓝色 - 水
      }[element] || '#007AFF';
  };

  // 渲染返回按钮
  const renderBackButton = () => (
    <button
      onClick={navigateBack}
      className={`p-2 -m-2 text-iosSecondary ${getTextScaleClass(fontSize)}`}
      aria-label="返回"
    >
      <ChevronLeftIcon className="h-5 w-5" />
    </button>
  );

  return (
    <>
      <div ref={cardRef} className="bg-iosCard rounded-ios-lg shadow-ios mb-6 overflow-hidden">
        <div className="p-5">
          {/* 卦象结果标题 - 始终显示返回按钮 */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-iosSeparator">
            {/* @font-tool：返回按钮 */}
            {renderBackButton()}

            {/* @font-tool：卦象结果标题 */}
            <h2 className={`font-semibold ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'} ${getTextScaleClass(fontSize+5)}`}>
              卦象结果
            </h2>

            {/* 占位符保持布局平衡 */}
            <div className="w-9 h-9"></div>
          </div>

          {/* 内容区域 */}
          <div>
            {/* 三宫卦象概述 - 改进的iOS风格圆形版本 */}
            {result.threePalaces ? (
              <div className="mb-5">
                <div className="flex items-center justify-between px-2">
                  {/* 天宫卦 */}
                  <div
                    className="w-[72px] h-[72px] rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      backgroundColor: getColorByElement(getHexagramAttributes(result.threePalaces.skyPalace.hexagram.name).element, theme === 'chinese')
                    }}>
                    {/* @font-tool：天宫卦符号 */}
                    <span
                      className={`font-bold ${result.threePalaces.skyPalace.hexagram.name === '赤口' ? 'text-gray-800' : 'text-white'} ${getTextScaleClass(fontSize+5)}`}
                    >
                      {result.threePalaces.skyPalace.hexagram.name}
                    </span>
                  </div>

                  {/* 第一条连接线 */}
                  <div className="h-px flex-grow mx-3 bg-gray-200 opacity-40"></div>

                  {/* 地宫卦 */}
                  <div
                    className="w-[72px] h-[72px] rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      backgroundColor: getColorByElement(getHexagramAttributes(result.threePalaces.earthPalace.hexagram.name).element, theme === 'chinese')
                    }}>
                    {/* @font-tool：地宫卦符号 */}
                    <span
                      className={`font-bold ${result.threePalaces.earthPalace.hexagram.name === '赤口' ? 'text-gray-800' : 'text-white'} ${getTextScaleClass(fontSize+5)}`}
                    >
                      {result.threePalaces.earthPalace.hexagram.name}
                    </span>
                  </div>

                  {/* 第二条连接线 */}
                  <div className="h-px flex-grow mx-3 bg-gray-200 opacity-40"></div>

                  {/* 人宫卦 */}
                  <div
                    className="w-[72px] h-[72px] rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      backgroundColor: getColorByElement(getHexagramAttributes(result.threePalaces.humanPalace.hexagram.name).element, theme === 'chinese')
                    }}>
                    {/* @font-tool：人宫卦符号 */}
                    <span
                      className={`font-bold ${result.threePalaces.humanPalace.hexagram.name === '赤口' ? 'text-gray-800' : 'text-white'} ${getTextScaleClass(fontSize+5)}`}
                    >
                      {result.threePalaces.humanPalace.hexagram.name}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-5 flex justify-center">
                <div
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: getColorByElement(getHexagramAttributes(result.hexagram.name).element, theme === 'chinese')
                  }}>
                  {/* @font-tool：单一卦符号 */}
                  <span
                    className={`font-bold ${result.hexagram.name === '赤口' ? 'text-gray-800' : 'text-white'} ${getTextScaleClass(fontSize+5)}`}
                  >
                    {result.hexagram.name}
                  </span>
                </div>
              </div>
            )}

            {/* 查询内容 */}
            {result.query && (
              <div className="mb-5 p-4 bg-iosBg rounded-ios">
                <h3 className={`font-medium mb-2 text-iosSecondary ${getTextScaleClass(fontSize-3)}`}>占问:</h3>
                <p className={`text-iosText ${getTextScaleClass(fontSize)}`}>{result.query}</p>
              </div>
            )}

            {/* 卦象类型信息 */}
            <div className="mb-5">
              {result.isTimeHexagram && result.timeInfo && (
                <>
                  {/* @font-tool：农历信息 */}
                  <div className={`text-iosSecondary mb-2 flex items-center ${getTextScaleClass(fontSize-3)}`}>
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    农历: {result.timeInfo.lunarDate} {hourToChinese(result.timeInfo.hour)}
                  </div>
                </>
              )}

              {!result.isTimeHexagram && (
                <>
                  {/* @font-tool：起卦时间 */}
                  <div className={`text-iosSecondary mb-2 flex items-center ${getTextScaleClass(fontSize-3)}`}>
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    起卦时间：{formatDate(result.timestamp)}
                  </div>
                </>
              )}
            </div>

            {/* 三宫卦象结果 */}
            {result.threePalaces && (
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 天宫卦 */}
                  <div className="bg-iosBg rounded-ios p-3 shadow-inner-sm">
                    {/* @font-tool：天宫标题 */}
                    <h4 className={`text-center font-medium mb-3 text-iosSecondary ${getTextScaleClass(fontSize)}`}>
                      {result.isTimeHexagram ? '天宫（月）' : '天宫（一数）'}
                    </h4>
                    <HexagramCard
                      hexagram={{
                        ...result.threePalaces.skyPalace.hexagram,
                        ...getHexagramAttributes(result.threePalaces.skyPalace.hexagram.name)
                      }}
                      showDetails={false}
                      onDetailsClick={() => handlePalaceDetails('sky')}
                    />
                  </div>

                  {/* 地宫卦 */}
                  <div className="bg-iosBg rounded-ios p-3 shadow-inner-sm">
                    {/* @font-tool：地宫标题 */}
                    <h4 className={`text-center font-medium mb-3 text-iosSecondary ${getTextScaleClass(fontSize)}`}>
                      {result.isTimeHexagram ? '地宫（日）' : '地宫（二数）'}
                    </h4>
                    <HexagramCard
                      hexagram={{
                        ...result.threePalaces.earthPalace.hexagram,
                        ...getHexagramAttributes(result.threePalaces.earthPalace.hexagram.name)
                      }}
                      showDetails={false}
                      onDetailsClick={() => handlePalaceDetails('earth')}
                    />
                  </div>

                  {/* 人宫卦 - 主卦 */}
                  <div className="bg-iosBg rounded-ios p-3 relative shadow-inner-sm border border-opacity-50" style={{ borderColor: theme === 'chinese' ? 'var(--color-chineseRed)' : 'var(--color-water)' }}>
                    {/* @font-tool：主卦标识 */}
                    <div className={`absolute top-1 right-1 ${theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'} text-white px-2 py-0.5 rounded-ios ${getTextScaleClass(fontSize-5)}`}>
                      主卦
                    </div>
                    {/* @font-tool：人宫标题 */}
                    <h4 className={`text-center font-medium mb-3 text-iosSecondary ${getTextScaleClass(fontSize)}`}>
                      {result.isTimeHexagram ? '人宫（时）' : '人宫（三数）'}
                    </h4>
                    <HexagramCard
                      hexagram={{
                        ...result.threePalaces.humanPalace.hexagram,
                        ...getHexagramAttributes(result.threePalaces.humanPalace.hexagram.name)
                      }}
                      showDetails={false}
                      onDetailsClick={() => handlePalaceDetails('human')}
                    />
                  </div>
                </div>

                {/* 三宫综合解读 */}
                <div className="mt-4 p-4 bg-iosBg rounded-ios">
                  <h4 className={`font-medium mb-2 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'} ${getTextScaleClass(fontSize)}`}>三宫综合解读
                  </h4>
                  <p className={`text-iosText ${getTextScaleClass(fontSize)}`}>{result.threePalaces.overallDescription}
                  </p>
                </div>
              </div>
            )}

            {/* 单一卦象信息卡片 (仅显示没有三宫卦象的结果) */}
            {!result.threePalaces && (
              <div className="mb-5">
                <HexagramCard
                  hexagram={{
                    ...result.hexagram,
                    ...getHexagramAttributes(result.hexagram.name)
                  }}
                  showDetails={showDetails}
                  onDetailsClick={() => navigateToHexagramDetail(result.hexagram)}
                />
              </div>
            )}

            {/* 卦象流转动画 */}
            <div className="mb-6">
              <h3 className={`font-medium mb-3 px-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'} ${getTextScaleClass(fontSize)}`}>卦象流转路径
              </h3>
              <div className="relative bg-iosBg rounded-ios py-4 px-4">
                <div className="flex items-start justify-between">
                  {flowPath.map((hexName, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      {/* @font-tool：流转序号 */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          hexName === result.hexagram.name
                            ? theme === 'chinese' ? 'bg-chineseRed text-white' : 'bg-water text-white'
                            : 'bg-iosCard border border-iosSeparator text-iosText'
                        } ${getTextScaleClass(fontSize)}`}
                      >
                        {index + 1}
                      </div>
                      {/* @font-tool：流转卦名 */}
                      <div className={`mt-2 text-iosSecondary text-center leading-tight ${getTextScaleClass(fontSize-5)}`}>
                        {hexName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 五行分析按钮区域 */}
        <div className="border-t border-iosSeparator">
          {/* 五行分析按钮 */}
          <div className="p-3">
            {/* @font-tool：五行分析按钮 */}
            <button
              className={`w-full py-2.5 bg-iosCard rounded-ios flex items-center justify-center ${
                theme === 'chinese' ? 'text-chineseRed' : 'text-water'
              }`}
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              <span className={`font-medium ${getTextScaleClass(fontSize)}`}>{showAnalysis ? '隐藏' : '查看'}五行分析</span>
              <svg
                className={`h-4 w-4 ml-1.5 transition-transform ${
                  showAnalysis ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 五行分析面板 */}
        {showAnalysis && (
          <div className="px-5 pt-2 pb-5 border-t border-iosSeparator">
            <ElementAnalysisPanel
              hexagram={{
                ...result.hexagram,
                ...getHexagramAttributes(result.hexagram.name)
              }}
            />
          </div>
        )}

        {/* 固定在底部的详细解读按钮 */}
        <div className="fixed bottom-0 left-0 right-0 z-40 pb-16 px-4 bg-gradient-to-t from-iosBg to-transparent pt-6">
          {/* @font-tool：详细解读按钮 */}
          <button
            className={`w-full py-3 text-white rounded-ios flex items-center justify-center shadow-ios ${
              theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
            }`}
            onClick={() => {
              // 保存当前结果的引用，确保不丢失aiReading字段
              const currentResultWithReading = useAppStore.getState().currentResult;
              // 设置导航来源为卦象结果页面
              useAppStore.setState({
                navigationSource: 'result'
              });
              // 先导航到AI解读页面
              getNavigateToAIReading()();
              // 确保导航后重新设置当前结果，保留所有字段
              if (currentResultWithReading) {
                useAppStore.setState({
                  currentResult: currentResultWithReading,
                  navigationSource: 'result' // 再次确保navigationSource设置正确
                });
              }
            }}
          >
            <span className={`font-medium ${getTextScaleClass(fontSize)}`}>详细解读</span>
            <svg
              className="h-4 w-4 ml-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>


    </>
  );
});

export default HexagramResult;