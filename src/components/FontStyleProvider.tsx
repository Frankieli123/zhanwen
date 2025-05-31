import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getFontSize, getFontFamilyStyle, getCustomFontFaceRule, getLineHeight } from '../utils/fontUtils';

{/* @font-tool组件：字体样式提供器 */}

// 这个组件负责将选定的字体样式应用到整个应用
const FontStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useAppStore(state => state.settings);
  const [fontUpdateCount, setFontUpdateCount] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [wsStatus, setWsStatus] = useState('初始化');
  
  // 添加调试日志函数
  const debugLog = (...args: any[]) => {
    if (debugMode) {
      console.log('[FontStyleProvider-debug]', ...args);
    }
  };
  
  useEffect(() => {
    // 检查URL是否包含调试参数
    if (window.location.search.includes('font-tool-debug=true')) {
      setDebugMode(true);
      console.log('[FontStyleProvider] 已启用调试模式');
    }
  }, []);
  
  // WebSocket连接和通信
  useEffect(() => {
    if (!debugMode) return;
    
    // 尝试连接到字体工具WebSocket服务器
    const wsUrl = 'ws://localhost:28888';
    let ws: WebSocket | null = null;
    
    try {
      ws = new WebSocket(wsUrl);
      debugLog('正在连接到字体工具WebSocket服务器...');
      
      if (ws) {
        ws.onopen = () => {
          debugLog('已连接到字体工具WebSocket服务器');
          setWsStatus('已连接');
          
          // 发送客户端标识信息
          const clientInfo = {
            type: 'client-connected',
            clientId: `react-app-${Date.now()}`,
            component: 'FontStyleProvider',
            capabilities: ['font-size-update', 'comment-tracking'],
            debug: true,
            timestamp: Date.now()
          };
          
          ws?.send(JSON.stringify(clientInfo));
          debugLog('已发送客户端标识信息', clientInfo);
        };
        
        ws.onmessage = (event) => {
          debugLog('收到WebSocket消息:', event.data);
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'font-config-updated') {
              debugLog('收到字体配置更新消息:', message);
              
              // 触发自定义事件，通知组件更新字体
              const updateEvent = new CustomEvent('font-tool-updated', {
                detail: message
              });
              window.dispatchEvent(updateEvent);
            } else if (message.type === 'status') {
              debugLog('服务器状态:', message);
            }
          } catch (error) {
            console.error('解析WebSocket消息失败:', error);
          }
        };
        
        ws.onclose = () => {
          debugLog('WebSocket连接已关闭');
          setWsStatus('已断开');
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket错误:', error);
          setWsStatus('错误');
        };
      }
      
      // 定期发送心跳消息
      const heartbeatInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'heartbeat',
            timestamp: Date.now(),
            component: 'FontStyleProvider'
          }));
          debugLog('已发送心跳消息');
        }
      }, 30000); // 每30秒发送一次
      
      return () => {
        clearInterval(heartbeatInterval);
        if (ws) {
          ws.close();
        }
      };
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
      setWsStatus('连接失败');
    }
  }, [debugMode]);
  
  useEffect(() => {
    // 获取或创建style元素
    let styleEl = document.getElementById('app-font-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'app-font-styles';
      document.head.appendChild(styleEl);
    }
    
    // 生成字体样式
    const fontFamily = getFontFamilyStyle(settings.fontFamily, settings.customFontUrl);
    const fontSizes = getFontSize(settings.fontSize);
    const lineHeightValue = getLineHeight(settings.lineHeight || 1.5);
    
    // 生成自定义字体@font-face规则（如果有）
    const customFontFace = getCustomFontFaceRule(settings.customFontUrl);
    
    // 构建CSS内容
    const cssContent = `
      ${customFontFace}
      
      body {
        font-family: ${fontFamily};
        font-size: ${fontSizes.base};
        line-height: ${lineHeightValue};
      }
      
      p, span, div, li, td, th, label, button, input, textarea, select {
        line-height: ${lineHeightValue};
      }
      
      h1, h2, h3, h4, h5, h6, .title-font {
        font-family: ${fontFamily};
        line-height: ${parseFloat(lineHeightValue) > 1.5 ? (parseFloat(lineHeightValue) * 0.9).toFixed(2) : lineHeightValue};
      }
      
      h1, .text-xl, .text-2xl {
        font-size: ${fontSizes.heading};
      }
      
      h2, h3, .text-lg, .text-xl {
        font-size: calc(${fontSizes.base} * 1.2);
      }
      
      /* 段落间距 */
      .long-text p {
        margin-bottom: ${parseFloat(lineHeightValue) * 0.4}em;
      }
      
      /* 紧凑行高文本 */
      .compact-text {
        line-height: ${(parseFloat(lineHeightValue) * 0.85).toFixed(2)};
      }
      
      /* 宽松行高文本 */
      .loose-text {
        line-height: ${(parseFloat(lineHeightValue) * 1.15).toFixed(2)};
      }
    `;
    
    // 应用样式
    styleEl.textContent = cssContent;
    debugLog('已应用字体样式:', { 
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      lineHeight: settings.lineHeight
    });
    
    // 监听font-tool热更新事件
    const handleFontToolUpdate = (event?: Event) => {
      console.log('[FontStyleProvider] 检测到font-tool更新事件，重新应用样式');
      setFontUpdateCount(prev => prev + 1);
      
      // 如果是调试模式，显示更多信息
      if (debugMode) {
        const updateEvent = event as CustomEvent;
        if (updateEvent && updateEvent.detail) {
          console.log('[FontStyleProvider] 更新详情:', updateEvent.detail);
        }
        
        // 扫描页面中的@font-tool注释
        scanFontToolComments();
      }
      
      // 直接重新应用当前样式以反映可能的更改
      if (styleEl) {
        styleEl.textContent = '';
      }
      setTimeout(() => {
        if (styleEl) {
          styleEl.textContent = cssContent;
        }
      }, 50);
    };
    
    // 扫描页面中的@font-tool注释并在调试模式下显示
    const scanFontToolComments = () => {
      if (!debugMode) return;
      
      debugLog('开始扫描@font-tool注释...');
      
      // 尝试查找页面中的HTML注释
      const allHTML = document.documentElement.outerHTML;
      
      // 查找所有可能的字体工具标记
      debugLog('查找所有可能的字体工具标记...');
      
      // 1. 检查data-font-tool属性
      const dataFontToolElements = document.querySelectorAll('[data-font-tool]');
      debugLog(`找到 ${dataFontToolElements.length} 个带有data-font-tool属性的元素`);
      
      // 2. 检查data-component属性
      const componentElements = document.querySelectorAll('[data-component]');
      debugLog(`找到 ${componentElements.length} 个带有data-component属性的元素`);
      
      // 3. 分析内联样式中可能包含的字体大小信息
      const allElements = document.querySelectorAll('*');
      let fontSizeElementsCount = 0;
      
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const fontSize = style.fontSize;
        if (fontSize && /^\d+px$/.test(fontSize)) {
          fontSizeElementsCount++;
        }
      });
      
      debugLog(`页面中共有 ${fontSizeElementsCount} 个设置了字体大小的元素`);
      
      // 4. 检查注释节点
      const commentNodes: Comment[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_COMMENT,
        null
      );
      
      let commentNode;
      while (commentNode = walker.nextNode() as Comment) {
        if (commentNode.textContent && commentNode.textContent.includes('@font-tool')) {
          commentNodes.push(commentNode);
        }
      }
      
      debugLog(`找到 ${commentNodes.length} 个包含@font-tool的注释节点`);
      commentNodes.forEach((node, index) => {
        debugLog(`注释节点 ${index + 1}:`, node.textContent);
        
        // 分析节点后的元素
        const nextElement = node.nextElementSibling;
        if (nextElement) {
          debugLog(`注释节点 ${index + 1} 后的元素:`, nextElement.tagName, nextElement.className);
        }
      });
      
      // 发送扫描结果到WebSocket服务器(如果连接)
      if (wsStatus === '已连接') {
        try {
          const ws = new WebSocket('ws://localhost:28888');
          ws.onopen = () => {
            ws.send(JSON.stringify({
              type: 'scan-result',
              timestamp: Date.now(),
              component: 'FontStyleProvider',
              comments: commentNodes.length,
              dataFontToolElements: dataFontToolElements.length,
              commentNodes: commentNodes.length,
              allElements: document.querySelectorAll('*').length
            }));
            
            // 发送后关闭连接
            setTimeout(() => ws.close(), 500);
          };
        } catch (e) {
          debugLog('发送扫描结果失败:', e);
        }
      }
    };
    
    // 如果是调试模式，初始扫描一次注释
    if (debugMode) {
      // 等待DOM完全加载后再扫描
      setTimeout(() => {
        scanFontToolComments();
      }, 1000);
    }
    
    // 添加事件监听
    window.addEventListener('font-tool-updated', handleFontToolUpdate);
    
    // 创建一个自定义事件，通知font-tool客户端我们已准备好接收更新
    if (debugMode) {
      const readyEvent = new CustomEvent('font-tool-client-ready', {
        detail: { 
          component: 'FontStyleProvider',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(readyEvent);
      console.log('[FontStyleProvider] 已发送就绪事件');
    }
    
    // 清理函数
    return () => {
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
      window.removeEventListener('font-tool-updated', handleFontToolUpdate);
    };
  }, [settings.fontFamily, settings.fontSize, settings.customFontUrl, settings.lineHeight, debugMode]);
  
  // 添加data-font-tool属性，帮助font-tool识别和修改
  return (
    <div data-font-tool-provider="true" data-component="FontStyleProvider" data-debug={debugMode.toString()}>
      {debugMode && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          padding: '5px 10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          fontSize: '12px',
          borderRadius: '4px',
          zIndex: 9999
        }}>
          Font Tool {wsStatus} | 更新: {fontUpdateCount}
        </div>
      )}
      {children}
    </div>
  );
};

export default FontStyleProvider; 