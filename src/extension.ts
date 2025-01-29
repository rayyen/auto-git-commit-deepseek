import * as vscode from "vscode";
import { ConfigManager } from "./libs/config";
import { registerCommands } from "./libs/command";


export function activate(context: vscode.ExtensionContext) {
  const configManager = new ConfigManager(context);
  registerCommands(context, configManager);
}

export function deactivate() {}