export interface CommitMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type DiffFilterOptions = {
  excludeFiles?: string[];
  excludePatterns?: RegExp[];
};

export type AIConfig = {
  exludeFiles: string[];
  excludePatterns: string;
  url: string;
  model: string;
  temperature: number;
  maxTokens: number;
};