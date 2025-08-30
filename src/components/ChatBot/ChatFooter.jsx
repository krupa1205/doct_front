// frontend/src/components/ChatBot/ChatFooter.jsx
import React, { useState } from 'react';

const ChatFooter = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <footer className="flex items-center gap-2 p-2.5 border-t border-[var(--border)] bg-gradient-to-t from-transparent to-[rgba(148,163,184,0.06)]">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything"
          autoComplete="off"
          className="flex-1 border border-[var(--border)] rounded-full py-2 px-3.5 bg-transparent text-[var(--text)] outline-none text-sm focus:border-[rgba(65,160,37,0.6)] focus:ring-3 focus:ring-[rgba(230,35,35,0.08)]"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="border-0 bg-[var(--brand)] text-white py-2 px-3.5 rounded-full cursor-pointer text-sm flex items-center justify-center transition-all duration-200 hover:brightness-105 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          ➤
        </button>
      </form>
    </footer>
  );
};

export default ChatFooter;