import * as vscode from "vscode";
import { AIConfig } from "../models/types";

const DEFAULT_CONFIG: AIConfig = {
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
}