import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DivinationResult, HexagramInfo, InputMode, AppSettings, ThemeMode, FiveElement } from '../types';
import { generateRandomNumbers, calculateHexagramFromNumbers, calculateHexagramFromTime, createDivinationResult, calculateThreePalaces, calculateThreePalacesFromNumbers } from '../utils/hexagramUtils';
import { getCurrentLunarDate } from '../utils/lunarUtils';
import { db } from '../utils/db';

// 导航来源类型
export type NavigationSource = 'divination' | 'history' | 'settings' | 'result' | null;

interface AppState {
  // 基本状态
  isLoading: boolean;
  error: string | null;
  
  // 输入模式状态
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  
  // 正时卦输入
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  hour: number;
  setLunarDay: (day: number) => void;
  setLunarMonth: (month: number) => void;
  setLunarYear: (year: number) => void;
  setHour: (hour: number) => void;
  
  // 活时卦输入
  randomNumbers: [number, number, number];
  setRandomNumbers: (numbers: [number, number, number]) => void;
  generateNewRandomNumbers: () => void;
  
  // 当前卦象结果
  currentResult: DivinationResult | null;
  updateCurrentResult: (result: DivinationResult) => void;
  
  // 当前查看的卦象详情
  currentDetailHexagram: HexagramInfo | null;
  
  // 查询相关
  query: string;
  setQuery: (query: string) => void;
  
  // 卦象生成操作
  generateHexagramFromTime: () => Promise<DivinationResult>;
  generateHexagramFromRandom: () => Promise<DivinationResult>;
  generateRealTimeHexagram: () => Promise<DivinationResult>;
  
  // 历史记录操作
  divinationHistory: DivinationResult[];
  loadDivinationHistory: () => Promise<void>;
  clearDivinationHistory: () => Promise<void>;
  
  // 应用设置
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // 导航功能
  navigateToResult: () => void;
  navigateToHexagramDetail: (hexagram: HexagramInfo) => void;
  
  // 导航来源跟踪
  navigationSource: NavigationSource;
  setNavigationSource: (source: NavigationSource) => void;
  navigateBack: () => void;
}

// 默认设置
const defaultSettings: AppSettings = {
  language: 'zh-CN', // 默认语言为中文
  theme: 'chinese', // 默认使用中国风主题
  vibration: true, // 默认开启振动
  liuLianElement: 'earth', // 留连默认为土
  xiaoJiElement: 'water', // 小吉默认为水
  useColorSymbols: false, // 默认不使用色盲友好的符号
  // 简化的字体设置
  fontFamily: 'noto', // 默认使用思源宋体
  fontSize: 3, // 默认为中等大小 (3/5)
};

// 默认随机数
const defaultRandomNumbers: [number, number, number] = [50, 50, 50];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isLoading: false,
      error: null,
      
      // 输入模式
      inputMode: 'time', // 默认为正时卦
      setInputMode: (mode) => set({ inputMode: mode }),
      
      // 正时卦输入
      lunarDay: 1,
      lunarMonth: 1,
      lunarYear: new Date().getFullYear(),
      hour: 0, // 子时
      setLunarDay: (day) => set({ lunarDay: day }),
      setLunarMonth: (month) => set({ lunarMonth: month }),
      setLunarYear: (year) => set({ lunarYear: year }),
      setHour: (hour) => set({ hour }),
      
      // 活时卦输入
      randomNumbers: defaultRandomNumbers,
      setRandomNumbers: (numbers) => set({ randomNumbers: numbers }),
      generateNewRandomNumbers: () => set({ randomNumbers: generateRandomNumbers() }),
      
      // 当前卦象结果
      currentResult: null,
      updateCurrentResult: (result) => {
        set({ currentResult: result });
        
        // 如果result有aiReading字段，则无需在此处更新数据库
        // 因为AIReadingResult组件已经处理了更新数据库的操作
      },
      
      // 当前查看的卦象详情
      currentDetailHexagram: null,
      
      // 查询
      query: '',
      setQuery: (query) => set({ query }),
      
      // 导航功能 - 默认空函数，会在App组件中设置
      navigateToResult: () => {},
      navigateToHexagramDetail: () => {},
      
      // 导航来源跟踪
      navigationSource: null,
      setNavigationSource: (source) => set({ navigationSource: source }),
      navigateBack: () => {
        const source = get().navigationSource;
        if (source === 'history') {
          // 如果来源是历史记录，导航回历史记录页面
          window.dispatchEvent(new CustomEvent('navigateToHistory'));
        } else if (source === 'divination') {
          // 如果来源是卜卦页面，导航回卜卦页面
          window.dispatchEvent(new CustomEvent('navigateToDivination'));
        } else if (source === 'result') {
          // 如果来源是结果页面，导航回结果页面
          window.dispatchEvent(new CustomEvent('navigateToResult'));
        } else {
          // 默认返回结果页面
          window.dispatchEvent(new CustomEvent('navigateToResult'));
        }
      },
      
      // 卦象生成
      generateHexagramFromTime: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { lunarDay, lunarMonth, hour, query } = get();
          
          // 计算三宫卦象
          const threePalaces = calculateThreePalaces(lunarMonth, lunarDay, hour);
          
          // 向后兼容 - 以人宫卦作为主卦
          const mainHexagram = threePalaces.humanPalace.hexagram;
          
          // 创建结果对象
          const result = createDivinationResult(mainHexagram, {
            isTimeHexagram: true,
            timeInfo: {
              lunarDate: `${get().lunarYear}年${lunarMonth}月${lunarDay}日`,
              hour,
              lunarMonth
            },
            query,
            threePalaces // 添加三宫卦信息
          });
          
          // 保存到数据库
          await db.addDivinationResult(result);
          
          // 更新状态
          set({ currentResult: result, isLoading: false });
          
          // 刷新历史记录
          get().loadDivinationHistory();
          
          // 导航到结果页面
          get().navigateToResult();
          
          return result;
        } catch (error) {
          console.error('Error generating time hexagram:', error);
          set({ 
            error: '生成正时卦失败，请稍后再试',
            isLoading: false
          });
          throw error;
        }
      },
      
      // 新增实时起卦函数
      generateRealTimeHexagram: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // 获取当前查询文本
          const { query } = get();
          
          // 获取当前农历日期和时辰
          const { year, month, day, hour } = getCurrentLunarDate();
          
          // 更新状态中的日期和时辰
          set({ 
            lunarYear: year,
            lunarMonth: month,
            lunarDay: day,
            hour
          });
          
          // 计算三宫卦象
          const threePalaces = calculateThreePalaces(month, day, hour);
          
          // 向后兼容 - 以人宫卦作为主卦
          const mainHexagram = threePalaces.humanPalace.hexagram;
          
          // 创建结果对象
          const result = createDivinationResult(mainHexagram, {
            isTimeHexagram: true,
            timeInfo: {
              lunarDate: `${year}年${month}月${day}日`,
              hour,
              lunarMonth: month
            },
            query,
            threePalaces // 添加三宫卦信息
          });
          
          // 保存到数据库
          await db.addDivinationResult(result);
          
          // 更新状态
          set({ currentResult: result, isLoading: false });
          
          // 刷新历史记录
          get().loadDivinationHistory();
          
          // 导航到结果页面
          get().navigateToResult();
          
          return result;
        } catch (error) {
          console.error('Error generating real-time hexagram:', error);
          set({ 
            error: '生成实时卦失败，请稍后再试',
            isLoading: false
          });
          throw error;
        }
      },
      
      generateHexagramFromRandom: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { randomNumbers, query } = get();
          
          // 计算三宫卦象
          const threePalaces = calculateThreePalacesFromNumbers(
            randomNumbers[0], 
            randomNumbers[1], 
            randomNumbers[2]
          );
          
          // 以人宫卦作为主卦（与正时卦保持一致）
          const mainHexagram = threePalaces.humanPalace.hexagram;
          
          // 创建结果对象
          const result = createDivinationResult(mainHexagram, {
            isTimeHexagram: false,
            randomNumbers,
            query,
            threePalaces // 添加三宫卦信息
          });
          
          // 保存到数据库
          await db.addDivinationResult(result);
          
          // 更新状态
          set({ currentResult: result, isLoading: false });
          
          // 刷新历史记录
          get().loadDivinationHistory();
          
          // 导航到结果页面
          get().navigateToResult();
          
          return result;
        } catch (error) {
          console.error('Error generating random hexagram:', error);
          set({ 
            error: '生成活时卦失败，请稍后再试',
            isLoading: false
          });
          throw error;
        }
      },
      
      // 历史记录
      divinationHistory: [],
      loadDivinationHistory: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const results = await db.getAllDivinationResults();
          // 按时间戳排序（最新的在前）
          const sortedResults = results.sort((a, b) => b.timestamp - a.timestamp);
          set({ divinationHistory: sortedResults, isLoading: false });
        } catch (error) {
          console.error('Error loading divination history:', error);
          set({ 
            error: '加载历史记录失败，请稍后再试',
            isLoading: false
          });
        }
      },
      
      clearDivinationHistory: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await db.clearAllDivinationResults();
          set({ divinationHistory: [], isLoading: false });
        } catch (error) {
          console.error('Error clearing divination history:', error);
          set({ 
            error: '清空历史记录失败，请稍后再试',
            isLoading: false
          });
        }
      },
      
      // 设置
      settings: defaultSettings,
      updateSettings: (settings) => set({ 
        settings: { ...get().settings, ...settings }
      }),
    }),
    {
      name: 'divination-app-storage', // localStorage key
      partialize: (state) => ({
        // 只持久化这些字段
        settings: state.settings,
        inputMode: state.inputMode,
        lunarDay: state.lunarDay,
        lunarMonth: state.lunarMonth,
        lunarYear: state.lunarYear,
        hour: state.hour,
        randomNumbers: state.randomNumbers,
      }),
    }
  )
);

// 提供一个设置导航函数的方法
export const setNavigateToResult = (navigateFunction: () => void) => {
  useAppStore.setState({ navigateToResult: navigateFunction });
};

// 提供一个设置导航到卦象详情页的方法
export const setNavigateToHexagramDetail = (navigateFunction: (hexagram: HexagramInfo) => void) => {
  useAppStore.setState({ navigateToHexagramDetail: navigateFunction });
}; 