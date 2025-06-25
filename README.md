# vscode-chatbot README

This is the README for your extension "vscode-chatbot". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

# 💬 VS Code AI Chat Assistant

An AI-powered chat assistant integrated directly into Visual Studio Code. Designed for developers, this extension allows you to ask questions, generate code, and even reference files from your workspace using `@filename` mentions.

Built with React, Gemini API, and VS Code Extension API.

---

## ✨ Features

- 🧠 **AI-Powered Code Generation**

  - Ask questions or request code snippets using natural language.
  - Powered by Gemini (Google's LLM).

- 📁 **File Context via `@filename`**

  - Mention workspace files with `@filename`.
  - Automatically injects the file's contents into your prompt for more accurate AI responses.

- 🧠 **Smart Markdown Rendering**

  - AI responses support markdown and syntax-highlighted code blocks.

- 🔍 **Autocomplete for Files**

  - Get intelligent suggestions when typing `@` for quick file references.

- 💬 **Modern React UI**
  - Chat interface built with React and rendered inside a VS Code WebView.

---

## 🚀 Getting Started

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/your-username/vscode-chatbot.git
cd vscode-chatbot
npm install
```

### 2. Build the React UI

```bash
cd chatbot-ui
npm install
npm run build
```

### 3. Add your Gemini API Key

Create a `.env` file in the root:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Launch the extension

In VS Code, press `F5` to open a new Extension Development Host. Then run the command:

```
> Ask Chatbot
```

---

## 🖼️ Screenshots

> (Add demo screenshots or animations here)

---

## 🧰 Tech Stack

- **TypeScript** – Primary language
- **React** – For rendering UI in WebView
- **Vite** – Fast React build setup
- **Gemini API** – AI text generation
- **VS Code Extension API** – Integration into editor

---

## 📌 TODO

- [ ] Add image preview support for `@image.png`
- [ ] Improve context summarization for large files
- [ ] Chat history persistence

---

## 🤝 Contributing

PRs and suggestions welcome!

---

## 📜 License

MIT

---

Built with ❤️ to simplify your coding workflow.
