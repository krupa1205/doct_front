// frontend/src/components/ChatBot/ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader.jsx';
import ChatBody from './ChatBody.jsx';
import ChatFooter from './ChatFooter.jsx';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Initial bot message
  useEffect(() => {
    setMessages([
        {
            id: 1,
            text: "Hello! I'm your medical assistant. How can I help you today?",
            role: "bot",
            options: [
              { action: "symptoms", label: "🔍 Describe symptoms", ariaLabel: "Describe symptoms" },
              { action: "find_doctor", label: "👨‍⚕️ Find a doctor", ariaLabel: "Find a doctor" }
            ]
          }
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleUserMessage = (text) => {
    // const newMessage = { id: Date.now(), text, role: "user" };
    // setMessages(prev => [...prev, newMessage]);
    // setIsTyping(true);
    
    // // Simulate bot response after delay
    // setTimeout(() => {
    //   setIsTyping(false);
    //   const botResponse = {
    //     id: Date.now() + 1,
    //     text: `Thanks for your message: <strong>${text}</strong><br/>I'm a demo assistant. For real-time openings, try <em>Find a job</em> or ask a specific location/role.`,
    //     role: "bot"
    //   };
    //   setMessages(prev => [...prev, botResponse]);
    // }, 800);
  };

  const handleOptionClick = (action) => {
    if (action === "symptoms") {
      const userMessage = { id: Date.now(), text: "find a deisease", role: "user" };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = {
          id: Date.now() + 1,
          text: "Great! Choose a path to explore:",
          role: "bot",
          options: [
            { link: "https://www.adobe.com/careers/search.html", label: "💼 Browse all openings" },
            { link: "https://www.adobe.com/careers/students.html", label: "🎓 University & internships" },
            { link: "https://www.adobe.com/careers/diversity.html", label: "🌍 Diversity & belonging" }
          ]
        };
        setMessages(prev => [...prev, botResponse]);
      }, 700);
    } else if (action === "find_doctor") {
      const userMessage = { id: Date.now(), text: "Ask a question", role: "user" };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = {
          id: Date.now() + 1,
          text: "Ask me about roles, locations, or application status. Here are quick topics:",
          role: "bot",
          options: [
            { fill: "Remote roles in India", label: "🏠 Remote roles in India" },
            { fill: "UI/UX openings in Bengaluru", label: "🎨 UI/UX openings in Bengaluru" },
            { fill: "How long does the hiring process take?", label: "⏱ Hiring process timeline" }
          ]
        };
        setMessages(prev => [...prev, botResponse]);
      }, 700);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-[var(--brand)] flex items-center justify-center cursor-pointer shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 active:scale-95 z-50"
        onClick={toggleChat}
        aria-label="Open Adobe Careers chat"
        title="Open chat"
      >
        <span className="absolute inset-0 rounded-full bg-[rgba(230,35,35,0.45)] animate-pulse" aria-hidden="true"></span>
        <img 
          src="/Simp.png" 
          srcSet="/Simp@2x.png 2x" 
          alt="Simp logo" 
          className="w-8 h-8 object-contain filter brightness-0 invert"
          crossOrigin="anonymous"
        />
      </button>

      {/* Chat Popup */}
      <div
        className={`fixed right-5 bottom-24 w-96 max-w-[92vw] bg-[var(--panel)] border border-[var(--border)] rounded-xl shadow-lg grid grid-rows-[auto_1fr_auto] overflow-hidden z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 visible translate-y-0 scale-100"
            : "opacity-0 invisible translate-y-5 scale-95"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="chatTitle"
        aria-describedby="chatDesc"
      >
        <ChatHeader onClose={() => setIsOpen(false)} />
        <ChatBody 
          ref={chatBodyRef}
          messages={messages} 
          isTyping={isTyping}
          onOptionClick={handleOptionClick}
        />
        <ChatFooter onSendMessage={handleUserMessage} />
      </div>
    </>
  );
};

export default ChatBot;