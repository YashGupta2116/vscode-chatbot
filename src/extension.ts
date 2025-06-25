import * as dotenv from 'dotenv';
import * as vscode from 'vscode';
import axios from 'axios';
import * as path from 'path';

dotenv.config();

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'vscode-chatbot.askChatbot',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'chatbot',
        'AI Chat Assistant',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'media'),
          ],
        }
      );

      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'main.js')
      );

      const styleUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'styles.css')
      );

      panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI Chat Assistant</title>
          <link href="${styleUri}" rel="stylesheet">
        </head>
        <body>
          <div id="root"></div>
          <script src="${scriptUri}"></script>
        </body>
        </html>
      `;

      panel.webview.onDidReceiveMessage(async (message) => {
        if (message.type === 'userMessage') {
          const userPrompt = message.text;

          try {
            const response = await axios.post(
              'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
                process.env.GEMINI_API_KEY,
              {
                contents: [{ parts: [{ text: userPrompt }] }],
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const reply =
              response.data.candidates?.[0]?.content?.parts?.[0]?.text ??
              '⚠️ No reply from Gemini.';

            panel.webview.postMessage({
              type: 'botReply',
              text: reply,
            });
          } catch (error) {
            console.error('Gemini API error:', error);
            panel.webview.postMessage({
              type: 'botReply',
              text: '⚠️ Failed to get response from Gemini API.',
            });
          }
        } else if (message.type === 'getFileContent') {
          const filePath = message.path;
          const originalInput = message.userInput;
          const workspaceFolder =
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

          if (!workspaceFolder) {
            panel.webview.postMessage({
              type: 'fileContent',
              path: filePath,
              originalInput,
              content: '⚠️ No workspace folder open.',
            });
            return;
          }

          const fullPath = vscode.Uri.file(
            path.join(workspaceFolder, filePath)
          );

          try {
            const fileContentBytes = await vscode.workspace.fs.readFile(
              fullPath
            );
            const fileContent = Buffer.from(fileContentBytes).toString('utf8');
            panel.webview.postMessage({
              type: 'fileContent',
              path: filePath,
              originalInput,
              content: fileContent,
            });
          } catch (err) {
            console.error('Failed to read file:', err);
            panel.webview.postMessage({
              type: 'fileContent',
              path: filePath,
              originalInput,
              content: '⚠️ Could not read file or file not found.',
            });
          }
        } else if (message.type === 'listFiles') {
          const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri;
          if (!workspaceFolder) {
            panel.webview.postMessage({
              type: 'fileList',
              files: [],
            });
            return;
          }

          try {
            const allFiles = await vscode.workspace.findFiles(
              '**/*.*',
              '**/node_modules/**',
              100
            );
            const prefix = message.prefix.toLowerCase();
            const matching = allFiles
              .map((uri) => vscode.workspace.asRelativePath(uri.fsPath))
              .filter((f) => f.toLowerCase().includes(prefix));
            panel.webview.postMessage({
              type: 'fileList',
              files: matching,
            });
          } catch (err) {
            console.error('Failed to list files:', err);
            panel.webview.postMessage({
              type: 'fileList',
              files: [],
            });
          }
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
