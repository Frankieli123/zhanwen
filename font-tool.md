# Font-Tool 组件注释指南

## 基本注释格式

在React/JSX项目中添加Font-Tool注释很简单，使用以下格式：

```jsx
{/* @font-tool：组件名称 */}
<YourComponent>
  {/* 组件内容 */}
</YourComponent>
```

**重要提示**：
- 注释使用中文冒号（：）而非英文冒号（:）
- 注释应直接放在要标记的组件或元素前面

## 注释位置示例

### 1. 组件声明前注释

```jsx
{/* @font-tool：标签分类活时卦 */}
const TagCategoryLiveHexagram = () => {
  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
};
```

### 2. JSX元素前注释

```jsx
function DivinationApp() {
  return (
    <div>
      {/* @font-tool：标签分类活时卦 */}
      <div className="tag-category-section">
        <h3>活时卦标签</h3>
        <p>描述文本</p>
      </div>
    </div>
  );
}
```

### 3. 组件实例前注释

```jsx
<div>
  {/* @font-tool：标签分类活时卦 */}
  <TagCategoryLiveHexagram />
</div>
```

## 注释命名规范

1. **描述性命名**：使用能清晰表达组件用途的名称
   ```jsx
   {/* @font-tool：标签分类活时卦 */}
   {/* @font-tool：用户信息卡片 */}
   {/* @font-tool：预测结果展示 */}
   ```

2. **保持一致性**：相同组件使用一致的名称
   ```jsx
   // 一致使用同一名称标记相同组件
   {/* @font-tool：用户资料卡 */}
   ```

3. **层次结构**：可以为子组件添加更具体的名称
   ```jsx
   {/* @font-tool：卦象详情 */}
   <HexagramDetail>
     {/* @font-tool：卦象标题 */}
     <h2>...</h2>
     
     {/* @font-tool：卦象描述 */}
     <p>...</p>
   </HexagramDetail>
   ```

## 常见组件注释示例

### 页面组件

```jsx
{/* @font-tool：卦象详情页 */}
const HexagramDetailPage = () => {
  // ...
};
```

### 卡片组件

```jsx
{/* @font-tool：占卜结果卡片 */}
<div className="divination-card">
  {/* 卡片内容 */}
</div>
```

### 列表项组件

```jsx
{/* @font-tool：卦象列表项 */}
<li className="hexagram-item">
  {/* 列表项内容 */}
</li>
```

### 表单组件

```jsx
{/* @font-tool：占卜问题表单 */}
<form className="divination-form">
  {/* 表单内容 */}
</form>
```

## 辅助属性标记

除了注释外，也可以添加HTML属性来辅助标记：

```jsx
<div 
  data-component="标签分类活时卦" 
  data-font-tool="true"
>
  {/* 组件内容 */}
</div>
```

## 常见问题

1. **我应该在哪个级别添加注释？**
   - 建议在语义明确的组件级别添加，如卡片、部分、区域等
   - 不需要为每个HTML元素都添加注释

2. **注释有字符数限制吗？**
   - 建议保持简洁，但没有严格限制
   - 一般5-10个汉字为宜

3. **是否可以在同一个组件中添加多个注释？**
   - 可以，但通常建议每个组件只使用一个主注释
   - 子元素可根据需要添加额外注释

## 集成建议

将以下工作流程纳入您的开发过程：

1. 为新组件添加注释：
   ```jsx
   {/* @font-tool：新增组件名称 */}
   ```

2. 在代码审查中确认注释：
   - 检查是否使用了正确的中文冒号
   - 确认命名是否符合项目约定

3. 定期使用Font-Tool扫描项目，确保所有注释都被正确识别 