# 占问 - 六壬金口诀智能占卜应用

<div align="center">

![占问Logo](divination-app/public/logo512.png)

**传统六壬金口诀 × 现代AI技术**

一款融合古典易学智慧与现代科技的智能占卜应用

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-blue.svg)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-5.0-blue.svg)](https://capacitorjs.com/)

</div>

## 📱 应用特色

### 🎯 核心功能
- **六壬金口诀占卜**: 传统三宫卦象起卦方法
- **时间起卦**: 支持农历时间自动起卦
- **手动起卦**: 灵活的手动选择起卦方式
- **AI智能解读**: 结合传统理论的智能分析
- **历史记录**: 完整的占卜历史管理

### 🎨 界面设计
- **双主题支持**: 中国风古典主题 + iOS现代主题
- **响应式字体**: 5档字体大小自由调节
- **优雅动画**: 流畅的页面切换和交互效果
- **移动优先**: 专为移动设备优化的用户体验

### 🔮 占卜系统
- **三宫卦象**: 天宫、地宫、人宫完整显示
- **五行分析**: 详细的五行生克制化分析
- **卦象流转**: 动态展示卦象变化路径
- **综合解读**: 多维度的卦象解释

## 🛠️ 技术架构

### 前端技术栈
- **React 18**: 现代化的前端框架
- **TypeScript**: 类型安全的开发体验
- **Tailwind CSS**: 原子化CSS框架
- **Zustand**: 轻量级状态管理
- **React Router**: 单页应用路由
- **Framer Motion**: 动画效果库

### 移动端技术
- **Capacitor**: 跨平台混合应用框架
- **Android Studio**: Android原生开发环境
- **PWA**: 渐进式Web应用支持

### 开发工具
- **Create React App**: 快速构建工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Git**: 版本控制

## 📦 项目结构

```
zhanwen/
├── divination-app/          # React主应用
│   ├── src/                 # 源代码
│   │   ├── components/      # React组件
│   │   │   ├── hexagram/    # 卦象相关组件
│   │   │   ├── settings/    # 设置相关组件
│   │   │   └── debug/       # 调试工具组件
│   │   ├── data/           # 数据文件
│   │   │   ├── hexagramData.ts      # 卦象基础数据
│   │   │   └── hexagramDetailData.ts # 卦象详细数据
│   │   ├── services/       # 服务层
│   │   │   └── apiService.ts        # API服务
│   │   ├── store/          # 状态管理
│   │   │   └── useAppStore.ts       # 全局状态
│   │   ├── utils/          # 工具函数
│   │   │   ├── fontUtils.ts         # 字体工具
│   │   │   └── hexagramUtils.ts     # 卦象工具
│   │   └── types/          # TypeScript类型
│   │       └── index.ts             # 类型定义
│   ├── public/             # 静态资源
│   │   ├── icons/          # 应用图标
│   │   └── manifest.json   # PWA配置
│   ├── android/            # Android配置
│   │   ├── app/           # Android应用配置
│   │   └── build.gradle   # 构建配置
│   └── build/              # 构建输出
├── android/                # Android原生项目
├── scripts/                # 构建脚本
│   ├── build-apk.js       # APK构建脚本
│   └── build-config.js    # 构建配置
├── output/                 # APK输出目录
├── temp_icons/            # 临时图标文件
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn
- Android Studio (用于移动端开发)

### 安装依赖
```bash
# 克隆项目
git clone https://github.com/Frankieli123/zhanwen.git
cd zhanwen

# 安装根项目依赖
npm install

# 安装React应用依赖
cd divination-app
npm install
```

### 开发运行
```bash
# 启动开发服务器
cd divination-app
npm start

# 或使用快捷脚本
./start.bat  # Windows
./start.sh   # Linux/Mac

# 端口5009启动（用于特殊调试）
./start-5009.bat
```

### 构建部署
```bash
# 构建Web应用
cd divination-app
npm run build

# 构建Android APK
npm run build:android
```

## 📱 移动端开发

### Android开发
```bash
# 同步到Android项目
cd divination-app
npx cap sync android

# 在Android Studio中打开
npx cap open android

# 构建APK
npm run build:apk
```

### 调试工具
```bash
# 设备调试
./debug-on-device.bat

# 实时重载测试
./start-5009.bat
```

## 🎯 核心组件

### 占卜系统
- **HexagramInput**: 起卦输入组件
- **HexagramResult**: 卦象结果显示
- **ElementAnalysisPanel**: 五行分析面板
- **AIReadingResult**: AI智能解读
- **HexagramDetailPage**: 卦象详情页面

### 界面组件
- **Layout**: 主布局组件
- **Settings**: 设置面板
- **FontSettings**: 字体设置
- **SwipeContainer**: 滑动容器
- **HistoryList**: 历史记录列表

### 数据管理
- **hexagramData**: 卦象基础数据
- **hexagramDetailData**: 卦象详细数据
- **useAppStore**: 全局状态管理
- **apiService**: API服务层

## 🎨 主题系统

### 中国风主题
- 古典红色调色板 (`#DC2626`, `#B91C1C`)
- 传统文化元素
- 优雅的渐变效果
- 符合易学美学

### iOS主题
- 现代蓝色调色板 (`#3B82F6`, `#1D4ED8`)
- 简洁的设计语言
- 流畅的交互体验
- 符合iOS设计规范

### 字体系统
- **5档字体大小**: 超小(14px) → 超大(22px)
- **线性映射**: 直观的像素值对应
- **响应式设计**: 自动适配不同屏幕
- **无障碍支持**: 满足视觉辅助需求

## 📝 开发日志

### 最新更新 (2025-01-22)
- ✅ 删除截图分享功能，简化界面
- ✅ 优化卦象结果页面布局
- ✅ 完善字体系统和响应式设计
- ✅ 修复主题切换相关问题
- ✅ 提升整体用户体验
- ✅ 添加字体调试工具

### 历史版本
- **v1.4.0**: 移动端适配完善，删除截图功能
- **v1.3.0**: 字体系统优化，5档字体大小
- **v1.2.0**: 双主题系统上线
- **v1.1.0**: 添加AI智能解读
- **v1.0.0**: 基础占卜功能实现

## 🔧 开发工具

### 调试页面
- **字体测试页面**: `/public/font-test.html`
- **字体滑块测试**: `/public/font-slider-test.html`
- **字体检查清单**: `/public/font-test-checklist.html`
- **调试设置页面**: `/public/debug-settings.html`

### 构建脚本
- **build-apk.js**: 自动化APK构建
- **build-config.js**: 构建配置管理
- **custom-gradle.bat**: 自定义Gradle构建

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发规范
- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier代码规范
- 组件命名使用PascalCase
- 文件命名使用camelCase
- 提交信息使用中文描述

### 提交流程
1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/新功能`)
3. 提交代码更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建Pull Request

### 代码风格
```typescript
// 组件示例
interface ComponentProps {
  title: string;
  theme: 'chinese' | 'ios';
}

const Component: React.FC<ComponentProps> = ({ title, theme }) => {
  return (
    <div className={`component ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>
      {title}
    </div>
  );
};
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- **开发者**: Frankieli123
- **邮箱**: 3180623@gmail.com
- **GitHub**: [@Frankieli123](https://github.com/Frankieli123)
- **项目地址**: [https://github.com/Frankieli123/zhanwen](https://github.com/Frankieli123/zhanwen)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

特别感谢：
- React团队提供的优秀框架
- Tailwind CSS的原子化设计理念
- Capacitor的跨平台解决方案
- 传统易学文化的智慧传承

---

<div align="center">

**占问** - 让古老的智慧在现代科技中焕发新生 ✨

*基于《易经》六壬金口诀理论，尊重中国传统文化，供娱乐参考*

</div>
