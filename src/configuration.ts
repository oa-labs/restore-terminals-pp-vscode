import * as vscode from "vscode";
import { Configuration, JsonConfiguration, TerminalWindow } from "./model";

import * as path from "path";

export async function getConfiguration(): Promise<Configuration> {
  const keepExistingTerminalsOpen: boolean | undefined =
    vscode.workspace
      .getConfiguration("turboCharger")
      .get("keepExistingTerminalsOpen") ??
    vscode.workspace
      .getConfiguration("restoreTerminals")
      .get("keepExistingTerminalsOpen");

  const artificialDelayMilliseconds: number | undefined =
    vscode.workspace
      .getConfiguration("turboCharger")
      .get("artificialDelayMilliseconds") ??
    vscode.workspace
      .getConfiguration("restoreTerminals")
      .get("artificialDelayMilliseconds");

  const terminalWindows: TerminalWindow[] | undefined =
    vscode.workspace.getConfiguration("turboCharger").get("terminals") ??
    vscode.workspace.getConfiguration("restoreTerminals").get("terminals");

  const runOnStartup: boolean | undefined =
    vscode.workspace.getConfiguration("turboCharger").get("runOnStartup") ??
    vscode.workspace.getConfiguration("restoreTerminals").get("runOnStartup");

  const configFromFile = await getConfigurationFromJsonFile();
  return {
    keepExistingTerminalsOpen:
      configFromFile?.keepExistingTerminalsOpen ?? keepExistingTerminalsOpen,
    artificialDelayMilliseconds:
      configFromFile?.artificialDelayMilliseconds ??
      artificialDelayMilliseconds,
    terminalWindows: configFromFile?.terminalWindows ?? terminalWindows,
    runOnStartup: configFromFile?.runOnStartup ?? runOnStartup,
  };
}

async function getConfigurationFromJsonFile(): Promise<
  Configuration | undefined
> {
  const { workspaceFolders } = vscode.workspace;

  if (!workspaceFolders) {
    return undefined;
  }
  let configData: JsonConfiguration | undefined;
  //find any workspace with the config
  for (const folder of workspaceFolders) {
    for (const configFileName of [
      "turbo-charger.json",
      "restore-terminals.json",
    ]) {
      try {
        const configFilePath = vscode.Uri.file(
          path.join(folder.uri.fsPath, ".vscode", configFileName),
        );
        const fileData = await vscode.workspace.fs.readFile(configFilePath);
        const fileDataString = new TextDecoder("utf-8").decode(fileData);
        configData = JSON.parse(fileDataString);
        break;
      } catch (error) {
        if (configFileName === "restore-terminals.json") {
          console.log("No config in workspace", folder, error);
        }
      }
    }
  }
  if (!configData) return undefined;
  return {
    ...configData,
    terminalWindows: configData?.terminals, //shim
  };
}
