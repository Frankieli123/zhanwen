import React, { useState, useEffect, useRef } from 'react';
{/* @font-tool组件：卦象输入页面 */}
import { useAppStore } from '../../store/useAppStore';
import { InputMode } from '../../types/index';
import { getEarthlyBranchName, getTimeRangeText, getLunarMonthDays, getLunarMonthName } from '../../utils/lunarUtils';
import { getTextScaleClass, mapLevelToPx } from '../../utils/fontUtils';
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
    setQuery
  } = useAppStore();

  const theme = useAppStore(state => state.settings.theme);
  // 获取当前字体大小设置
  const fontSize = useAppStore(state => state.settings.fontSize);

  return (
    <div className="bg-iosCard p-5 rounded-ios-lg shadow-ios space-y-6">
      {/* 立即起卦按钮 */}
      <div>
        <button
          className={`w-full py-3 text-white rounded-ios flex items-center justify-center shadow-ios ${theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'}`}
          onClick={() => {
            generateRealTimeHexagram();
            setQuery(''); // 清空占问输入框
          }}
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
          <span className={`${getTextScaleClass(fontSize)}`}>立即起卦</span>
          {/* @font-tool：立即起卦按钮 */}
        </button>
        {/* @font-tool：使用当前时间提示 - 提示文字 */}
        <div className={`text-iosSecondary text-center mt-1 ${getTextScaleClass(fontSize-5)}`}>
          使用当前时间的农历日期和时辰自动生成卦象
        </div>
      </div>

      {/* 小六壬起卦说明 */}
      <div className={`bg-iosBg p-4 rounded-ios ${theme === 'chinese' ? 'border border-iosSeparator' : ''}`}>
        {/* 标题区 - 中式风格 */}
        <div className="flex items-center justify-center mb-3">
          <span className={`inline-block w-5 h-px ${theme === 'chinese' ? 'bg-chineseRed/60' : 'bg-water/60'}`}></span>
          {/* @font-tool：占问说明标题 - 小标题 */}
          <h3 className={`font-medium mx-2 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'} ${getTextScaleClass(fontSize+1)}`}>
            占问说明
          </h3>
          <span className={`inline-block w-5 h-px ${theme === 'chinese' ? 'bg-chineseRed/60' : 'bg-water/60'}`}></span>
        </div>

        {/* @font-tool：占问说明内容 - 辅助文字 */}
        <p className={`text-iosText mb-4 ${getTextScaleClass(fontSize-2)}`}>
          小六壬是中国传统占卜术之一，以『大安、留连、速喜、赤口、小吉、空亡』六神煞为卦象核心，通过时辰推算吉凶。其特点在于简易迅捷，却能洞察事态趋势，常被用于日常决策参考。
        </p>

        <div className="border-t border-iosSeparator/30 my-3"></div>

        <p className={`font-medium mb-2 ${theme === 'chinese' ? 'text-chineseRed/90' : 'text-water/90'}`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>正时卦
        {/* @font-tool：标签分类正时卦 */}
        </p>
        <ul className={`text-iosText mb-3 ml-4`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>
          <li className="mb-1">• <span className="font-medium">起卦方式：</span>以点击『立即起卦』的当下时辰自动生成卦象</li>
          <li className="mb-1">• <span className="font-medium">核心思想：</span>『天机现于当下』，即时性最强</li>
          <li className="mb-1">• <span className="font-medium">适用场景：</span>临时起意、突发问题、无需预设条件的占问</li>
          {/* @font-tool：分类内容正时卦 */}
        </ul>

        <p className={`font-medium mb-2 ${theme === 'chinese' ? 'text-chineseRed/90' : 'text-water/90'}`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>活时卦
        {/* @font-tool：标签分类活时卦 */}
        </p>
        <ul className={`text-iosText mb-3 ml-4`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>
          <li className="mb-1">• <span className="font-medium">起卦方式：</span>需取随机数或手动输入特定数字（如姓名笔画、事件发生时间等）</li>
          <li className="mb-1">• <span className="font-medium">核心思想：</span>『人择天时』，通过主观介入锁定关联时空</li>
          <li className="mb-1">• <span className="font-medium">适用场景：</span>预谋之事、纪念日测算、针对性强的专项占问</li>
          {/* @font-tool：分类内容活时卦 */}
        </ul>

        <div className={`p-2 rounded-md mb-1 ${theme === 'chinese' ? 'bg-chineseRed/5' : 'bg-water/5'}`}>
          {/* @font-tool：特别提示标题 */}
          <h4 className={`font-medium mb-2 flex items-center ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            特别提示
            {/* @font-tool：特别提示标题 */}
          </h4>
          <ul className={`text-iosText ml-4`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>
            <li className="mb-1">• 同一问题建议每日仅占一次，心诚则灵</li>
            <li className="mb-1">• 复杂问题可结合正时卦（现状）+活时卦（专项）交叉印证</li>
            <li className="mb-1">• 卦象为趋势指引，具体抉择仍需理性判断</li>
            {/* @font-tool：特别提示内容 */}
          </ul>
        </div>
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
    generateHexagramFromTime,
    setQuery
  } = useAppStore();

  const theme = useAppStore(state => state.settings.theme);
  const fontSize = useAppStore(state => state.settings.fontSize);

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
  const years = Array.from({ length: 76 }, (_, i) => currentYear - i);

  // 用于生成农历月份选项
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 用于生成农历日期选项 (根据当前月天数动态生成)
  const days = Array.from({ length: monthDays }, (_, i) => i + 1);

  // 地支时辰
  const hours = [
    { label: '子时 23:00-01:00', value: 0, shortLabel: '子时' },
    { label: '丑时 01:00-03:00', value: 2, shortLabel: '丑时' },
    { label: '寅时 03:00-05:00', value: 4, shortLabel: '寅时' },
    { label: '卯时 05:00-07:00', value: 6, shortLabel: '卯时' },
    { label: '辰时 07:00-09:00', value: 8, shortLabel: '辰时' },
    { label: '巳时 09:00-11:00', value: 10, shortLabel: '巳时' },
    { label: '午时 11:00-13:00', value: 12, shortLabel: '午时' },
    { label: '未时 13:00-15:00', value: 14, shortLabel: '未时' },
    { label: '申时 15:00-17:00', value: 16, shortLabel: '申时' },
    { label: '酉时 17:00-19:00', value: 18, shortLabel: '酉时' },
    { label: '戌时 19:00-21:00', value: 20, shortLabel: '戌时' },
    { label: '亥时 21:00-23:00', value: 22, shortLabel: '亥时' },
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
  const justClearedAnInputRef = useRef(false); // Ref to track if an input was just cleared

  // 当 randomNumbers 变化时更新 displayNumbers
  useEffect(() => {
    // If isGenerating, we let animations handle displayNumbers.
    // Otherwise, sync displayNumbers from randomNumbers, but ONLY IF
    // the randomNumbers value isn't 10 when the display is already 0
    // (this prevents overwriting a manual clear action).
    if (!isGenerating) {
      const newDisplayNumbers = randomNumbers.map((rn, i) => {
        if (rn === 10 && displayNumbers[i] === 0) {
          return 0; // Keep the 0 that was set by handleNumberChange
        }
        return rn; // Otherwise, use the value from randomNumbers
      });
      setDisplayNumbers(newDisplayNumbers as [number, number, number]);
    }
  }, [randomNumbers, isGenerating]); // displayNumbers is intentionally NOT a dependency here

  // 处理数字输入变化
  const handleNumberChange = (index: number, value: string) => {
    // 处理空输入，设置显示为0
    if (value === '') {
      const newDisplay = [...displayNumbers];
      newDisplay[index] = 0;
      setDisplayNumbers(newDisplay as [number, number, number]);

      // 在randomNumbers中设置为10（为计算做准备）
      const newNumbers = [...randomNumbers];
      newNumbers[index] = 10;
      setRandomNumbers(newNumbers as [number, number, number]);
      justClearedAnInputRef.current = true; // Signal that a clear action occurred
      return;
    }

    const newValue = parseInt(value, 10);
    if (isNaN(newValue) || newValue < 0 || newValue > 100) return;

    // 更新显示值
    const newDisplay = [...displayNumbers];
    newDisplay[index] = newValue;
    setDisplayNumbers(newDisplay as [number, number, number]);

    // 更新实际值，如果是0则存为10
    const newNumbers = [...randomNumbers];
    newNumbers[index] = newValue === 0 ? 10 : newValue;
    setRandomNumbers(newNumbers as [number, number, number]);
  };

  // 添加新函数，处理随机数生成动画
  const generateRandomWithAnimation = () => {
    // 设置动画状态
    setIsGenerating(true);

    // 生成最终的目标随机数 (1-100，确保不为0)
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
          // 确保值不为0
          return currentValue > 0 ? currentValue : 1;
        }) as [number, number, number];

        // 更新显示数值
        setDisplayNumbers(animatedNumbers);
      }
    }, stepTime);
  };

  // 根据字体大小决定显示哪种时辰标签
  const getHourLabel = (hourOption: { label: string, shortLabel: string }) => {
    // 当字体大小超过阈值时显示简化版
    const shouldUseShort = fontSize > 10;
    return shouldUseShort ? hourOption.shortLabel : hourOption.label;
  };

  return (
    <div className="bg-iosCard p-5 rounded-ios-lg shadow-ios">
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            {/* @font-tool：天地人数标签 */}
            <label htmlFor="number-1" className={`block font-medium text-iosSecondary mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>天数</label>
            {/* @font-tool：输入框文字 */}
            <input id="number-1" type="text" inputMode="numeric" value={String(displayNumbers[0])} onChange={(e) => handleNumberChange(0, e.target.value)} className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText focus:ring-2 ${
              theme === 'chinese' ? 'border border-iosSeparator focus:ring-chineseRed' : 'border-none focus:ring-water'
            } ${
              isGenerating ? 'animate-pulse' : ''
            }`} style={{ fontSize: `${mapLevelToPx(fontSize)}px` }} disabled={isGenerating} />
          </div>

          <div>
            {/* @font-tool：天地人数标签 */}
            <label htmlFor="number-2" className={`block font-medium text-iosSecondary mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>地数</label>
            {/* @font-tool：输入框文字 */}
            <input
              id="number-2"
              type="text"
              inputMode="numeric"
              value={String(displayNumbers[1])}
              onChange={(e) => handleNumberChange(1, e.target.value)}
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText focus:ring-2 ${
                theme === 'chinese' ? 'border border-iosSeparator focus:ring-chineseRed' : 'border-none focus:ring-water'
              } ${
                isGenerating ? 'animate-pulse' : ''
              }`}
              style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
              disabled={isGenerating}
            />
          </div>

          <div>
            {/* @font-tool：天地人数标签 */}
            <label htmlFor="number-3" className={`block font-medium text-iosSecondary mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>人数</label>
            {/* @font-tool：输入框文字 */}
            <input
              id="number-3"
              type="text"
              inputMode="numeric"
              value={String(displayNumbers[2])}
              onChange={(e) => handleNumberChange(2, e.target.value)}
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText focus:ring-2 ${
                theme === 'chinese' ? 'border border-iosSeparator focus:ring-chineseRed' : 'border-none focus:ring-water'
              } ${
                isGenerating ? 'animate-pulse' : ''
              }`}
              style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* @font-tool：随机生成按钮 */}
        <button
          type="button"
          className={`w-full py-3 rounded-ios font-medium mb-0 text-white ${
            theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
          }`}
          /* @font-tool：随机生成按钮文字 */
          style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
          onClick={generateRandomWithAnimation}
          disabled={isGenerating}
          aria-label="随机生成三数"
        >
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            随机生成三数
            {/* @font-tool：随机生成按钮文字 */}
          </div>
        </button>
      </div>

      <div className={`bg-iosBg p-2 rounded-ios mb-4 ${theme === 'chinese' ? 'border border-iosSeparator' : ''}`}>
        {/* @font-tool：数字说明文字 */}
        <p className={`text-iosText mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>
          <span className="font-medium">天数:</span> 与时间相关的数字
        </p>
        {/* @font-tool：数字说明文字 */}
        <p className={`text-iosText mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>
          <span className="font-medium">地数:</span> 与空间相关的数字
        </p>
        {/* @font-tool：数字说明文字 */}
        <p className={`text-iosText mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}>
          <span className="font-medium">人数:</span> 与个人相关的数字
        </p>
      </div>

      {/* @font-tool：生成卦象按钮 */}
      <button
        type="button"
        className={`w-full py-3 rounded-ios font-medium text-white transition-all hover:bg-opacity-90 active:bg-opacity-70 ${
          theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
        }`}
        /* @font-tool：生成卦象按钮文字 */
        style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
        onClick={() => {
          generateHexagramFromRandom();
          setQuery('');
        }}
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
          {/* @font-tool：或按选择时间起卦 */}
          <span className={`bg-iosCard px-4 text-iosSecondary`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>
            或按选择时间起卦
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          {/* @font-tool：农历年月日时标签 */}
          <label htmlFor="lunarYear" className={`block font-medium text-iosSecondary mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>农历年</label>
          {/* 农历年份自定义下拉框 */}
          <div className="relative" ref={yearDropdownRef}>
            {/* @font-tool：下拉选择器文字 */}
            <div
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText cursor-pointer ${
                theme === 'chinese'
                  ? 'border border-iosSeparator hover:border-chineseRed/70'
                  : 'border-none hover:bg-opacity-90'
              } transition-colors duration-200`}
              style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            >
              {lunarYear}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className={`h-4 w-4 ${theme === 'chinese' ? 'text-chineseRed/70' : 'text-water/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {yearDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-20 rounded-ios shadow-ios ${
                theme === 'dark'
                  ? 'bg-gray-800 border border-gray-700'
                  : theme === 'chinese'
                    ? 'bg-iosCard/95 border border-chineseRed/10'
                    : 'bg-iosCard/95 border border-water/10'
              }`}>
                <div className="p-1">
                  {years.map((year) => (
                    <div
                      key={year}
                      className={`px-3 py-2 rounded-md cursor-pointer ${
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
                      style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}
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
          {/* @font-tool：农历年月日时标签 */}
          <label htmlFor="lunarMonth" className={`block font-medium text-iosSecondary mb-2`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>农历月</label>
          {/* 农历月份自定义下拉框 */}
          <div className="relative" ref={monthDropdownRef}>
            {/* @font-tool：下拉选择器文字 */}
            <div
              className={`w-full bg-iosBg rounded-ios py-2.5 px-3 text-iosText cursor-pointer ${
                theme === 'chinese'
                  ? 'border border-iosSeparator hover:border-chineseRed/70'
                  : 'border-none hover:bg-opacity-90'
              } transition-colors duration-200`}
              style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            >
              {getLunarMonthName(lunarMonth)}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className={`h-4 w-4 ${theme === 'chinese' ? 'text-chineseRed/70' : 'text-water/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {monthDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-20 rounded-ios shadow-ios ${
                theme === 'dark'
                  ? 'bg-gray-800 border border-gray-700'
                  : theme === 'chinese'
                    ? 'bg-iosCard/95 border border-chineseRed/10'
                    : 'bg-iosCard/95 border border-water/10'
              }`}>
                <div className="p-1">
                  {months.map((month) => (
                    <div
                      key={month}
                      className={`px-3 py-2 rounded-md cursor-pointer ${
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
                      style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}
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
          {/* @font-tool：农历日标签 */}
          <label className={`block font-medium text-iosSecondary`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>农历日</label>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <React.Fragment key={day}>
              {/* @font-tool：日期选择按钮 */}
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
                /* @font-tool：日期选择按钮文字 */
                style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}
              onClick={() => setLunarDay(day)}
            >
              {day}
            </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2">
          {/* @font-tool：农历时辰标签 */}
          <label className={`block font-medium text-iosSecondary`} style={{ fontSize: `${mapLevelToPx(fontSize-1)}px` }}>农历时辰</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {hours.map((hourOption) => (
            <React.Fragment key={hourOption.value}>
              {/* @font-tool：时辰选择按钮 */}
            <button
              key={hourOption.value}
              type="button"
                className={`py-2 px-4 rounded-ios text-center whitespace-nowrap ${
                hour === hourOption.value
                  ? theme === 'chinese'
                    ? 'bg-chineseRed text-white font-medium'
                    : 'bg-water text-white font-medium'
                  : 'bg-iosBg text-iosText hover:bg-opacity-80'
              }`}
                /* @font-tool：时辰选择按钮文字 */
                style={{ fontSize: `${mapLevelToPx(fontSize-2)}px` }}
              onClick={() => setHour(hourOption.value)}
            >
                {getHourLabel(hourOption)}
            </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {/* @font-tool：按选择时间起卦按钮 */}
        <button
          type="button"
          className={`w-full py-3 rounded-ios font-medium text-white ${
            theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'
          }`}
          /* @font-tool：按选择时间起卦按钮文字 */
          style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
          onClick={() => {
            generateHexagramFromTime();
            setQuery('');
          }}
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
  const fontSize = useAppStore(state => state.settings.fontSize);

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
        {/* @font-tool：占问图片 */}
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
        {/* @font-tool：占问输入框 */}
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
          style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
        ></textarea>
        {/* @font-tool：占问提示文字 */}
        <p className={`text-iosSecondary mt-2 flex items-center`} style={{ fontSize: `${mapLevelToPx(fontSize-5)}px` }}>
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
  const fontSize = useAppStore(state => state.settings.fontSize);

  return (
    <div>
      <QueryInput />

      <div className="bg-iosBg p-1.5 rounded-ios flex mb-2">
        {/* @font-tool：正时卦/活时卦按钮 */}
        <button
          type="button"
          className={`flex-1 py-2.5 text-center rounded-ios ${
            inputMode === 'time'
              ? `bg-iosCard shadow-ios ${theme === 'chinese' ? 'text-chineseRed font-medium' : 'text-water font-medium'}`
              : 'text-iosSecondary'
          }`}
          /* @font-tool：正时卦按钮文字 */
          style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
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
          /* @font-tool：活时卦按钮文字 */
          style={{ fontSize: `${mapLevelToPx(fontSize)}px` }}
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