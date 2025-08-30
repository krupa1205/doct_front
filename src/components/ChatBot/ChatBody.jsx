// frontend/src/components/ChatBot/ChatBody.jsx
import React, { forwardRef } from 'react';
import Message from './Message';

const ChatBody = forwardRef(({ messages, isTyping, onOptionClick }, ref) => {
  const currentDate = new Intl.DateTimeFormat(undefined, { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  }).format(new Date());

  return (
    <div 
      ref={ref}
      className="p-3 overflow-y-auto max-h-60vh"
    >
      <div className="text-xs text-[var(--muted)] bg-[rgba(148,163,184,0.08)] border border-dashed border-[var(--border)] rounded-xl p-2.5 mb-3" role="note">
        Your use of this automated chatbot constitutes consent that the personal information you provide in the chat session will be collected, used, disclosed, and retained by SympAI and service providers acting on SympAi's behalf in accordance with the SympAi Privacy Policy. Please do not provide sensitive personal information (such as financial or health information) in the chatbot.
      </div>
      
      <div className="text-xs text-[var(--muted)] text-center my-2.5">{currentDate}</div>
      
      {messages.map(message => (
        <Message 
          key={message.id} 
          message={message} 
          onOptionClick={onOptionClick}
        />
      ))}
      
      {isTyping && (
        <div className="flex gap-2 items-start mb-2">
          <div className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center shadow-md">
            <img src="/Simp.png" alt="Assistant" className="w-4 h-4 object-contain filter brightness-0 invert" />
          </div>
          <div className="bg-[#f3f4f6] dark:bg-[#131a22] text-[#111827] dark:text-[#e5e7eb] border border-[var(--border)] rounded-xl p-2.5 max-w-[85%]">
            <span className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] opacity-70 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] opacity-70 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] opacity-70 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

ChatBody.displayName = 'ChatBody';

export default ChatBody;