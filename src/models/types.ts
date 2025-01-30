export interface CommitMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type DiffFilterOptions = {
  excludeFiles?: string[];
  excludePatterns?: RegExp[];
  forceTruncat: boolean;
};

export type GitOptions = {
  autoPush: boolean;
  autoAdd: boolean;
  maxPossibleToken: number;
  chineseRatio: number;
  englishRatio: number;
  safetyMargin: number;
}

export type AIConfig = {
  url: string;
  model: string;
  temperature: number;
  maxTokens: number;
};