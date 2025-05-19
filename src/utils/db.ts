import Dexie, { Table } from 'dexie';
import { DivinationResult } from '../types';
import CryptoJS from 'crypto-js';

// 加密密钥 (实际应用中应该使用更安全的方式管理)
const ENCRYPTION_KEY = 'divination-app-secure-key';

// 定义数据库类
export class DivinationDatabase extends Dexie {
  divinationResults!: Table<DivinationResult>;
  
  constructor() {
    super('DivinationDatabase');
    
    // 定义数据库结构
    this.version(1).stores({
      divinationResults: 'id, timestamp, hexagram.name, isTimeHexagram'
    });
    
    // 更新数据库结构，支持三宫卦
    this.version(2).stores({
      divinationResults: 'id, timestamp, hexagram.name, isTimeHexagram'
    }).upgrade(tx => {
      // 升级数据库时不需要修改已有数据，因为我们使用了可选字段
      console.log('Database upgraded to version 2');
    });
    
    // 更新数据库结构，支持详细解读内容
    this.version(3).stores({
      divinationResults: 'id, timestamp, hexagram.name, isTimeHexagram'
    }).upgrade(tx => {
      console.log('Database upgraded to version 3, supporting AI readings');
    });
  }
  
  // 加密数据
  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  }
  
  // 解密数据
  private decryptData(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  
  // 添加卦象记录（加密存储）
  async addDivinationResult(result: DivinationResult): Promise<string> {
    // 保存原始ID
    const resultId = result.id;
    
    // 加密敏感字段
    const encryptedResult: DivinationResult = {
      ...result,
      query: result.query ? this.encryptData(result.query) : undefined,
      notes: result.notes ? this.encryptData(result.notes) : undefined,
      aiReading: result.aiReading ? this.encryptData(result.aiReading) : undefined
    };
    
    try {
      await this.divinationResults.add(encryptedResult);
      return resultId;
    } catch (error) {
      console.error('Error adding divination result:', error);
      throw error;
    }
  }
  
  // 获取所有卦象记录（解密敏感字段）
  async getAllDivinationResults(): Promise<DivinationResult[]> {
    try {
      const results = await this.divinationResults.toArray();
      
      // 解密敏感字段
      return results.map(result => ({
        ...result,
        query: result.query ? this.decryptData(result.query) : undefined,
        notes: result.notes ? this.decryptData(result.notes) : undefined,
        aiReading: result.aiReading ? this.decryptData(result.aiReading) : undefined
      }));
    } catch (error) {
      console.error('Error getting divination results:', error);
      throw error;
    }
  }
  
  // 根据ID获取卦象记录
  async getDivinationResultById(id: string): Promise<DivinationResult | undefined> {
    try {
      const result = await this.divinationResults.get(id);
      
      if (!result) return undefined;
      
      // 解密敏感字段
      return {
        ...result,
        query: result.query ? this.decryptData(result.query) : undefined,
        notes: result.notes ? this.decryptData(result.notes) : undefined,
        aiReading: result.aiReading ? this.decryptData(result.aiReading) : undefined
      };
    } catch (error) {
      console.error('Error getting divination result by ID:', error);
      throw error;
    }
  }
  
  // 更新卦象记录
  async updateDivinationResult(result: DivinationResult): Promise<void> {
    // 加密敏感字段
    const encryptedResult: DivinationResult = {
      ...result,
      query: result.query ? this.encryptData(result.query) : undefined,
      notes: result.notes ? this.encryptData(result.notes) : undefined,
      aiReading: result.aiReading ? this.encryptData(result.aiReading) : undefined
    };
    
    try {
      await this.divinationResults.update(result.id, encryptedResult);
    } catch (error) {
      console.error('Error updating divination result:', error);
      throw error;
    }
  }
  
  // 删除卦象记录
  async deleteDivinationResult(id: string): Promise<void> {
    try {
      await this.divinationResults.delete(id);
    } catch (error) {
      console.error('Error deleting divination result:', error);
      throw error;
    }
  }
  
  // 清空所有记录
  async clearAllDivinationResults(): Promise<void> {
    try {
      await this.divinationResults.clear();
    } catch (error) {
      console.error('Error clearing divination results:', error);
      throw error;
    }
  }
}

// 创建并导出数据库实例
export const db = new DivinationDatabase(); 