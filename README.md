# auto-git-commit-deepseek

a DeepSeek V3 powered VS Code extension, git 懶人專用, ctrl+shift+p 輸入 generateCommitMessage 即可

## Features

利用 [DeepSeek](https://www.deepseek.com/) 自動比對修改差異，依據[Angular commit format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md) 產生 git commit訊息並自動push

**git add .**

![1738129196418](image/README/1738129196418.png)

**Ctrl + Shift + p, generate commit message**
![1738129330842](image/README/1738129330842.png)

**結果範例**

![1738128627027](image/README/1738128627027.png)

## Requirements

* [DeepSeek](https://www.deepseek.com/) API Key
* 一定要先有upstream chagnes.

## Extension Settings

Adopt SecureStore, will ask for API Key if needed.

## Known Issues

Fail when exceed DeepSeek token limits

## Release Notes

### 1.0.0

Initial release of ...

### 1.0.1

Improve API Key input workflow

### 1.0.6

Generate different language according to vscode.env.language.

### 1.0.7

Default ingoring changes like 'import, png, jpg, gif' files
Remove some illeagal symbol, due to massive attack on DeepSeek server
