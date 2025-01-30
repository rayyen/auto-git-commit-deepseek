import OpenAI from "openai";
import { extractCommitMessage } from "../libs/utils";
import { AIConfig } from "../models/types";

export class AIService {
  private readonly BASE_URL = "https://api.deepseek.com";

  constructor(private apiKey: string, private config: AIConfig) {}

  async generateCommitMessage(question: string): Promise<string> {
    const openai = new OpenAI({
      baseURL: this.config.url,
      apiKey: this.apiKey,
    });

    const response = await openai.chat.completions.create({
      model: this.config.model,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      messages: [
        {
          role: "system",
          content: question,
        },
      ],
    });

    return extractCommitMessage(
      response.choices[0].message.content === null
        ? ""
        : response.choices[0].message.content
    );
  }
}
