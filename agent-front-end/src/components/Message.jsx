// src/components/Message.jsx
import ReactMarkdown from 'react-markdown';
import './Message.css';

const Message = ({ message }) => {
  const { sender, text } = message;
  const isUser = sender === 'user';
  const messageClass = isUser ? 'user' : 'bot';

  return (
    <div className={`message-container ${messageClass}`}>
      <div className="message-bubble">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;