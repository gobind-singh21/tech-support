// src/components/ChatWidget.jsx
import { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import './ChatWidget.css'; // Import the new CSS

// --- CONFIGURATION ---
const APP_NAME = 'it_support_agent';
const BASE_URL = "http://localhost:8000";

// --- SVG Icons ---
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
  </svg>
);

const CloseIcon = () => <>✖</>;
const MinimizeIcon = () => <>—</>;


function ChatWidget() {
  // --- STATE MANAGEMENT ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- SESSION INITIALIZATION ---
  const initializeSession = async () => {
    if (isInitialized) return;

    try {
      setError(null);
      setIsLoading(true);

      const newUserId = crypto.randomUUID();
      const newSessionId = crypto.randomUUID();
      const createSessionUrl = `${BASE_URL}/apps/${APP_NAME}/users/${newUserId}/sessions/${newSessionId}`;
      
      const response = await fetch(createSessionUrl, { method: 'POST' });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      setUserId(newUserId);
      setSessionId(newSessionId);
      setMessages([{ sender: 'bot', text: "Hello! How can I assist you today?" }]);
      setIsInitialized(true);

    } catch (err) {
      console.error("Initialization Error:", err);
      setError(err.message || 'Could not connect. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open the chat and initialize session on first open
  const handleOpenChat = () => {
    setIsOpen(true);
    if (!isInitialized) {
      initializeSession();
    }
  };

  // --- SEND MESSAGE LOGIC ---
  const handleSendMessage = async (messageText) => {
    if (!messageText || isTyping) return;
    const userMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const payload = { appName: APP_NAME, userId, sessionId, newMessage: { role: "user", parts: [{ "text": messageText }] } };
      const response = await fetch(`${BASE_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const responseData = await response.json();
      const botReplyText = responseData.reduce((acc, item) => (item.content?.parts?.reduce((partAcc, part) => part.text ? partAcc + part.text : partAcc, '') || '') + acc, '');
      if (botReplyText) setMessages(prev => [...prev, { sender: 'bot', text: botReplyText.trim() }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: `Sorry, an error occurred: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const isFormDisabled = isLoading || isTyping || !!error;

  return (
    <>
      {/* The floating button to open the chat */}
      {!isOpen && (
        <button className="chat-open-button" onClick={handleOpenChat} aria-label="Open Chat">
          <ChatIcon />
        </button>
      )}

      {/* The actual chat widget window */}
      <div className={`chat-widget-container ${isOpen ? 'open' : 'closed'}`}>
        <header className="widget-header">
          <h3>IT Support Assistant</h3>
          <div className="widget-controls">
            <button onClick={() => setIsOpen(false)} aria-label="Minimize Chat"><MinimizeIcon /></button>
            <button onClick={() => setIsOpen(false)} aria-label="Close Chat"><CloseIcon /></button>
          </div>
        </header>

        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {isLoading && <div className="widget-loading-container"><div className="spinner"></div></div>}
          {error && <div className="widget-error-banner">{error}</div>}
          {!isLoading && !error && (
            <ChatWindow messages={messages} isTyping={isTyping} />
          )}
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} disabled={isFormDisabled} />
      </div>
    </>
  );
}

export default ChatWidget;