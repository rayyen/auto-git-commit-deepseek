import { CommitMessageResponse } from "../models/types";


export function extractCommitMessage(response: string): string {
  const codeBlocks = extractCodeBlocks(response);
  return codeBlocks.length > 0 ? codeBlocks[0] : response.split('\n')[0];
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