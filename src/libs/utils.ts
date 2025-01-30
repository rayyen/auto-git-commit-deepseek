import { CommitMessageResponse } from "../models/types";

export function extractCommitMessage(response: string): string {
  const codeBlocks = extractCodeBlocks(response);
  return codeBlocks.length > 0 ? codeBlocks[0] : response.split("\n")[0];
}

function extractCodeBlocks(text: string): string[] {
  const regex = /```[\s\S]*?\n([\s\S]*?)\n```/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }

  return matches;
}

export function handleError(error: unknown): CommitMessageResponse {
  if (error instanceof Error) {
    console.error(error);
    return { success: false, error: error.message };
  }
  return { success: false, error: "Unknown error occurred" };
}



export function buildPrompt(diff: string, language: string): string {
  return `
    generate Angular-style commit messages.Follow these rules:
    1. Format: <type>(<scope>): <subject>
    2. Types: feat|fix|docs|style|refactor|test|chore
    3. Use ${language} for message
    4. Focus on code changes:
       ${diff}
    5. Ignore formatting changes
    6. Keep subject under 72 characters
  `;
}
