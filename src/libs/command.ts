import * as vscode from "vscode";
import { ConfigManager } from "./config";
import { DiffProcessor } from "./diff";
import { handleError } from "./utils";
import { AIService } from "../services/ai-servie";
import { GitService } from "../services/git-servie";

export function registerCommands(
  context: vscode.ExtensionContext,
  configManager: ConfigManager
) {
  const gitService = new GitService();
  const outputChannel = vscode.window.createOutputChannel("DeepSeek Commit");

  context.subscriptions.push(
    vscode.commands.registerCommand("deepseek.generateCommit", async () => {
      try {
        const [apiKey, aiConfig] = await Promise.all([
          configManager.getApiKey(),
          configManager.getAIConfig()
        ]);

        const repo = await gitService.getRepository();
        const rawDiff = await gitService.getStagedDiff(repo);
        const processedDiff = DiffProcessor.process(rawDiff);
        
        if(processedDiff==='') {throw new Error("Nothing to commit");}
        const language = vscode.workspace.getConfiguration("deepseekCommit")
          .get("language", vscode.env.language);

        const aiService = new AIService(apiKey, aiConfig);
        const commitMessage = await aiService.generateCommitMessage(
          processedDiff, 
          language
        );

        await gitService.commitAndPush(repo, commitMessage);
        outputChannel.appendLine(`Successfully committed: ${commitMessage}`);
        outputChannel.show();
        vscode.window.showInformationMessage(`Successfully committed: ${commitMessage}`);

      } catch (error) {
        const result = handleError(error);
        outputChannel.appendLine(`Error: ${result.error}`);
        vscode.window.showErrorMessage(result.error!);
      }
    }),

    vscode.commands.registerCommand("deepseek.clearApiKey", async () => {
      await context.secrets.delete("deepSeekApiKey");
      vscode.window.showInformationMessage("API key cleared successfully");
    })
  );
}