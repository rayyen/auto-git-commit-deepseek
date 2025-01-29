import * as vscode from "vscode";

export class GitService {
  private gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;

  async getRepository(): Promise<any> {
    if (!this.gitExtension) {
      throw new Error("Git extension not found");
    }

    const git = this.gitExtension.getAPI(1);
    if (!git.repositories.length) {
      throw new Error("Nothing to commit or No Git repository found");
    }

    return git.repositories[0];
  }

  async getStagedDiff(repository: any): Promise<string> {
    return repository.diff(true);
  }

  async commitAndPush(repository: any, message: string): Promise<void> {
    repository.inputBox.value = message;
    await repository.commit(message);

    const config = vscode.workspace.getConfiguration("deepseekCommit");
    if (config.get("autoPush", true)) {
      await repository.push();
    }
  }
}
