import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { useAppStore } from '../store/useAppStore';
import { FiveElement } from '../types';
import { fiveElementStyles } from '../data/hexagramData';
import FontSettings from './settings/FontSettings';
import { logService } from '../services/logService';

const Settings: React.FC = () => {
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const [showAPILogs, setShowAPILogs] = useState(false);
  const [loggingEnabled, setLoggingEnabled] = useState(logService.isEnabled());
  const [logs, setLogs] = useState(logService.getLogs());
  
  // 获取五行中文名称
  const getElementName = (element: FiveElement): string => {
    const names: Record<FiveElement, string> = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水'
    };
    return names[element];
  };
  
  // 显示五行符号
  const renderElementSymbol = (element: FiveElement): React.ReactNode => {
    const style = fiveElementStyles[element];
    return (
      <span 
        className="inline-flex items-center justify-center w-6 h-6 rounded-full mr-2"
        style={{ backgroundColor: style.color }}
        title={`五行-${getElementName(element)}`}
      >
        <span className="text-white font-bold">{style.symbol}</span>
      </span>
    );
  };

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };
  
  // 更新日志开关状态
  const handleLoggingToggle = (enabled: boolean) => {
    setLoggingEnabled(enabled);
    logService.setEnabled(enabled);
  };
  
  // 刷新日志列表
  const refreshLogs = () => {
    setLogs(logService.getLogs());
  };
  
  // 清空日志
  const clearLogs = () => {
    logService.clearLogs();
    setLogs([]);
  };
  
  return (
    <div className="bg-iosCard rounded-ios shadow-ios">
      <div className="p-5">
        <h2 className={`text-xl font-semibold mb-4 ${settings.theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>应用设置</h2>
        
        {/* 添加分割线，类似历史记录中的样式 */}
        <div className="mb-6 border-b border-iosSeparator"></div>
        
        <div className="space-y-6">
          {/* 主题切换 */}
          <div>
            <h3 className="font-medium text-iosText mb-3">界面主题</h3>
            <p className="text-sm text-iosSecondary mb-3">切换应用的视觉风格</p>
            
            <div className="grid grid-cols-3 gap-3">
              {/* 明亮主题 */}
              <div 
                className={`flex flex-col items-center p-3 rounded-ios ${
                  settings.theme === 'light' ? 'bg-water text-white' : 'bg-iosBg text-iosText'
                }`}
                onClick={() => updateSettings({ theme: 'light' })}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-ios">
                  <svg className="w-6 h-6 text-iosText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-medium">明亮</span>
              </div>
              
              {/* 暗黑主题 */}
              <div 
                className={`flex flex-col items-center p-3 rounded-ios ${
                  settings.theme === 'dark' ? 'bg-water text-white' : 'bg-iosBg text-iosText'
                }`}
                onClick={() => updateSettings({ theme: 'dark' })}
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2 shadow-ios">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <span className="font-medium">暗黑</span>
              </div>
              
              {/* 中国风主题 */}
              <div 
                className={`flex flex-col items-center p-3 rounded-ios ${
                  settings.theme === 'chinese' ? 'text-white' : 'bg-iosBg text-iosText'
                }`}
                style={{ 
                  backgroundColor: settings.theme === 'chinese' ? '#8C1F28' : '' 
                }}
                onClick={() => updateSettings({ theme: 'chinese' })}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-ios"
                  style={{ backgroundColor: '#8C1F28' }}>
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 9L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 15L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-medium">中国风</span>
              </div>
            </div>
          </div>
          
          {/* 字体设置 - 新增 */}
          <div className="py-4 border-t border-iosSeparator">
            <h3 className="font-medium text-iosText mb-3">字体设置</h3>
            <FontSettings />
          </div>
          
          {/* 辅助功能 */}
          <div className="py-4 border-t border-iosSeparator">
            <h3 className="font-medium text-iosText mb-3">辅助功能</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-iosText">色盲友好符号</p>
                <p className="text-sm text-iosSecondary">
                  为五行元素添加特殊符号，方便色盲用户识别
                </p>
              </div>
              <Switch
                checked={settings.useColorSymbols}
                onChange={(checked) => updateSettings({ useColorSymbols: checked })}
                className={`${
                  settings.useColorSymbols ? 'bg-water' : 'bg-iosSecondary bg-opacity-30'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
              >
                <span className="sr-only">启用色盲友好符号</span>
                <span
                  className={`${
                    settings.useColorSymbols ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {['wood', 'fire', 'earth', 'metal', 'water'].map((element) => (
                <div 
                  key={element} 
                  className="flex items-center p-2 bg-iosBg rounded-ios"
                  title={`五行-${getElementName(element as FiveElement)}`}
                >
                  <span
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: fiveElementStyles[element as FiveElement].color }}
                  ></span>
                  <span className="text-iosText">{getElementName(element as FiveElement)}</span>
                  {settings.useColorSymbols && (
                    <span className="ml-1">{fiveElementStyles[element as FiveElement].symbol}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* API日志功能（开发测试用） */}
          <div className="py-4 border-t border-iosSeparator">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-iosText mb-1">API调试日志</h3>
                <p className="text-xs text-iosDanger">
                  此功能仅供开发测试使用，将在正式版本中移除
                </p>
              </div>
              <Switch
                checked={loggingEnabled}
                onChange={handleLoggingToggle}
                className={`${
                  loggingEnabled ? 'bg-water' : 'bg-iosSecondary bg-opacity-30'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
              >
                <span className="sr-only">启用API日志记录</span>
                <span
                  className={`${
                    loggingEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    showAPILogs ? 'bg-water text-white' : 'bg-iosBg text-iosText'
                  }`}
                  onClick={() => setShowAPILogs(!showAPILogs)}
                >
                  {showAPILogs ? '隐藏日志' : '查看日志'}
                </button>
                
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1.5 bg-iosBg rounded-full text-sm text-iosText"
                    onClick={refreshLogs}
                  >
                    刷新
                  </button>
                  <button
                    className="px-3 py-1.5 bg-iosDanger rounded-full text-sm text-white"
                    onClick={clearLogs}
                  >
                    清空
                  </button>
                </div>
              </div>
              
              {showAPILogs && (
                <div className="mt-3 bg-iosBg p-3 rounded-ios max-h-96 overflow-auto">
                  {logs.length === 0 ? (
                    <p className="text-iosSecondary text-center py-5 text-sm">
                      暂无API日志记录
                      {!loggingEnabled && ' (日志记录功能已禁用)'}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="border border-iosSeparator rounded-ios p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-iosSecondary">
                              {formatTime(log.timestamp)}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              log.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {log.error ? '错误' : '成功'}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <h4 className="text-sm font-medium text-iosText mb-1">请求内容</h4>
                            <div className="bg-gray-800 text-gray-200 p-2 rounded text-xs overflow-x-auto">
                              <pre>{JSON.stringify(log.request, null, 2)}</pre>
                            </div>
                          </div>
                          
                          {log.error ? (
                            <div>
                              <h4 className="text-sm font-medium text-iosDanger mb-1">错误信息</h4>
                              <div className="bg-red-50 text-red-900 p-2 rounded text-xs overflow-x-auto">
                                <pre>{JSON.stringify(log.error, null, 2)}</pre>
                              </div>
                            </div>
                          ) : log.response ? (
                            <div>
                              <h4 className="text-sm font-medium text-iosText mb-1">响应内容</h4>
                              <div className="bg-gray-800 text-gray-200 p-2 rounded text-xs overflow-x-auto">
                                <pre>{JSON.stringify(log.response, null, 2)}</pre>
                              </div>
                              {log.response.choices && log.response.choices[0] && (
                                <div className="mt-2">
                                  <h4 className="text-sm font-medium text-iosText mb-1">解读内容</h4>
                                  <div className="bg-iosBg border border-iosSeparator p-2 rounded text-xs overflow-x-auto">
                                    <p className="whitespace-pre-wrap text-iosText">
                                      {log.response.choices[0].message.content}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-iosSecondary text-center py-2">
                              等待响应...
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* 本地存储信息 */}
          <div className="py-4 border-t border-iosSeparator">
            <h3 className="font-medium text-iosText mb-2">数据存储</h3>
            <p className="text-sm text-iosText">
              所有数据均存储在本地设备上，不会上传到服务器。
              卜卦历史记录使用AES-256加密存储。
            </p>
            
            <p className="text-xs text-iosSecondary mt-2">
              根据GDPR第13条规定，您有权访问和删除您的数据。
              您可以随时通过清空历史记录来删除所有数据。
            </p>
          </div>
          
          {/* 关于应用 */}
          <div className="py-4 border-t border-iosSeparator">
            <h3 className="font-medium text-iosText mb-2">关于应用</h3>
            <p className="text-sm text-iosText">
              占问 v1.0.0
            </p>
            <p className="text-xs text-iosSecondary mt-1">
              基于《易经》以及小六壬理论，尊重中国传统文化，仅供娱乐参考。
            </p>
            
            <div className="mt-3 text-xs text-iosSecondary">
              <p>© 2025 占问应用</p>
              <p>作者：Frankie</p>
              <p>遵循WCAG 2.1 AA级别标准设计</p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 