import { useEffect, useRef, useState } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const vscode = window.acquireVsCodeApi();
function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const [fileSuggestions, setFileSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const sendMessage = () => {
        if (input.trim() === '')
            return;
        // Detect @filename syntax
        const fileMatch = input.match(/@([\w./\\-]+)/);
        if (fileMatch) {
            const filePath = fileMatch[1];
            vscode.postMessage({
                type: 'getFileContent',
                path: filePath,
                userInput: input,
            });
            return; // don't send the message yet
        }
        const newMessage = {
            from: 'user',
            text: input,
        };
        setMessages((prev) => [...prev, newMessage]);
        vscode.postMessage({ type: 'userMessage', text: input });
        setInput('');
    };
    useEffect(() => {
        const handleMessage = (event) => {
            const message = event.data;
            if (message.type === 'botReply') {
                setMessages((prev) => [...prev, { from: 'bot', text: message.text }]);
            }
            if (message.type === 'fileContent') {
                const fileText = message.content;
                const filePath = message.path;
                const originalInput = message.originalInput;
                const cleanedInput = originalInput.replace(/@([\w./\\-]+)/, '');
                const fullPrompt = `/* FILE: ${filePath} */\n${fileText}\n\n${cleanedInput}`;
                const newMessage = {
                    from: 'user',
                    text: originalInput,
                };
                setMessages((prev) => [...prev, newMessage]);
                vscode.postMessage({ type: 'userMessage', text: fullPrompt });
                setInput('');
            }
            if (message.type === 'fileList') {
                setFileSuggestions(message.files || []);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1rem',
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#1e1e1e',
            color: '#ffffff',
            height: '100vh',
        }}>
      <h2 style={{ color: '#61dafb' }}>AI Chat Assistant</h2>

      <div style={{
            flexGrow: 1,
            overflowY: 'auto',
            border: '1px solid #333',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            backgroundColor: '#2d2d2d',
            minHeight: '300px',
        }}>
        {messages.length === 0 && (<div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#aaa',
            }}>
            <h3 style={{ color: '#61dafb', marginBottom: '0.5rem' }}>
              👋 Welcome to AI Chat Assistant
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
              Start by asking a question or type <code>@filename</code> to
              inject code context from your workspace.
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
              Example: <code>Explain @src/utils/formatter.ts</code>
            </p>
          </div>)}
        {messages.map((msg, i) => (<div key={i} style={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '0.75rem',
            }}>
            <span style={{
                maxWidth: '75%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: msg.from === 'user' ? '#0b93f6' : '#333',
                color: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                lineHeight: '1.4',
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
            }}>
              <ReactMarkdown children={msg.text} components={{
                code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (<SyntaxHighlighter children={String(children).replace(/\n$/, '')} style={oneDark} language={match[1]} PreTag='div' {...props}/>) : (<code style={{
                            backgroundColor: '#333',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                        }} {...props}>
                        {children}
                      </code>);
                },
            }}/>
            </span>
          </div>))}
        <div ref={chatEndRef}/>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input style={{
            flexGrow: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            border: '1px solid #666',
            backgroundColor: '#333',
            color: '#fff',
        }} type='text' value={input} onChange={(e) => {
            const val = e.target.value;
            setInput(val);
            const match = val.match(/@([\w./\\-]*)$/);
            if (match) {
                vscode.postMessage({ type: 'listFiles', prefix: match[1] || '' });
                setShowSuggestions(true);
            }
            else {
                setShowSuggestions(false);
            }
        }} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder='Type your message...'/>
        <button style={{
            padding: '0 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#61dafb',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'pointer',
        }} onClick={sendMessage}>
          Send
        </button>
      </div>

      {showSuggestions && fileSuggestions.length > 0 && (<div style={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #444',
                borderRadius: '4px',
                marginTop: '0.5rem',
                maxHeight: '150px',
                overflowY: 'auto',
                color: '#fff',
                zIndex: 10,
            }}>
          {fileSuggestions.map((file, i) => (<div key={i} style={{
                    padding: '0.5rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #333',
                    transition: 'background 0.2s',
                }} onClick={() => {
                    const updatedInput = input.replace(/@[\w./\\-]*$/, `@${file}`);
                    setInput(updatedInput);
                    setShowSuggestions(false);
                }} onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                        '#3d3d3d';
                }} onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                }}>
              {file}
            </div>))}
        </div>)}
    </div>);
}
export default App;
//# sourceMappingURL=App.js.map