// src/App.jsx
import { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

// --- CONFIGURATION ---
const APP_NAME = 'it_support_agent';
const BASE_URL = "http://localhost:8000"; // IMPORTANT: Your backend server URL

function App() {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(true); // True during initial session creation
  const [isTyping, setIsTyping] = useState(false); // True when waiting for bot response
  const [error, setError] = useState(null);

  // --- EFFECT FOR SESSION INITIALIZATION ---
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const newUserId = crypto.randomUUID();
        const newSessionId = crypto.randomUUID();

        const createSessionUrl = `${BASE_URL}/apps/${APP_NAME}/users/${newUserId}/sessions/${newSessionId}`;
        const response = await fetch(createSessionUrl, { method: 'POST' });
        
        if (!response.ok) {
          throw new Error(`Failed to create session. Server responded with ${response.status}.`);
        }

        // Session created successfully
        setUserId(newUserId);
        setSessionId(newSessionId);
        setMessages([{ 
          sender: 'bot', 
          text: "Hello! Welcome to IT Support. How can I assist you today?" 
        }]);

      } catch (err) {
        console.error("Initialization Error:", err);
        setError(err.message || 'Could not connect to the agent. Please check the console and refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []); // Empty array ensures this runs only once on mount

  // --- FUNCTION TO HANDLE SENDING A MESSAGE ---
  const handleSendMessage = async (messageText) => {
    if (!messageText || isTyping || isLoading) return;

    // Add user's message to the chat immediately
    const userMessage = { sender: 'user', text: messageText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      const payload = {
        appName: APP_NAME,
        userId: userId,
        sessionId: sessionId,
        newMessage: { role: "user", parts: [{ "text": messageText }] }
      };

      const response = await fetch(`${BASE_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Process the response to extract all text parts
      const botReplyText = responseData.reduce((acc, item) => {
        if (item.content?.parts) {
          const textPart = item.content.parts
            .filter(part => part.text)
            .map(part => part.text)
            .join('');
          return acc + textPart;
        }
        return acc;
      }, '');

      if (botReplyText) {
        setMessages(prev => [...prev, { sender: 'bot', text: botReplyText.trim() }]);
      } else {
        console.warn("Response contained no displayable text:", responseData);
        setMessages(prev => [...prev, { sender: 'bot', text: "I received a response, but it was empty." }]);
      }

    } catch (err) {
      console.error("Send Message Error:", err);
      setMessages(prev => [...prev, { sender: 'bot', text: `Sorry, an error occurred: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- RENDER LOGIC ---
  const isFormDisabled = isLoading || isTyping || !!error;

  return (
    <div className="chat-app">
      <header className="chat-header">
        <h1>IT Support Agent</h1>
        {sessionId && <p>Session: {sessionId}</p>}
      </header>
      
      <main style={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {isLoading && <div className="spinner-container"><div className="spinner"></div></div>}
        
        {error && <div className="error-banner">{error}</div>}
        
        {!isLoading && !error && (
          <ChatWindow messages={messages} isTyping={isTyping} />
        )}
      </main>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isFormDisabled} />
    </div>
  );
}

export default App;