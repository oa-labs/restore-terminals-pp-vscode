# Terminal Turbo Charger

Automatically spawn integrated terminal windows and split terminals, and run any shell commands when VSCode starts up!

## How to use

Simply configure your VSCode settings JSON file to look something like this:

```
 "turboCharger.runOnStartup": true,
 "turboCharger.terminals": [
    {
      "location": "editor",
      "splitTerminals": [
        {
          "name": "server",
          "commands": ["cd server", "npm i", "npm run dev"],
          "icon": "test-view-icon",
          "color": "terminal.ansiYellow",
        },
        {
          "name": "client",
          "commands": ["cd client","npm run dev"],
          "icon": "comment-discussion",
          "color": "terminal.ansiGreen"
        },
        {
          "name": "test",
          "commands": ["jest --watch"],
          "icon": "activate-breakpoints",
          "color": "terminal.ansiBlue"
        }
      ]
    },
    {
      "splitTerminals": [
        {
          "name": "build & e2e",
          "commands": ["npm run eslint", "npm run build", "npm run e2e"],
          "shouldRunCommands": false
        },
        {
          "name": "worker",
          "commands": ["npm-run-all --parallel redis tsc-watch-start worker"]
        }
      ]
    }
  ]
```

The outer array represents a integrated VSCode terminal window, and the `splitTerminals` array contains the information about how each terminal window should be split up. The extension will first read from `turboCharger` settings and then fall back to `restoreTerminals` for a few releases.

## Configuration Reference

### Terminal Window
Top-level objects in `turboCharger.terminals` (preferred) or `restoreTerminals.terminals` (legacy).
- `splitTerminals`: (Required) Array of terminal split configurations.
- `location`: (Optional) Where to open the terminal. Values: `"panel"` (default), `"editor"`, or `"view"`.

### Split Terminal
Objects inside `splitTerminals`.
- `name`: (Optional) Terminal name.
- `commands`: (Optional) Array of string commands to run.
- `shouldRunCommands`: (Optional) Boolean. If `false`, commands are pasted but not executed.
- `icon`: (Optional) ID of a VS Code icon (e.g. `"zap"`).
- `color`: (Optional) Terminal color ID (e.g. `"terminal.ansiRed"`).

You can also use a custom config file. The preferred file is `.vscode/turbo-charger.json` in any workspace you want. The legacy file `.vscode/restore-terminals.json` is still supported for a few releases but is deprecated. If a config file is present, the extension will try and load settings from it first, then use `settings.json` as a fallback. A sample legacy config file is [here](https://github.com/EthanSK/restore-terminals-vscode/blob/master/sample-test-project/.vscode/restore-terminals.json).

## Migration

- Update settings keys from `restoreTerminals.*` to `turboCharger.*`.
- If you use a workspace config file, rename `.vscode/restore-terminals.json` to `.vscode/turbo-charger.json`.
- The legacy `restoreTerminals.*` settings and `.vscode/restore-terminals.json` will be removed after a few releases.

## Extra info

The order of split terminals from left to right is the order in the array.

You can manually trigger the restoration of terminals by running `Restore Terminals` in the command palette.

If you find the extension glitching out, try increasing the `restoreTerminals.artificialDelayMilliseconds` setting to a higher number, such as `1000`.

If you do not want this extension to close the currently open terminal windows, you can simply set `restoreTerminals.keepExistingTerminalsOpen` to `true`.

If you do not want it to restore terminals on VSCode startup, but instead only run when you trigger it manually from the command palette, then set `restoreTerminals.runOnStartup` to `false`.

If you don't want the commands to actually run, just be pasted in the terminal, then set `shouldRunCommands` to `false` in each `splitTerminals` object.

If you don't like using split terminals, then just provide one object in each split terminal array, which should be the intuitive thing to do.

**Enjoy!**
