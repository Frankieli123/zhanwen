import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { mapLevelToPx } from '../../utils/fontUtils';

{/* @font-tool组件：字体大小调试器 */}

// 字体大小配置接口
interface FontSizeConfig {
  componentName: string;
  description: string;
  elements: {
    name: string;
    relativeSizeValue: number;
    path: string;
  }[];
}

const FontSizeDebugger: React.FC = () => {
  const theme = useAppStore(state => state.settings.theme);
  const fontSize = useAppStore(state => state.settings.fontSize);
  
  // 初始配置
  const initialConfig: FontSizeConfig[] = [
    {
      componentName: 'HexagramCard',
      description: '卦象卡片组件',
      elements: [
        { name: '卦象名称', relativeSizeValue: 1, path: 'HexagramCard.tsx:55' },
        { name: '五行符号', relativeSizeValue: -3, path: 'HexagramCard.tsx:61' },
        { name: '标签文字', relativeSizeValue: -4, path: 'HexagramCard.tsx:70,75,79,83' },
        { name: '属性内容', relativeSizeValue: -2, path: 'HexagramCard.tsx:71,76,80,84' },
        { name: '卦象描述', relativeSizeValue: -1, path: 'HexagramCard.tsx:88' },
        { name: '详情按钮', relativeSizeValue: -1, path: 'HexagramCard.tsx:98' },
      ]
    },
    {
      componentName: 'HexagramInput',
      description: '卦象输入组件',
      elements: [
        { name: '立即起卦按钮', relativeSizeValue: 0, path: 'HexagramInput.tsx:42' },
        { name: '使用当前时间提示', relativeSizeValue: -2, path: 'HexagramInput.tsx:66' },
        { name: '占问说明标题', relativeSizeValue: 0, path: 'HexagramInput.tsx:76' },
        { name: '占问说明内容', relativeSizeValue: -1, path: 'HexagramInput.tsx:80' },
        { name: '标签分类（正时卦等）', relativeSizeValue: 0, path: 'HexagramInput.tsx:86,93' },
        { name: '分类内容', relativeSizeValue: -1, path: 'HexagramInput.tsx:87,94' },
        { name: '特别提示标题', relativeSizeValue: 0, path: 'HexagramInput.tsx:101' },
        { name: '特别提示内容', relativeSizeValue: -1, path: 'HexagramInput.tsx:107' },
        { name: '天地人数标签', relativeSizeValue: -1, path: 'HexagramInput.tsx:316,325,342' },
        { name: '输入框文字', relativeSizeValue: -1, path: 'HexagramInput.tsx:317,332,349' },
        { name: '随机生成按钮', relativeSizeValue: 0, path: 'HexagramInput.tsx:361' },
        { name: '数字说明文字', relativeSizeValue: -2, path: 'HexagramInput.tsx:378,381,384' },
        { name: '生成卦象按钮', relativeSizeValue: 0, path: 'HexagramInput.tsx:392' },
        { name: '或按选择时间起卦', relativeSizeValue: -2, path: 'HexagramInput.tsx:411' },
        { name: '农历年月日时标签', relativeSizeValue: -1, path: 'HexagramInput.tsx:419,476,535,559' },
        { name: '下拉选择器文字', relativeSizeValue: -1, path: 'HexagramInput.tsx:423,480' },
        { name: '下拉选项文字', relativeSizeValue: -2, path: 'HexagramInput.tsx:450,507' },
        { name: '日期选择按钮', relativeSizeValue: -1, path: 'HexagramInput.tsx:542' },
        { name: '时辰选择按钮', relativeSizeValue: -2, path: 'HexagramInput.tsx:566' },
        { name: '按选择时间起卦按钮', relativeSizeValue: 0, path: 'HexagramInput.tsx:584' },
        { name: '占问输入框', relativeSizeValue: -1, path: 'HexagramInput.tsx:634' },
        { name: '占问提示文字', relativeSizeValue: -3, path: 'HexagramInput.tsx:641' },
        { name: '正时卦/活时卦按钮', relativeSizeValue: 0, path: 'HexagramInput.tsx:665,677' },
      ]
    }
  ];
  
  // 状态
  const [configs, setConfigs] = useState<FontSizeConfig[]>(initialConfig);
  const [showPreview, setShowPreview] = useState(true);
  
  // 保存配置到localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('fontSizeDebugConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfigs(parsedConfig);
      } catch (e) {
        console.error('无法解析保存的字体大小配置', e);
      }
    }
  }, []);
  
  // 更新配置
  const updateElementSize = (configIndex: number, elementIndex: number, newValue: number) => {
    const newConfigs = [...configs];
    newConfigs[configIndex].elements[elementIndex].relativeSizeValue = newValue;
    setConfigs(newConfigs);
    localStorage.setItem('fontSizeDebugConfig', JSON.stringify(newConfigs));
  };
  
  // 重置配置
  const resetConfigs = () => {
    setConfigs(initialConfig);
    localStorage.removeItem('fontSizeDebugConfig');
  };
  
  // 导出配置
  const exportConfigs = () => {
    // 格式化为可读的代码段
    let output = '';
    configs.forEach(config => {
      output += `// ${config.componentName} - ${config.description}\n`;
      config.elements.forEach(element => {
        output += `// ${element.name}: fontSize ${element.relativeSizeValue >= 0 ? '+' : ''}${element.relativeSizeValue}\n`;
        output += `// 文件路径: ${element.path}\n`;
        output += `style={{ fontSize: \`\${mapLevelToPx(fontSize${element.relativeSizeValue >= 0 ? '+' : ''}${element.relativeSizeValue})}px\` }}\n\n`;
      });
      output += '\n';
    });
    
    // 创建下载文件
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'font-size-config.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">字体大小调试工具</h1>
        <div className="flex space-x-2">
          <button 
            className="bg-gray-200 px-3 py-1 rounded-md text-sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? '隐藏预览' : '显示预览'}
          </button>
          <button 
            className="bg-red-100 px-3 py-1 rounded-md text-sm text-red-700"
            onClick={resetConfigs}
          >
            重置
          </button>
          <button 
            className="bg-blue-600 px-3 py-1 rounded-md text-sm text-white"
            onClick={exportConfigs}
          >
            导出配置
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <p className="mb-2">
          <strong>全局基础字体大小:</strong> fontSize = {fontSize} ({mapLevelToPx(fontSize)}px)
        </p>
        <p className="text-gray-600 text-sm">
          在调整相对大小时，请记住：
          <br />- 负数值会使字体变小（如fontSize-2表示比基础字体小2级）
          <br />- 正数值会使字体变大（如fontSize+1表示比基础字体大1级）
          <br />- 最小值应该是-2（即{mapLevelToPx(-2)}px），最大值是15（即{mapLevelToPx(15)}px）
        </p>
      </div>
      
      {configs.map((config, configIndex) => (
        <div key={configIndex} className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-2">{config.componentName}</h2>
          <p className="text-gray-600 mb-4">{config.description}</p>
          
          <div className="space-y-4">
            {config.elements.map((element, elementIndex) => (
              <div key={elementIndex} className="border-b pb-3">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">{element.name}</p>
                    <p className="text-gray-500 text-xs">{element.path}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className={`px-2 py-1 rounded ${element.relativeSizeValue > 0 ? 'bg-green-100 text-green-800' : element.relativeSizeValue < 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                    >
                      fontSize{element.relativeSizeValue >= 0 ? '+' : ''}{element.relativeSizeValue}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {mapLevelToPx(fontSize + element.relativeSizeValue)}px
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className="px-2 bg-gray-200 rounded"
                    onClick={() => updateElementSize(configIndex, elementIndex, element.relativeSizeValue - 1)}
                    disabled={element.relativeSizeValue <= -2}
                  >
                    -
                  </button>
                  
                  <input 
                    type="range"
                    min="-2"
                    max="5"
                    value={element.relativeSizeValue}
                    onChange={(e) => updateElementSize(configIndex, elementIndex, parseInt(e.target.value))}
                    className="flex-grow h-2"
                  />
                  
                  <button 
                    className="px-2 bg-gray-200 rounded"
                    onClick={() => updateElementSize(configIndex, elementIndex, element.relativeSizeValue + 1)}
                    disabled={element.relativeSizeValue >= 5}
                  >
                    +
                  </button>
                </div>
                
                {showPreview && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <span
                      style={{
                        fontSize: `${mapLevelToPx(fontSize + element.relativeSizeValue)}px`,
                        fontFamily: 'system-ui, sans-serif'
                      }}
                      className={`${theme === 'chinese' ? 'text-chineseRed' : 'text-blue-600'}`}
                    >
                      这是{element.name}的预览文本
                      {/* @font-tool：预览文本 */}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FontSizeDebugger; 