import * as vscode from "vscode";
import OpenAI from "openai";
export function activate(context: vscode.ExtensionContext) {
  const secretStorage = context.secrets;
  let apiKey: string | undefined;
  const API_KEY_NAME = "deepSeekApiKey";

  let setApiKeyCommand = vscode.commands.registerCommand(
    "extension.setApiKey",
    async () => {
      apiKey = await secretStorage.get(API_KEY_NAME);
      if (!apiKey) {


        // Prompt the user to enter their API key
        apiKey = await vscode.window.showInputBox({
          prompt: "Enter your DeepSeek API key",
          password: true, // Hide the input for security
        });

        if (apiKey) {
          // Store the API key in secret storage
          await context.secrets.store(API_KEY_NAME, apiKey);
          vscode.window.showInformationMessage("API key saved successfully!");
        } else {
          vscode.window.showErrorMessage("No API key provided.");
        }
      }
    }
  );

  let generateCommitMessage = vscode.commands.registerCommand(
    "extension.generateCommitMessage",
    async () => {
      apiKey = await secretStorage.get(API_KEY_NAME);
      if (!apiKey) {
        apiKey = await vscode.commands.executeCommand("extension.setApiKey");
        if (!apiKey) {
          vscode.window.showErrorMessage("API key is required to generate commit messages.");
          return;
        }
      }
      context.subscriptions.push(setApiKeyCommand);
      const openai = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: apiKey,
      });

      // 檢查是否有打開的 Git 倉庫
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
      }

      // 獲取 Git 擴展 API
      const gitExtension =
        vscode.extensions.getExtension("vscode.git")?.exports;
      if (!gitExtension) {
        vscode.window.showErrorMessage("Git extension not found.");
        return;
      }

      const git = gitExtension.getAPI(1);
      const repository = git.repositories[0];
      if (!repository) {
        vscode.window.showErrorMessage("No Git repository found.");
        return;
      }

      // 獲取變更的文件內容
      const changes = await repository.diff(true);
      const formattedChanges = changes
        .split("\n")
        .filter((line: string) => line.startsWith("+") || line.startsWith("-"))
        .join("\n");

      try {
        const response = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `產生符合Angular Commit Message Guidelines的git commit 中文內容 ${formattedChanges}`,
            },
          ],
          model: "deepseek-chat",
        });

        // 格式化 Commit 訊息
        const commitMessage = extractCodeBlocks(
          response.choices[0].message.content
        );
        vscode.window.showInformationMessage(
          `Generated Commit Message: ${commitMessage[0]}`
        );

        // 自動填入 Commit Message
        repository.inputBox.value = commitMessage[0];
        await repository.add(['.']);
        await repository.commit(commitMessage[0]);
        await repository.push();
      } catch (error) {
        if (error instanceof OpenAI.APIError) {
          vscode.window.showErrorMessage(`API Error: ${error.message}`);
        } else {
          vscode.window.showErrorMessage(`Unexpected Error: ${error}`);
        }
        console.error(error);
      }
    }
  );

  context.subscriptions.push(setApiKeyCommand, generateCommitMessage);
}
// 格式化 Commit 訊息以符合 Angular 規範
function extractCodeBlocks(text: string | null): string[] {
  if (text === null) {
    return ["undefined"];
  }
  // 使用正則表達式匹配以 ``` 開頭和 ``` 結尾的部分
  const regex = /```([\s\S]*?)```/g;
  const matches = [];
  let match;

  // 使用 exec 方法遍歷所有匹配結果
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim()); // 提取匹配的內容並去除空白
  }

  return matches;
}

export function deactivate() {}
