import React, { useState, Fragment } from 'react';
import { DivinationResult } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { fiveElementStyles } from '../../data/hexagramData';
import { Dialog, Transition } from '@headlessui/react';
import HexagramResult from './HexagramResult';
import { getNavigateToAIReading } from '../../App';

interface HistoryListProps {
  results: DivinationResult[];
}

const HistoryList: React.FC<HistoryListProps> = ({ results }) => {
  const [selectedResult, setSelectedResult] = useState<DivinationResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const clearHistory = useAppStore(state => state.clearDivinationHistory);
  const theme = useAppStore(state => state.settings.theme);
  
  // 格式化日期
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 格式化时间戳为相对时间
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // 小于1分钟
    if (diff < 60 * 1000) {
      return '刚刚';
    }
    
    // 小于1小时
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}分钟前`;
    }
    
    // 小于24小时
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}小时前`;
    }
    
    // 小于30天
    if (diff < 30 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}天前`;
    }
    
    // 超过30天，显示日期
    return formatDate(timestamp);
  };
  
  // 查看详细信息
  const handleViewDetails = (result: DivinationResult) => {
    // 设置导航来源为历史记录
    useAppStore.setState({ 
      currentResult: result,
      navigationSource: 'history'
    });
    useAppStore.getState().navigateToResult();
  };
  
  // 查看详细解读
  const handleViewReading = (result: DivinationResult) => {
    // 设置导航来源为历史记录
    useAppStore.setState({ 
      currentResult: result,
      navigationSource: 'history'
    });
    getNavigateToAIReading()();
  };
  
  // 关闭详细信息
  const closeModal = () => {
    setIsOpen(false);
  };
  
  // 确认清空历史
  const handleClearHistory = () => {
    clearHistory();
    setConfirmDialogOpen(false);
  };
  
  // 按日期分组历史记录
  type GroupedResults = {
    date: string;
    results: DivinationResult[];
  }[];
  
  const groupResultsByDate = (results: DivinationResult[]): GroupedResults => {
    const groups: Record<string, DivinationResult[]> = {};
    
    results.forEach(result => {
      const date = new Date(result.timestamp);
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      
      groups[dateString].push(result);
    });
    
    // 转换为数组并按日期排序
    return Object.entries(groups)
      .map(([date, results]) => ({ date, results }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const groupedResults = groupResultsByDate(results);
  
  // 时间轴标签格式化
  const formatDateLabel = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getTime() === today.getTime()) {
      return '今天';
    } else if (date.getTime() === yesterday.getTime()) {
      return '昨天';
    } else {
      return `${month}月${day}日`;
    }
  };
  
  if (results.length === 0) {
    return (
      <div className="bg-iosCard p-6 rounded-ios shadow-ios text-center">
        <svg 
          className="h-16 w-16 mx-auto mb-4 text-iosSecondary opacity-50" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="text-iosText mb-2 font-medium">暂无卦象历史记录</p>
        <p className="text-sm text-iosSecondary">
          生成卦象后将会在此处显示历史记录
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-iosCard rounded-ios shadow-ios">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>历史记录</h2>
          <button
            className="text-iosDanger text-sm py-1.5 px-3 bg-iosBg rounded-full hover:bg-opacity-90 transition-opacity"
            onClick={() => setConfirmDialogOpen(true)}
            aria-label="清空历史记录"
          >
            清空历史
          </button>
        </div>
        
        {/* 添加分割线，与Settings组件保持一致 */}
        <div className="mb-6 border-b border-iosSeparator"></div>
      
        <div className="space-y-6">
          {groupedResults.map((group) => (
            <div key={group.date} className="mb-6 last:mb-0">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-water mr-2"></div>
                <h3 className="text-md font-medium text-iosText">{formatDateLabel(group.date)}</h3>
              </div>
              
              <div className="ml-3 border-l-2 border-iosSeparator pl-4 space-y-3">
                {group.results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-iosBg rounded-ios p-3 hover:bg-opacity-90 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleViewDetails(result)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span
                          className="inline-block w-3 h-3 mr-2 rounded-full"
                          style={{ backgroundColor: fiveElementStyles[result.hexagram.element].color }}
                        ></span>
                        <span className="font-medium text-iosText">{result.hexagram.name}</span>
                      </div>
                      <span className="text-xs text-iosSecondary">
                        {formatRelativeTime(result.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-iosSecondary">
                      {result.isTimeHexagram ? '正时卦' : '活时卦'}
                      {result.isTimeHexagram && result.timeInfo
                        ? ` · ${result.timeInfo.lunarDate}`
                        : ''}
                    </div>
                    
                    {result.query && (
                      <div className="mt-2 text-sm text-iosText truncate">
                        <span className="text-iosSecondary">占问:</span> {result.query}
                      </div>
                    )}
                    
                    {/* 详细解读链接 */}
                    {result.aiReading && (
                      <div 
                        className="mt-2 text-xs text-iosSecondary flex items-center"
                        onClick={(e) => {
                          e.stopPropagation(); // 防止触发父元素的点击事件
                          handleViewReading(result);
                        }}
                      >
                        <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="underline">查看详细解读</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 详情弹窗 */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30"></div>
            </Transition.Child>
            
            {/* 这个元素用于居中弹窗 */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-iosBg shadow-ios rounded-ios-lg">
                <div className="absolute top-0 right-0 pt-3 pr-3">
                  <button
                    type="button"
                    className="text-iosSecondary hover:text-iosDanger focus:outline-none"
                    onClick={closeModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                
                {selectedResult && <HexagramResult result={selectedResult} />}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      
      {/* 确认清空历史弹窗 */}
      <Transition show={confirmDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setConfirmDialogOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30"></div>
            </Transition.Child>
            
            {/* 这个元素用于居中弹窗 */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-iosCard shadow-ios rounded-ios">
                <Dialog.Title as="h3" className="text-lg font-medium mb-4 text-iosText">
                  确认清空历史记录
                </Dialog.Title>
                
                <p className="text-iosSecondary mb-6">
                  此操作将清空所有卦象历史记录，且无法恢复。确定要继续吗？
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-iosBg text-water rounded-full"
                    onClick={() => setConfirmDialogOpen(false)}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-iosDanger text-white rounded-full"
                    onClick={handleClearHistory}
                  >
                    确认清空
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default HistoryList; 