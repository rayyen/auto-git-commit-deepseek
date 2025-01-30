import * as vscode from "vscode";
import { GitOptions } from "../models/types";
import { Repository } from "../models/git";

export class GitService {
  private gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;

  async getRepository(): Promise<Repository> {
    if (!this.gitExtension) {
      throw new Error("Git extension not found");
    }

    const git = this.gitExtension.getAPI(1);

    if (!git.repositories.length) {
      throw new Error(
        "Nothing to commit or No Git repository found, try git add . ?"
      );
    }

    return git.repositories[0];
  }

  async getStagedDiff(
    repository: Repository,
    options: GitOptions
  ): Promise<string> {
    let d = await repository.diff(true);
    await repository.status();
    console.log(d);
    if (d === "" && options.autoPush) {
      const add = `${repository.rootUri.path}/*`;
      await repository.add([add]);
    }
    d = await repository.diff(true);
    console.log(d);
    return d;
  }

  async commitAndPush(repository: Repository, message: string): Promise<void> {
    repository.inputBox.value = message;
    await repository.commit(message);

    const config = vscode.workspace.getConfiguration("deepseekCommit");
    if (config.get("autoPush", true)) {
      await repository.push();
    }
  }
}
