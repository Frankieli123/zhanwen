import { HexagramInfo, DivinationResult } from '../types';
import { db } from '../utils/db'; // 导入数据库操作
import { logService } from './logService'; // 导入日志服务

// DeepSeek API配置
const DEEPSEEK_API_URL = process.env.REACT_APP_API_URL || 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = process.env.REACT_APP_API_KEY || 'sk-052946e9f1cd46fcb5af103c6033220c';

// 调试模式 - 控制是否记录API交互日志
const DEBUG_MODE = process.env.NODE_ENV === 'development';

// 请求接口
interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  stream: boolean;
  temperature?: number;
  max_tokens?: number;
}

// 响应接口
interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 将五行英文名称转换为中文
 */
const convertElementToChinese = (element: string): string => {
  switch (element) {
    case 'wood': return '木';
    case 'fire': return '火';
    case 'earth': return '土';
    case 'metal': return '金';
    case 'water': return '水';
    default: return element || '未知';
  }
};

/**
 * 生成卦象解读的提示模板
 */
const generatePrompt = (result: DivinationResult): string => {
  const hexagram = result.hexagram;
  const threePalaces = result.threePalaces;

  let prompt = `我需要你根据以下小六壬卦象信息，提供一个详细的解读。\n`;

  // 添加起卦时间信息
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

  // 用户问题
  if (result.query) {
    prompt += `\n用户占问: ${result.query}\n`;
  }

  // 三宫卦信息
  if (threePalaces) {
    prompt += `\n三宫卦信息：
天宫: ${threePalaces.skyPalace.hexagram.name} (五行:${convertElementToChinese(threePalaces.skyPalace.hexagram.element)}) (六神:${threePalaces.skyPalace.hexagram.sixGod || '未知'})
地宫: ${threePalaces.earthPalace.hexagram.name} (五行:${convertElementToChinese(threePalaces.earthPalace.hexagram.element)}) (六神:${threePalaces.earthPalace.hexagram.sixGod || '未知'})
人宫: ${threePalaces.humanPalace.hexagram.name} (五行:${convertElementToChinese(threePalaces.humanPalace.hexagram.element)}) (六神:${threePalaces.humanPalace.hexagram.sixGod || '未知'})
`;
  }

  prompt += `\n请给出详细的解读，包括以下内容：
1. 卦象综合解析（包括三宫关系和互动的深层含义）
2. 对用户问题的针对性回答（如果有问题）
3. 宜忌建议
4. 未来发展趋势
5. 化解方法或行动建议
如果是标题，请用中文数字+顿号开头，如“一、”；副标题，请用中文数字+.开头，如“1.”；内容，如果有顺序请用如“①②③④⑤⑥⑦⑧⑨⑩” 无顺序用“-”
`;

  return prompt;
}

/**
 * 调用DeepSeek API获取卦象详细解读
 */
export const getAIHexagramReading = async (result: DivinationResult): Promise<string> => {
  // 如果结果已经包含解读内容，直接返回而不重新获取
  if (result.aiReading) {
    console.log('apiService: 结果已包含解读内容，直接使用现有内容');
    return result.aiReading;
  }

  console.log('apiService: 开始获取解读内容');

  try {
    // 先尝试从数据库中查找已有的解读
    try {
      const savedResult = await db.getDivinationResultById(result.id);
      if (savedResult && savedResult.aiReading) {
        console.log('apiService: 在数据库中找到了已有的解读内容');
        // 更新当前结果对象
        result.aiReading = savedResult.aiReading;
        return savedResult.aiReading;
      }
    } catch (dbError) {
      console.error('Error checking database for existing reading:', dbError);
      // 继续尝试获取新的解读
    }

    const prompt = generatePrompt(result);

    const request: DeepSeekRequest = {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一名经验丰富的易学专家，精通小六壬占卜的解读和应用。你有多年研究传统中国预测学的经验，能够从卦象中解读出深刻的含义并给予有益的指导。' },
        { role: 'user', content: prompt }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 3000
    };

    // 记录API请求日志
    const logId = logService.logRequest({
      url: DEEPSEEK_API_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer [API_KEY_HIDDEN]'
      },
      body: request
    });

    // 调试日志
    if (DEBUG_MODE) {
      console.log('=== API请求数据 ===');
      console.log(JSON.stringify(request, null, 2));
      console.log('==================\n');
    }

    console.log(`apiService: 调用DeepSeek API (${DEEPSEEK_API_URL})`);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API返回错误:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // 记录错误
      logService.logError(logId, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();

    // 记录API响应日志
    logService.logResponse(logId, data);

    // 调试日志
    if (DEBUG_MODE) {
      console.log('=== API响应数据 ===');
      console.log(JSON.stringify(data, null, 2));
      console.log('==================\n');
    }

    const readingContent = data.choices[0].message.content;

    // 保存解读结果到数据库
    try {
      // 更新结果对象
      const updatedResult = {
        ...result,
        aiReading: readingContent
      };

      console.log('apiService: 解读内容获取成功，保存到数据库');

      // 更新数据库中的记录
      await db.updateDivinationResult(updatedResult);
    } catch (dbError) {
      console.error('Error updating divination result with AI reading:', dbError);
      // 即使数据库更新失败，仍然返回解读内容给用户
    }

    return readingContent;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};