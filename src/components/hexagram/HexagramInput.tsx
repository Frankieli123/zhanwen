import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { InputMode } from '../../types';
import { getEarthlyBranchName, getTimeRangeText, getLunarMonthDays, getLunarMonthName } from '../../utils/lunarUtils';
import zhanwenImage from '../../logo/zhanwen.png';
import zhanwenChineseImage from '../../logo/zhanwen2.png';
import zhanwenDarkImage from '../../logo/zhanwen3.png';

// 地支时辰对应表
const EARTHLY_BRANCHES = [
  { label: '子时', value: 0, time: '23:00-01:00' },
  { label: '丑时', value: 1, time: '01:00-03:00' },
  { label: '寅时', value: 2, time: '03:00-05:00' },
  { label: '卯时', value: 3, time: '05:00-07:00' },
  { label: '辰时', value: 4, time: '07:00-09:00' },
  { label: '巳时', value: 5, time: '09:00-11:00' },
  { label: '午时', value: 6, time: '11:00-13:00' },
  { label: '未时', value: 7, time: '13:00-15:00' },
  { label: '申时', value: 8, time: '15:00-17:00' },
  { label: '酉时', value: 9, time: '17:00-19:00' },
  { label: '戌时', value: 10, time: '19:00-21:00' },
  { label: '亥时', value: 11, time: '21:00-23:00' }
];

// 现时卦生成组件
const TimeHexagramInput: React.FC = () => {
  const {
    generateRealTimeHexagram,
  } = useAppStore();

  const theme = useAppStore(state => state.settings.theme);
  
  return (
    <div className="bg-iosCard p-5 rounded-ios-lg shadow-ios space-y-6">
      {/* 立即起卦按钮 */}
      <div>
        <button
          type="button"
          className={`w-full py-3.5 rounded-ios font-medium text-base flex items-center justify-center text-white ${
            theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
          }`}
          onClick={generateRealTimeHexagram}
          aria-label="使用当前时间立即起卦"
        >
          <svg 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          立即起卦
        </button>
        <p className="text-xs text-iosSecondary text-center mt-2">
          使用当前时间的农历日期和时辰自动生成卦象
        </p>
      </div>
      
      {/* 小六壬起卦说明 */}
      <div className={`bg-iosBg p-4 rounded-ios ${theme === 'chinese' ? 'border border-iosSeparator' : ''}`}>
        <h3 className={`text-base font-medium mb-2 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>小六壬起卦说明</h3>
        <p className="text-sm text-iosText mb-2">
          小六壬是中国传统占卜术之一，通过农历日期和时辰自动生成卦象，具有快速、准确的特点。
        </p>
        <p className="text-sm text-iosText mb-2">
          点击"立即起卦"按钮，系统将使用当前的农历日期和时辰自动计算卦象，呈现天、地、人三宫的卦爻变化。
        </p>
        <p className="text-sm text-iosText">
          小六壬以卦爻动静为基础，参考日时地支，推断吉凶，解读事情发展趋势。
        </p>
      </div>
    </div>
  );
};

// 活时卦输入组件
const RandomHexagramInput: React.FC = () => {
  const {
    randomNumbers,
    setRandomNumbers,
    generateNewRandomNumbers,
    generateHexagramFromRandom
  } = useAppStore();
  
  const theme = useAppStore(state => state.settings.theme);
  
  // 添加动画状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState<[number, number, number]>([...randomNumbers]);
  
  // 当 randomNumbers 变化时更新 displayNumbers
  useEffect(() => {
    if (!isGenerating) {
      setDisplayNumbers([...randomNumbers]);
    }
  }, [randomNumbers, isGenerating]);
  
  // 处理数字输入变化
  const handleNumberChange = (index: number, value: string) => {
    const newValue = parseInt(value, 10);
    if (isNaN(newValue) || newValue < 1 || newValue > 100) return;
    
    const newNumbers = [...randomNumbers];
    newNumbers[index] = newValue;
    setRandomNumbers(newNumbers as [number, number, number]);
  };

  // 添加新函数，处理随机数生成动画
  const generateRandomWithAnimation = () => {
    // 设置动画状态
    setIsGenerating(true);
    
    // 生成最终的目标随机数
    const targetNumbers: [number, number, number] = [
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1
    ];
    
    // 动画参数
    const totalSteps = 15; // 总动画步数
    const animationDuration = 800; // 总动画时长(ms)
    const stepTime = animationDuration / totalSteps;
    let currentStep = 0;
    
    // 启动动画定时器
    const animationTimer = setInterval(() => {
      currentStep++;
      
      if (currentStep >= totalSteps) {
        // 动画结束，设置最终数值
        clearInterval(animationTimer);
        setDisplayNumbers(targetNumbers);
        setRandomNumbers(targetNumbers);
        setIsGenerating(false);
      } else {
        // 计算当前动画帧的数值
        const progress = currentStep / totalSteps;
        const animatedNumbers: [number, number, number] = [0, 0, 0].map((_, i) => {
          // 使用easeOutQuart缓动函数计算当前值
          const diff = targetNumbers[i] - randomNumbers[i];
          const currentValue = Math.floor(
            randomNumbers[i] + diff * (1 - Math.pow(1 - progress, 4))
          );
          return currentValue;
        }) as [number, number, number];
        
        // 更新显示数值
        setDisplayNumbers(animatedNumbers);
      }
    }, stepTime);
  };

  return (
    <div className="bg-iosCard p-5 rounded-ios-lg shadow-ios">
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <label htmlFor="number-1" className="block text-sm font-medium text-iosSecondary mb-2">
              天数
            </label>
            <input
              id="number-1"
              type="number"
              min="1"
              max="100"
              value={displayNumbers[0]}
              onChange={(e) => handleNumberChange(0, e.target.value)}
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText focus:ring-2 ${
                theme === 'chinese' ? 'border border-iosSeparator focus:ring-chineseRed' : 'border-none focus:ring-water'
              } ${
                isGenerating ? 'animate-pulse' : ''
              }`}
              disabled={isGenerating}
            />
          </div>
          
          <div>
            <label htmlFor="number-2" className="block text-sm font-medium text-iosSecondary mb-2">
              地数
            </label>
            <input
              id="number-2"
              type="number"
              min="1"
              max="100"
              value={displayNumbers[1]}
              onChange={(e) => handleNumberChange(1, e.target.value)}
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText focus:ring-2 ${
                theme === 'chinese' ? 'border border-iosSeparator focus:ring-chineseRed' : 'border-none focus:ring-water'
              } ${
                isGenerating ? 'animate-pulse' : ''
              }`}
              disabled={isGenerating}
            />
          </div>
          
          <div>
            <label htmlFor="number-3" className="block text-sm font-medium text-iosSecondary mb-2">
              人数
            </label>
            <input
              id="number-3"
              type="number"
              min="1"
              max="100"
              value={displayNumbers[2]}
              onChange={(e) => handleNumberChange(2, e.target.value)}
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText focus:ring-2 ${
                theme === 'chinese' ? 'border border-iosSeparator focus:ring-chineseRed' : 'border-none focus:ring-water'
              } ${
                isGenerating ? 'animate-pulse' : ''
              }`}
              disabled={isGenerating}
            />
          </div>
        </div>
        
        <button
          type="button"
          className={`w-full py-3 rounded-ios font-medium mb-6 text-white ${
            theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
          }`}
          onClick={generateRandomWithAnimation}
          disabled={isGenerating}
          aria-label="随机生成三数"
        >
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            随机生成三数
          </div>
        </button>
      </div>
      
      <div className={`bg-iosBg p-3 rounded-ios mb-5 ${theme === 'chinese' ? 'border border-iosSeparator' : ''}`}>
        <p className="text-sm text-iosText mb-2">
          <span className="font-medium">天数:</span> 与时间相关的数字（如当前小时、分钟）
        </p>
        <p className="text-sm text-iosText mb-2">
          <span className="font-medium">地数:</span> 与空间相关的数字（如当前地点的门牌号）
        </p>
        <p className="text-sm text-iosText">
          <span className="font-medium">人数:</span> 与个人相关的数字（如年龄、幸运数字）
        </p>
      </div>
      
      <button
        type="button"
        className={`w-full py-3 rounded-ios font-medium text-white transition-all hover:bg-opacity-90 active:bg-opacity-70 ${
          theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
        }`}
        onClick={() => generateHexagramFromRandom()}
        disabled={isGenerating}
        aria-label="通过三数生成卦象"
      >
        生成卦象
      </button>
    </div>
  );
};

// 查询输入组件
const QueryInput: React.FC = () => {
  const { query, setQuery } = useAppStore();
  const theme = useAppStore(state => state.settings.theme);
  
  // 根据主题选择合适的图片
  const getImageByTheme = () => {
    if (theme === 'chinese') return zhanwenChineseImage;
    if (theme === 'dark') return zhanwenDarkImage;
    return zhanwenImage;
  };
  
  return (
    <div>
      {/* 占问图片区域 - 简洁效果 */}
      <div className={`flex justify-center mb-3`}>
        <img 
          src={getImageByTheme()}
          alt="占问"
          style={{
            height: "100px",
            width: "auto",
            filter: theme === 'chinese' || theme === 'dark' ? 'none' : 'brightness(0.8) hue-rotate(190deg)'
          }}
        />
      </div>
      
      {/* 占问功能区域 - 单独的卡片 */}
      <div className="bg-iosCard p-5 rounded-ios-lg shadow-ios mb-2">
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="请输入您想占问的事项，例如：今天适合出行吗？"
          className={`w-full bg-iosBg rounded-ios py-3 px-4 text-iosText focus:ring-2 min-h-[90px] resize-none ${
            theme === 'chinese' 
              ? 'border border-iosSeparator focus:ring-chineseRed' 
              : 'border-none focus:ring-water'
          }`}
        ></textarea>
        <p className="text-xs text-iosSecondary mt-2 flex items-center">
          <svg className={`h-3 w-3 mr-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          您的占问将会保存在本地，不会上传到云端
        </p>
      </div>
    </div>
  );
};

// 主输入组件
const HexagramInput: React.FC = () => {
  const inputMode = useAppStore(state => state.inputMode);
  const setInputMode = useAppStore(state => state.setInputMode);
  const theme = useAppStore(state => state.settings.theme);
  
  return (
    <div>
      <QueryInput />
      
      <div className="bg-iosBg p-1.5 rounded-ios flex mb-2">
        <button
          type="button"
          className={`flex-1 py-2.5 text-center rounded-ios ${
            inputMode === 'time'
              ? `bg-iosCard shadow-ios ${theme === 'chinese' ? 'text-chineseRed font-medium' : 'text-water font-medium'}`
              : 'text-iosSecondary'
          }`}
          onClick={() => setInputMode('time')}
          aria-label="切换到正时卦模式"
        >
          正时卦
        </button>
        <button
          type="button"
          className={`flex-1 py-2.5 text-center rounded-ios ${
            inputMode === 'random'
              ? `bg-iosCard shadow-ios ${theme === 'chinese' ? 'text-chineseRed font-medium' : 'text-water font-medium'}`
              : 'text-iosSecondary'
          }`}
          onClick={() => setInputMode('random')}
          aria-label="切换到活时卦模式"
        >
          活时卦
        </button>
      </div>
      
      {inputMode === 'time' ? <TimeHexagramInput /> : <RandomHexagramInput />}
    </div>
  );
};

export default HexagramInput; 