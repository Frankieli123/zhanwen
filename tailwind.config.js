 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // 预先声明可能的动态文本大小类，范围从8px到48px
    // 8px: 最小可读字体大小
    // 48px: 大标题的合理上限 (与fontUtils.ts中的mapLevelToPx函数保持一致)
    ...Array.from({ length: 41 }, (_, i) => `text-[${i + 8}px]`),
  ],
  darkMode: 'class', // 启用基于类的暗黑模式
  theme: {
    extend: {
      colors: {
        // iOS风格的五行色系
        wood: '#34C759',  // 苹果系统绿色
        fire: '#FF3B30',  // 苹果系统红色
        earth: '#FFCC00', // 苹果系统黄色
        metal: '#F2F2F7', // iOS浅灰背景色
        water: '#007AFF', // 苹果系统蓝色

        // 中国风主题色系 - 添加
        chineseRed: '#8C1F28',  // 褐红色（主色）
        chineseGold: '#D4AF37',  // 金色
        chineseBeige: '#F5E1A4',  // 米色/羊皮纸色
        chineseBrown: '#6B4423',  // 褐色
        chineseBlack: '#292421',   // 墨色

        // iOS系统色
        iosBg: {
          DEFAULT: '#F2F2F7', // 默认iOS背景色
          dark: '#000000',    // 暗黑模式iOS背景色
          chinese: '#FAF6EB', // 中国风背景色 - 添加
        },
        iosCard: {
          DEFAULT: '#FFFFFF', // 默认卡片背景
          dark: '#1C1C1E',    // 暗黑模式卡片背景
          chinese: '#FFF9E9', // 中国风卡片背景 - 添加
        },
        iosText: {
          DEFAULT: '#000000', // 默认主文本色
          dark: '#FFFFFF',    // 暗黑模式主文本色
          chinese: '#4A2B20', // 中国风主文本色 - 添加
        },
        iosSecondary: {
          DEFAULT: '#8E8E93', // 默认次要文本色
          dark: '#98989F',    // 暗黑模式次要文本色
          chinese: '#8C5F4A', // 中国风次要文本色 - 添加
        },
        iosSeparator: {
          DEFAULT: '#C6C6C8', // 默认分隔线
          dark: '#38383A',    // 暗黑模式分隔线
          chinese: '#D2B48C', // 中国风分隔线 - 添加
        },
        iosGroupedBg: {
          DEFAULT: '#EFEFF4', // 默认分组背景
          dark: '#1C1C1E',    // 暗黑模式分组背景
          chinese: '#F5E8D0', // 中国风分组背景 - 添加
        },
        iosSuccess: '#34C759',  // 成功色
        iosWarning: '#FF9500',  // 警告色
        iosDanger: '#FF3B30',   // 危险色
      },
      fontFamily: {
        'serif': ['"Noto Serif SC"', 'serif'],
        'sans': ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'ios': '10px',    // iOS风格圆角
        'ios-lg': '16px', // iOS大圆角
        'ios-xl': '22px', // iOS超大圆角
      },
      boxShadow: {
        'ios': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'ios-md': '0 4px 14px rgba(0, 0, 0, 0.08)',
        'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'inner-md': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}