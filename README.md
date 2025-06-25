# VS Code AI Chat Assistant

VS Code AI Chat Assistant is a developer-focused extension that brings Gemini-powered AI directly into your Visual Studio Code workspace. It enables contextual conversations, in-editor file-aware prompts, and intelligent code generation, all from a sleek React-based interface.

---

## Features

- **AI-Powered Code Generation**  
  Interact with Gemini (Google's LLM) to generate code, answer technical questions, or provide explanations.

- **Context-Aware File Integration**  
  Use `@filename` to reference files in your workspace. The assistant reads and includes file content in the prompt automatically.

- **Autocomplete for Files**  
  Start typing `@` to trigger intelligent file suggestions from the workspace.

- **Syntax-Highlighted Markdown Rendering**  
  Responses are rendered with full markdown and language-specific syntax highlighting.

- **Modern In-Editor Chat Interface**  
  Built with React and rendered inside a VS Code WebView for a seamless developer experience.

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/vscode-chatbot.git
   cd vscode-chatbot
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Build the frontend**

   ```bash
   cd chatbot-ui
   npm install
   npm run build
   ```

4. **Add your Gemini API key**

   Create a `.env` file at the root with the following:

   ```bash
   GEMINI_API_KEY=your-api-key-here
   ```

5. **Run the extension**

   - Open the project in VS Code
   - Press `F5` to launch the Extension Development Host
   - Run the command: `Ask Chatbot`

---

## Demo

> (Include demo video or screenshots here)

---

## Tech Stack

- TypeScript
- React + Vite
- Gemini API (via REST)
- VS Code Extension API
- WebView integration

---

## Roadmap

- [ ] Image preview rendering for `@image.png`
- [ ] File content summarization for large files
- [ ] Persistent chat threads
- [ ] Slash command support (`/explain`, `/reset`)

---

## License

MIT

---

## Author

Developed by [Yash Gupta](https://github.com/YashGupta2116)

---
