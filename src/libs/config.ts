import * as vscode from "vscode";
import { AIConfig, DiffFilterOptions, GitOptions } from "../models/types";

const DEFAULT_CONFIG: AIConfig = {
  url: "https://api.deepseek.com",
  model: "deepseek-chat",
  temperature: 0.7,
  maxTokens: 500
};

export class ConfigManager {
  private readonly API_KEY_NAME = "deepSeekApiKey";

  constructor(private readonly context: vscode.ExtensionContext) {}

  async getApiKey(): Promise<string> {
    let apiKey = await this.context.secrets.get(this.API_KEY_NAME);
    if (!apiKey) {
      apiKey = await this.promptForApiKey();
    }
    return apiKey;
  }

  async getAIConfig(): Promise<AIConfig> {
    const config = vscode.workspace.getConfiguration("deepseekCommit");
    return {
      url: config.get("url", DEFAULT_CONFIG.url),
      model: config.get("model", DEFAULT_CONFIG.model),
      temperature: config.get("temperature", DEFAULT_CONFIG.temperature),
      maxTokens: config.get("maxTokens", DEFAULT_CONFIG.maxTokens)
    };
  }

  private async promptForApiKey(): Promise<string> {
    const apiKey = await vscode.window.showInputBox({
      prompt: "Enter your DeepSeek API key",
      password: true
    });

    if (!apiKey) {throw new Error("API key required");}

    await this.context.secrets.store(this.API_KEY_NAME, apiKey);
    return apiKey;
  }

  async getDiffFilterOptions(): Promise<DiffFilterOptions> {
    const config = vscode.workspace.getConfiguration("deepseekCommit");
    return {
      excludeFiles: config.get<string[]>("excludeFiles", []),
      excludePatterns: this.parsePatterns(
        config.get<string[]>("excludePatterns", [])
      ),
      forceTruncat: config.get("forceTruncat", true)
    };
  }
  
  async getGitOptions(): Promise<GitOptions> {
    const config = vscode.workspace.getConfiguration("deepseekCommit");
    return {
      autoPush: config.get("autoPush", true),
      autoAdd: config.get("autoAdd", true),
      maxPossibleToken: config.get("maxPossibleToken", 32768),
      chineseRatio: config.get("chineseRatio", 0.6),
      englishRatio: config.get("englishRatio", 0.3),
      safetyMargin: config.get("safetyMargin", 0.9)
    };
  }

  private parsePatterns(patterns: string[]): RegExp[] {
    return patterns.map(pattern => {
      try {
        // 将用户输入的字符串转换为正则表达式
        // 示例输入："test.*" → /test.*/
        return new RegExp(pattern.trim());
      } catch (error) {
        vscode.window.showErrorMessage(`无效的正则表达式模式: ${pattern}`);
        return /$^/; // 返回不匹配任何内容的正则表达式
      }
    });
  }
}