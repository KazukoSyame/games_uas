import { useEffect, useRef } from 'react';

const MessageLog = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

   return (
    <div className="message-log">
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageLog;