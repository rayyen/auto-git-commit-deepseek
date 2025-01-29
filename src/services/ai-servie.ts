import OpenAI from "openai";
import { extractCommitMessage } from "../libs/utils";
import { AIConfig } from "../models/types";

export class AIService {
  private readonly BASE_URL = "https://api.deepseek.com";

  constructor(private apiKey: string, private config: AIConfig) {}

  async generateCommitMessage(diff: string, language: string): Promise<string> {
    const openai = new OpenAI({
      baseURL: this.BASE_URL,
      apiKey: this.apiKey,
    });

    const response = await openai.chat.completions.create({
      model: this.config.model,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      messages: [
        {
          role: "system",
          content: this.buildPrompt(diff, language),
        },
      ],
    });

    return extractCommitMessage(
      response.choices[0].message.content === null
        ? ""
        : response.choices[0].message.content
    );
  }

  private buildPrompt(diff: string, language: string): string {
    return `
      You are an expert in generating Angular-style commit messages. Follow these rules:
      1. Format: <type>(<scope>): <subject>
      2. Types: feat|fix|docs|style|refactor|test|chore
      3. Use ${language} for message
      4. Focus on code changes:
         ${diff}
      5. Ignore formatting changes
      6. Keep subject under 72 characters
    `;
  }
}
