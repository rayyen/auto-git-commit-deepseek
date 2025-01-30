import { GitOptions } from "../models/types";

export class TextService {

  // 智能截断主逻辑
  smartTruncate(text: string, config: GitOptions ): string {
    const maxSafeTokens = config.maxPossibleToken * config.safetyMargin;
    let currentTokens = 0;
    let truncateIndex = 0;

    // 逐字符扫描
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      currentTokens += this.isChinese(char) 
        ? config.chineseRatio 
        : config.englishRatio;

      // 寻找最佳截断点
      if (currentTokens > maxSafeTokens) {
        truncateIndex = this.findBestTruncationPoint(text, i);
        break;
      }
    }

    return truncateIndex > 0 
      ? text.slice(0, truncateIndex) 
      : text;
  }

  // 查找最近的合适截断位置
  private findBestTruncationPoint(text: string, start: number): number {
    const truncationPriority = [
      { regex: /[。！？]/g, lookBehind: 200 },  // 优先句子结尾
      { regex: /[，；]/g, lookBehind: 100 },   // 其次逗号分隔
      { regex: /[\n]/g, lookBehind: 50 },     // 段落分隔
      { regex: /[\s]/g, lookBehind: 20 }      // 空格分隔
    ];

    for (const { regex, lookBehind } of truncationPriority) {
      const slice = text.slice(Math.max(0, start - lookBehind), start);
      const matches = [...slice.matchAll(regex)];
      if (matches.length > 0) {
        return start - lookBehind + (matches[matches.length-1].index || 0) + 1;
      }
    }
    return start; // 找不到则硬截断
  }

  // 中文检测
  private isChinese(char: string): boolean {
    return /[\u4e00-\u9fa5]/.test(char);
  }

  // 实时估算 Token 数
  estimateTokens(text: string, config: GitOptions): number {
    const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherCount = text.length - chineseCount;
    return Math.ceil(
      chineseCount * config.chineseRatio + 
      otherCount * config.englishRatio
    );
  }
}