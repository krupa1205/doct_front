// frontend/src/components/ChatBot/ChatHeader.jsx
import React from 'react';

const ChatHeader = ({ onClose }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--panel)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--brand)] flex items-center justify-center">
          <img 
            src="/Simp.png" 
            alt="Assistant" 
            className="w-4 h-4 object-contain filter brightness-0 invert"
          />
        </div>
        <div>
          <h1 id="chatTitle" className="font-semibold text-[var(--text)] text-sm">
            SympAI Assistant
          </h1>
          <p id="chatDesc" className="text-[var(--muted)] text-xs">
            How can I help you today?
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-[rgba(148,163,184,0.1)] transition-colors"
        aria-label="Close chat"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.853 3.147a.5.5 0 0 1 0 .707L8.707 8l4.146 4.146a.5.5 0 0 1-.707.707L8 8.707l-4.146 4.146a.5.5 0 0 1-.707-.707L7.293 8 3.147 3.854a.5.5 0 1 1 .707-.707L8 7.293l4.146-4.146a.5.5 0 0 1 .707 0z"/>
        </svg>
      </button>
    </header>
  );
};

export default ChatHeader;