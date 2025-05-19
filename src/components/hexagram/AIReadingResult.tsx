import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getAIHexagramReading } from '../../services/apiService';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { db } from '../../utils/db';

const AIReadingResult: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiReading, setAiReading] = useState<string>('');
  const [alreadyLoaded, setAlreadyLoaded] = useState(false); // 添加状态标记防止重复加载
  
  const currentResult = useAppStore(state => state.currentResult);
  const navigateToResult = useAppStore(state => state.navigateToResult);
  const navigateBack = useAppStore(state => state.navigateBack);
  const theme = useAppStore(state => state.settings.theme);
  const updateCurrentResult = useAppStore(state => state.updateCurrentResult);
  
  useEffect(() => {
    // 如果没有当前结果，返回结果页
    if (!currentResult) {
      console.log('AIReadingResult: 没有当前结果，返回结果页');
      navigateToResult();
      return;
    }
    
    // 防止重复加载
    if (alreadyLoaded) {
      console.log('AIReadingResult: 内容已加载，跳过');
      return;
    }
    
    // 如果已经有解读结果，直接显示
    if (currentResult.aiReading) {
      console.log('AIReadingResult: 发现已有解读结果，直接显示');
      setAiReading(currentResult.aiReading);
      setLoading(false);
      setAlreadyLoaded(true);
      return;
    }
    
    console.log('AIReadingResult: 没有找到解读结果，开始获取');
    
    const fetchAIReading = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('AIReadingResult: 正在获取解读内容...');
        const reading = await getAIHexagramReading(currentResult);
        console.log('AIReadingResult: 解读内容获取成功');
        setAiReading(reading);
        setAlreadyLoaded(true);
        
        // 更新当前结果以包含解读内容
        if (currentResult) {
          const updatedResult = {
            ...currentResult,
            aiReading: reading
          };
          
          updateCurrentResult(updatedResult);
          
          // 更新数据库中的结果，确保历史记录立即更新
          try {
            await db.updateDivinationResult(updatedResult);
            console.log('AIReadingResult: 数据库中的结果已更新');
          } catch (dbError) {
            console.error('更新数据库记录失败:', dbError);
          }
        }
      } catch (error) {
        console.error('Error fetching AI reading:', error);
        setError('获取详细解读失败，请重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAIReading();
  }, [currentResult, navigateToResult, updateCurrentResult, alreadyLoaded]);
  
  // 将AI解读文本分段处理，识别标题和段落
  const formatAIReading = (text: string) => {
    if (!text) return [];
    
    // 首先预处理文本，将宜忌部分按特定格式提取并标记
    let processedText = text;
    
    // 查找宜忌部分并进行特殊处理
    const yijiPattern = /(宜：|忌：)[\s]*([①②③④⑤⑥⑦⑧⑨⑩].*?)(?=(?:\n\n)|(?:\n(?:宜|忌)：)|$)/gm;
    let yijiMatches: {type: string, content: string}[] = [];
    
    // 查找并收集所有宜忌部分
    let match;
    while ((match = yijiPattern.exec(text)) !== null) {
      const type = match[1].trim(); // "宜："或"忌："
      let content = match[2].trim();
      
      // 将带圈数字分隔的内容拆分为多个项目
      const items = content.split(/(?=\n?[①②③④⑤⑥⑦⑧⑨⑩])/g)
        .filter(item => item.trim().length > 0)
        .map(item => item.trim());
      
      // 记录所有项目，为后续处理做准备
      yijiMatches.push({ type, content: items.join('\n\n') });
      
      // 从原文中移除这部分内容(用特殊标记替换)
      processedText = processedText.replace(match[0], `__YIJI_PLACEHOLDER_${yijiMatches.length - 1}__`);
    }
    
    // 常规文本处理 - 在主标题前添加换行符确保分段
    processedText = processedText.replace(/(^|[\n])[一二三四五六七八九十]+、/g, '\n\n$&');
    
    // 在副标题前添加换行符
    processedText = processedText.replace(/(^|[\n])\d+[\.、]/g, '\n\n$&');
    
    // 在带圈数字前添加换行符
    processedText = processedText.replace(/([①②③④⑤⑥⑦⑧⑨⑩])/g, '\n\n$1');
    
    // 在 '- '（半角横杠+空格）前添加换行符
    processedText = processedText.replace(/\-\s+/g, '\n\n- ');
    
    // 在注释部分前添加换行符，但排除带圈数字+空格+提示的情况
    processedText = processedText.replace(/(?<![①②③④⑤⑥⑦⑧⑨⑩]\s*)(注：|备注：|提示：)/g, '\n\n$1');
    
    // 分割文本为段落
    const paragraphs = processedText.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    // 替换所有宜忌占位符并处理追加段落
    const finalParagraphs: string[] = [];
    
    paragraphs.forEach(para => {
      // 检查是否为宜忌占位符
      const placeholderMatch = para.match(/__YIJI_PLACEHOLDER_(\d+)__/);
      if (placeholderMatch) {
        const index = parseInt(placeholderMatch[1]);
        const yijiData = yijiMatches[index];
        
        // 添加宜忌标题
        finalParagraphs.push(yijiData.type);
        
        // 添加所有宜忌项目
        const items = yijiData.content.split(/\n\n/).filter(i => i.trim().length > 0);
        items.forEach(item => finalParagraphs.push(item));
      } else {
        finalParagraphs.push(para);
      }
    });
    
    return finalParagraphs.map((paragraph, index) => {
      // 检查是否为主标题（以中文数字+顿号开头，如"一、"）或"注："开头
      const isMainTitle = 
        (/^[一二三四五六七八九十]+、/.test(paragraph) && 
        !/^[一二三四五六七八九十]+、[一二三四五六七八九十]/.test(paragraph) &&
        paragraph.length < 30) ||
        /^注：/.test(paragraph); // 将"注："识别为主标题
      
      // 检查是否为带圈数字开头的内容项（包括"③ 特殊提示："这种情况）
      const isNumberedItem = /^[①②③④⑤⑥⑦⑧⑨⑩]/.test(paragraph);
      
      // 检查是否为副标题，但排除带圈数字开头的情况
      const isSubTitle = 
        !isNumberedItem && // 确保带圈数字项不被识别为副标题
        (/^(宜：|忌：)/.test(paragraph) || // 宜忌标题
        (/^(\d+[\.、])/.test(paragraph) && !isMainTitle) || // 数字+点/顿号开头
        /^(短期|中期|长期)/.test(paragraph) || // 时间段标题
        (
          !isMainTitle && 
          !(/^-\s/.test(paragraph)) && // 不以连字符开头
          /^(现状|分析|解析|若问|总体|趋势|建议|宜忌|关系|阻碍|事业|感情|财运|发展|教育|健康|化解|行动|风水|结论|备注)/.test(paragraph) && 
          paragraph.length < 25 // 限制长度，避免误判
        ));
        
      // 检查是否为连字符开头的列表项
      const isBulletItem = /^-\s/.test(paragraph);
      
      if (isMainTitle) {
        // 主标题
        return (
          <h3 
            key={index} 
            className={`font-bold mt-4 mb-2 ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}
          >
            {paragraph}
          </h3>
        );
      } else if (isSubTitle) {
        // 副标题(包括宜忌标题)统一处理 - 增加font-semibold使其比普通文本更粗
        return (
          <h4 
            key={index} 
            className={`font-semibold mt-4 mb-2 ${theme === 'chinese' ? 'text-chineseRed/90' : 'text-water/90'}`}
          >
            {paragraph}
          </h4>
        );
      } else if (isNumberedItem || isBulletItem) {
        // 带圈数字或连字符的项目
        return (
          <p key={index} className="text-iosText dark:text-iosDarkText mb-2 ml-4 leading-relaxed">
            {paragraph}
          </p>
        );
      } else {
        // 普通段落
        return (
          <p key={index} className="text-iosText dark:text-iosDarkText mb-3 leading-relaxed">
            {paragraph}
          </p>
        );
      }
    });
  };
  
  return (
    <div className="bg-iosCard dark:bg-iosDarkCard rounded-ios-lg shadow-ios mb-24 overflow-hidden">
      <div className="p-5">
        {/* 标题部分 */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-iosSeparator dark:border-iosDarkSeparator">
          <button 
            onClick={navigateBack}
            className="p-2 -m-2 text-iosSecondary dark:text-iosDarkSecondary"
            aria-label="返回"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <h2 className={`text-xl font-semibold mx-auto ${theme === 'chinese' ? 'text-chineseRed' : 'text-water'}`}>
            详细解读
          </h2>
          
          <div className="w-5"></div> {/* 为了对称的空元素 */}
        </div>
        
        {/* 内容部分 */}
        <div className="mb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'chinese' ? 'border-chineseRed' : 'border-water'}`}></div>
              <p className="mt-4 text-iosSecondary dark:text-iosDarkSecondary">
                正在解读...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-ios">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className={`mt-3 px-4 py-2 rounded-ios text-white ${theme === 'chinese' ? 'bg-chineseRed' : 'bg-water'}`}
              >
                重试
              </button>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {currentResult?.query && (
                <div className="mb-6 p-4 bg-iosBg dark:bg-iosDarkBg rounded-ios">
                  <h3 className="text-sm font-medium mb-2 text-iosSecondary dark:text-iosDarkSecondary">
                    占问:
                  </h3>
                  <p className="text-iosText dark:text-iosDarkText">{currentResult.query}</p>
                </div>
              )}
              
              <div className="mt-4">
                {formatAIReading(aiReading)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIReadingResult; 