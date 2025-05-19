// 临时API日志服务 - 用于开发调试，将在正式版本中移除

// 存储最近的API交互日志
type APILog = {
  id: string;
  timestamp: number;
  request: any;
  response: any;
  error?: any;
};

// 最多保存的日志条数
const MAX_LOGS = 10;

class LogService {
  private logs: APILog[] = [];
  private enabled: boolean = false;
  
  // 启用或禁用日志记录
  setEnabled(value: boolean): void {
    this.enabled = value;
    console.log(`API日志记录功能已${value ? '启用' : '禁用'}`);
    
    // 如果禁用，清空所有日志
    if (!value) {
      this.clearLogs();
    }
  }
  
  // 获取日志记录状态
  isEnabled(): boolean {
    return this.enabled;
  }
  
  // 添加API请求日志
  logRequest(request: any): string {
    if (!this.enabled) return '';
    
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const log: APILog = {
      id,
      timestamp: Date.now(),
      request,
      response: null
    };
    
    this.logs.unshift(log);
    this.trimLogs();
    
    console.log('[API日志] 记录请求:', request);
    return id;
  }
  
  // 添加API响应日志
  logResponse(id: string, response: any): void {
    if (!this.enabled) return;
    
    const log = this.logs.find(l => l.id === id);
    if (log) {
      log.response = response;
      console.log('[API日志] 记录响应:', response);
    }
  }
  
  // 添加错误日志
  logError(id: string, error: any): void {
    if (!this.enabled) return;
    
    const log = this.logs.find(l => l.id === id);
    if (log) {
      log.error = error;
      console.log('[API日志] 记录错误:', error);
    }
  }
  
  // 获取所有日志
  getLogs(): APILog[] {
    return [...this.logs];
  }
  
  // 清空所有日志
  clearLogs(): void {
    this.logs = [];
    console.log('[API日志] 日志已清空');
  }
  
  // 保持日志数量不超过最大值
  private trimLogs(): void {
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }
  }
}

// 创建单例
export const logService = new LogService(); 