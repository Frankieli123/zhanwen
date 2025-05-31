# 更新日志

## 2024-01-XX - 字体设置优化、AI提示词增强和字体比例调整

### 🎯 主要修改

#### 1. 字体滑块锚点对齐修复
- **问题**: 字体设置滑块的锚点位置与滑块实际位置不匹配
- **修复**:
  - 统一了锚点定位系统，移除冲突的CSS样式
  - 修正了容器边距，确保滑块轨道和锚点容器一致
  - 优化了锚点样式，现在锚点准确对齐到滑块位置
  - 清理了重复的函数定义和样式冲突

#### 2. 字体选项精简
- **移除的字体**: 苹方、楷体、仿宋
- **保留的字体**:
  - 系统默认
  - 思源宋体
  - 思源黑体
  - 自定义字体
- **影响文件**:
  - `src/utils/fontUtils.ts` - 更新字体选项数组
  - `src/types/index.ts` - 更新FontFamily类型定义

#### 3. AI提示词增强
- **新增功能**: 在发送给AI的提示词中自动添加当前起卦时间
- **时间格式**: 使用中国时区的标准格式 (YYYY-MM-DD HH:mm:ss)
- **修改文件**: `src/services/apiService.ts`
- **示例输出**: `起卦时间: 2024-01-15 14:30:25`

#### 4. 字体比例层级优化
- **建立统一的字体层级系统**:
  - **大标题** (fontSize+5): 页面主标题，如"历史记录"、"应用设置"
  - **中标题** (fontSize+3): 卡片标题、区块标题，如"界面主题"、"字体设置"
  - **小标题** (fontSize+1): 子标题、重要内容标题，如"占问说明"
  - **正文** (fontSize+0): 普通正文、按钮文字
  - **辅助文字** (fontSize-2): 说明文字、标签、底部导航
  - **提示文字** (fontSize-5): 小提示、版权信息等

- **调整的组件**:
  - `HistoryList.tsx` - 标题和按钮字体层级
  - `Settings.tsx` - 各级标题和说明文字
  - `HexagramInput.tsx` - 提示文字和说明内容
  - `Layout.tsx` - 底部导航标签文字
  - `HexagramCard.tsx` - 卡片内容层级（已优化）

### 🔧 技术细节

#### 字体滑块修复详情
```typescript
// 修复前的问题
.slider-stops-container {
  display: flex;
  justify-content: space-between; // 导致锚点分布不均
}

// 修复后的解决方案
.slider-stop-point {
  position: absolute;
  left: ${(level / 4) * 100}%; // 精确定位
  transform: translate(-50%, -50%);
}
```

#### AI提示词时间添加
```typescript
// 新增的时间格式化逻辑
const currentTime = new Date();
const timeString = currentTime.toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Asia/Shanghai'
});
prompt += `\n起卦时间: ${timeString}\n`;
```

### 📱 用户体验改进

1. **字体设置更直观**
   - 滑块锚点现在准确对应5个字体大小档位
   - 点击锚点或标签能精确跳转到对应位置
   - 视觉反馈更加准确

2. **字体选择更简洁**
   - 移除了不常用的字体选项
   - 减少了选择复杂度
   - 保留了最实用的字体组合

3. **AI解读更准确**
   - AI现在能获得准确的起卦时间信息
   - 有助于提供更精准的时间相关解读
   - 增强了占卜的时效性分析

### 🧪 测试建议

#### 字体设置测试
1. 打开设置页面，测试字体大小滑块
2. 验证5个档位（超小、小、标准、大、超大）的切换
3. 检查锚点是否准确对齐
4. 确认字体变化在所有页面生效

#### AI功能测试
1. 进行一次占卦并请求AI解读
2. 检查开发者控制台中的API请求
3. 验证提示词中包含正确的起卦时间

### 📋 兼容性说明

- **向后兼容**: 现有的字体设置会自动映射到新的字体选项
- **数据迁移**: 如果用户之前选择了被移除的字体，会自动回退到系统默认字体
- **API兼容**: AI服务调用保持不变，只是增加了时间信息

### 🔍 已知问题

- 无已知问题

### 📝 开发者注意事项

1. **字体类型更新**: 如果需要添加新字体，记得同时更新 `FontFamily` 类型定义
2. **时间格式**: 起卦时间使用中国时区，如需支持其他时区请修改 `timeZone` 配置
3. **测试覆盖**: 建议在不同设备和浏览器上测试字体设置功能

---

### 文件变更清单

- ✅ `src/utils/fontUtils.ts` - 精简字体选项
- ✅ `src/types/index.ts` - 更新字体类型定义
- ✅ `src/components/settings/FontSettings.tsx` - 修复滑块锚点对齐
- ✅ `src/styles/globals.css` - 清理重复样式
- ✅ `src/services/apiService.ts` - 添加起卦时间到AI提示词
- ✅ `divination-app/public/font-slider-test.html` - 添加测试页面
