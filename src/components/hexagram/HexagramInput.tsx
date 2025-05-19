import React, { useState, useEffect, useRef } from 'react';
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
        <h3 className={`text-base font-medium mb-2 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>占问说明</h3>
        <p className="text-sm text-iosText mb-3">
          小六壬是中国传统占卜术之一，以"大安、留连、速喜、赤口、小吉、空亡"六神煞为卦象核心，通过时辰推算吉凶。其特点在于简易迅捷，却能洞察事态趋势，常被用于日常决策参考。
        </p>
        

        
        <p className={`text-sm font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed/90' : 'text-water/90'}`}>正时卦</p>
        <ul className="text-sm text-iosText mb-3 ml-4">
          <li className="mb-1">• 起卦方式：以点击"立即起卦"的当下时辰自动生成卦象</li>
          <li className="mb-1">• 核心思想："天机现于当下"，即时性最强</li>
          <li className="mb-1">• 适用场景：临时起意、突发问题、无需预设条件的占问</li>
        </ul>
        
        <p className={`text-sm font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed/90' : 'text-water/90'}`}>活时卦</p>
        <ul className="text-sm text-iosText mb-3 ml-4">
          <li className="mb-1">• 起卦方式：需取随机数或手动输入特定数字（如姓名笔画、事件发生时间等）</li>
          <li className="mb-1">• 核心思想："人择天时"，通过主观介入锁定关联时空</li>
          <li className="mb-1">• 适用场景：预谋之事、纪念日测算、针对性强的专项占问</li>
        </ul>
        
        <h4 className={`text-sm font-medium mb-1 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>特别提示</h4>
        <ul className="text-sm text-iosText mb-0 ml-4">
          <li className="mb-1">• 同一问题建议每日仅占一次，心诚则灵</li>
          <li className="mb-1">• 复杂问题可结合正时卦（现状）+活时卦（专项）交叉印证</li>
          <li className="mb-1">• 卦象为趋势指引，具体抉择仍需理性判断</li>
        </ul>
      </div>
    </div>
  );
};

// 活时卦输入组件
const RandomHexagramInput: React.FC = () => {
  const date = new Date();
  const {
    randomNumbers,
    setRandomNumbers,
    generateNewRandomNumbers,
    generateHexagramFromRandom,
    lunarYear,
    lunarMonth,
    lunarDay,
    hour,
    setLunarYear,
    setLunarMonth,
    setLunarDay,
    setHour,
    generateHexagramFromTime
  } = useAppStore();
  
  const theme = useAppStore(state => state.settings.theme);
  
  // 追踪当前选中农历月的天数
  const [monthDays, setMonthDays] = useState<number>(30);
  
  // 当农历年或月变化时，更新该月的天数
  useEffect(() => {
    try {
      const days = getLunarMonthDays(lunarYear, lunarMonth);
      setMonthDays(days);
      
      // 如果当前选择的日大于该月的天数，则调整为该月最后一天
      if (lunarDay > days) {
        setLunarDay(days);
      }
    } catch (error) {
      console.error('Error calculating lunar month days:', error);
      // 发生错误时保持默认30天
      setMonthDays(30);
    }
  }, [lunarYear, lunarMonth, lunarDay, setLunarDay]);
  
  // 用于生成农历年份选项
  const currentYear = date.getFullYear();
  const years = Array.from({ length: 150 }, (_, i) => currentYear - 75 + i);

  // 用于生成农历月份选项
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 用于生成农历日期选项 (根据当前月天数动态生成)
  const days = Array.from({ length: monthDays }, (_, i) => i + 1);

  // 地支时辰
  const hours = [
    { label: '子时 (23:00-01:00)', value: 0 },
    { label: '丑时 (01:00-03:00)', value: 2 },
    { label: '寅时 (03:00-05:00)', value: 4 },
    { label: '卯时 (05:00-07:00)', value: 6 },
    { label: '辰时 (07:00-09:00)', value: 8 },
    { label: '巳时 (09:00-11:00)', value: 10 },
    { label: '午时 (11:00-13:00)', value: 12 },
    { label: '未时 (13:00-15:00)', value: 14 },
    { label: '申时 (15:00-17:00)', value: 16 },
    { label: '酉时 (17:00-19:00)', value: 18 },
    { label: '戌时 (19:00-21:00)', value: 20 },
    { label: '亥时 (21:00-23:00)', value: 22 },
  ];
  
  // 下拉列表状态
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  
  // 下拉列表引用，用于点击外部关闭
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  
  // 处理点击外部关闭下拉列表
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setMonthDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 添加动画状态
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
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
      
      {/* 分隔线 */}
      <div className="relative py-3 mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-iosSeparator"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-iosCard px-4 text-sm text-iosSecondary">或按选择时间起卦</span>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="lunarYear" className="block text-sm font-medium text-iosSecondary mb-2">
            农历年
          </label>
          {/* 农历年份自定义下拉框 */}
          <div className="relative" ref={yearDropdownRef}>
            <div
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText cursor-pointer ${
                theme === 'chinese' 
                  ? 'border border-iosSeparator hover:border-chineseRed/70' 
                  : 'border-none hover:bg-opacity-90'
              } transition-colors duration-200`}
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            >
              {lunarYear}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className={`h-4 w-4 ${theme === 'chinese' ? 'text-chineseRed/70' : 'text-water/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* 下拉列表内容 */}
            {yearDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-20 rounded-ios shadow-ios ${
                theme === 'dark' 
                  ? 'bg-iosBgDark border border-gray-700' 
                  : theme === 'chinese'
                    ? 'bg-iosCard/95 border border-chineseRed/10'
                    : 'bg-iosCard/95 border border-water/10'
              }`}>
                <div className="p-1">
                  {years.map((year) => (
                    <div
                      key={year}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                        lunarYear === year
                          ? theme === 'chinese'
                            ? 'bg-chineseRed/10 text-chineseRed font-medium'
                            : 'bg-water/10 text-water font-medium'
                          : theme === 'chinese'
                            ? 'hover:bg-chineseRed/5 text-iosText'
                            : theme === 'dark'
                              ? 'hover:bg-gray-700/60 text-iosText'
                              : 'hover:bg-water/5 text-iosText'
                      }`}
                      onClick={() => {
                        setLunarYear(year);
                        setYearDropdownOpen(false);
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="lunarMonth" className="block text-sm font-medium text-iosSecondary mb-2">
            农历月
          </label>
          {/* 农历月份自定义下拉框 */}
          <div className="relative" ref={monthDropdownRef}>
            <div
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText cursor-pointer ${
                theme === 'chinese' 
                  ? 'border border-iosSeparator hover:border-chineseRed/70' 
                  : 'border-none hover:bg-opacity-90'
              } transition-colors duration-200`}
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            >
              {getLunarMonthName(lunarMonth)}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className={`h-4 w-4 ${theme === 'chinese' ? 'text-chineseRed/70' : 'text-water/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* 下拉列表内容 */}
            {monthDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-20 rounded-ios shadow-ios ${
                theme === 'dark' 
                  ? 'bg-iosBgDark border border-gray-700' 
                  : theme === 'chinese'
                    ? 'bg-iosCard/95 border border-chineseRed/10'
                    : 'bg-iosCard/95 border border-water/10'
              }`}>
                <div className="p-1">
                  {months.map((month) => (
                    <div
                      key={month}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                        lunarMonth === month
                          ? theme === 'chinese'
                            ? 'bg-chineseRed/10 text-chineseRed font-medium'
                            : 'bg-water/10 text-water font-medium'
                          : theme === 'chinese'
                            ? 'hover:bg-chineseRed/5 text-iosText'
                            : theme === 'dark'
                              ? 'hover:bg-gray-700/60 text-iosText'
                              : 'hover:bg-water/5 text-iosText'
                      }`}
                      onClick={() => {
                        setLunarMonth(month);
                        setMonthDropdownOpen(false);
                      }}
                    >
                      {getLunarMonthName(month)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-iosSecondary">
            农历日
          </label>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              className={`py-2 rounded-ios text-center ${
                lunarDay === day
                  ? theme === 'chinese' 
                    ? 'bg-chineseRed text-white font-medium'
                    : 'bg-water text-white font-medium'
                  : 'bg-iosBg text-iosText hover:bg-opacity-80'
              }`}
              onClick={() => setLunarDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-iosSecondary">
            农历时辰
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {hours.map((hourOption) => (
            <button
              key={hourOption.value}
              type="button"
              className={`py-2 px-3 rounded-ios text-sm ${
                hour === hourOption.value
                  ? theme === 'chinese' 
                    ? 'bg-chineseRed text-white font-medium'
                    : 'bg-water text-white font-medium'
                  : 'bg-iosBg text-iosText hover:bg-opacity-80'
              }`}
              onClick={() => setHour(hourOption.value)}
            >
              {hourOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className={`w-full py-3 rounded-ios font-medium text-white ${
            theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
          }`}
          onClick={() => generateHexagramFromTime()}
        >
          按选择时间起卦
        </button>
      </div>
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