import { Lunar, Solar } from 'lunar-javascript';

/**
 * 获取当前时间的农历日期和时辰
 * @returns 农历年、月、日、时辰（0-11）
 */
export const getCurrentLunarDate = (): {
  year: number;
  month: number;
  day: number;
  hour: number;
} => {
  // 获取当前公历日期
  const now = new Date();
  
  // 转换为农历
  const solar = Solar.fromDate(now);
  const lunar = solar.getLunar();
  
  // 获取农历年、月、日
  const year = lunar.getYear();
  const month = lunar.getMonth();
  const day = lunar.getDay();
  
  // 计算当前时辰（0-11，对应子时到亥时）
  const currentHour = now.getHours();
  const hourIndex = Math.floor((currentHour + 1) % 24 / 2);
  
  return {
    year,
    month,
    day,
    hour: hourIndex
  };
};

/**
 * 获取时辰名称（子、丑、寅等）
 * @param hour 时辰索引（0-11）
 * @returns 时辰名称
 */
export const getEarthlyBranchName = (hour: number): string => {
  const names = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return names[hour % 12];
};

/**
 * 获取时辰的时间范围文本
 * @param hour 时辰索引（0-11）
 * @returns 时间范围文本，如"23:00-01:00"
 */
export const getTimeRangeText = (hour: number): string => {
  const timeRanges = [
    '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00', 
    '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00', 
    '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
  ];
  return timeRanges[hour % 12];
}; 

/**
 * 获取指定农历年月的天数
 * @param year 农历年
 * @param month 农历月
 * @returns 该农历月的天数（29或30）
 */
export const getLunarMonthDays = (year: number, month: number): number => {
  try {
    // 创建农历对象
    const lunar = Lunar.fromYmd(year, month, 1);
    // 获取该月的天数
    return lunar.getMonthDays();
  } catch (error) {
    console.error('Error getting lunar month days:', error);
    // 默认返回30天（大月）作为fallback
    return 30;
  }
}; 

/**
 * 获取农历月份的中文名称
 * @param month 农历月份数字(1-12)
 * @param isLeap 是否是闰月
 * @returns 农历月份的中文名称（如"正月"、"二月"等）
 */
export const getLunarMonthName = (month: number, isLeap: boolean = false): string => {
  const monthNames = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const prefix = isLeap ? '闰' : '';
  
  if (month >= 1 && month <= 12) {
    return `${prefix}${monthNames[month]}月`;
  }
  
  return `${month}月`;
}; 