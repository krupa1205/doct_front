// frontend/src/components/ChatBot/Message.jsx
import React from 'react';

const Message = ({ message, onOptionClick }) => {
  const handleOptionAction = (option) => {
    if (option.action) {
      onOptionClick(option.action);
    } else if (option.link) {
      window.open(option.link, '_blank', 'noopener');
    } else if (option.fill) {
      // This would typically fill an input field
      console.log("Would fill input with:", option.fill);
    }
  };

  return (
    <div className={`flex gap-2 mb-2 max-w-[85%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : 'items-start'}`}>
      <div className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center shadow-md flex-shrink-0">
        {message.role === 'bot' ? (
          <img src="/Simp.png" alt="Assistant" className="w-4 h-4 object-contain filter brightness-0 invert" />
        ) : (
          <span className="text-xs text-white">You</span>
        )}
      </div>
      
      <div>
        <div 
          className={`p-2.5 rounded-xl ${
            message.role === 'bot' 
              ? 'bg-[#f3f4f6] dark:bg-[#131a22] text-[#111827] dark:text-[#e5e7eb] border border-[var(--border)]' 
              : 'bg-[var(--brand)] text-white'
          }`}
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
        
        {message.options && (
          <div className="grid gap-2 mt-1.5">
            {message.options.map((option, index) => (
              <button
                key={index}
                className="flex items-center gap-2 p-2.5 border border-[var(--border)] bg-transparent text-[var(--text)] rounded-xl cursor-pointer text-sm text-left transition-colors duration-200 hover:border-[rgba(230,35,35,0.6)] active:scale-99"
                onClick={() => handleOptionAction(option)}
                aria-label={option.ariaLabel || option.label}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;