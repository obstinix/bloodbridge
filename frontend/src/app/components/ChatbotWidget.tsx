'use client';

import { useState, useEffect, useRef } from 'react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "🤖 **Welcome to BloodBridge Health Assistant!**\n\nHow can I help you today? You can ask about:\n- Blood group compatibility matrices\n- Donor eligibility criteria (age, weight, health)\n- Benefits of donating blood\n- The donation process step-by-step"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      
      // Artificial delay for organic humanized feel
      setTimeout(() => {
        setIsTyping(false);
        if (data.success) {
          setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
        } else {
          setMessages((prev) => [...prev, { sender: 'bot', text: "❌ Sorry, I'm having trouble connecting right now. Please try again later." }]);
        }
      }, 750);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: 'bot', text: "❌ Connection error. Please make sure the Flask backend is running." }]);
      }, 750);
    }
  };

  // Helper to format basic markdown (bold, bullets, linebreaks) without third-party libraries
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let formattedLine = line;
      
      // Parse list items
      const isListItem = formattedLine.startsWith('- ') || formattedLine.startsWith('* ');
      const isNumberedItem = /^\d+\.\s/.test(formattedLine);
      
      if (isListItem) {
        formattedLine = formattedLine.substring(2);
      } else if (isNumberedItem) {
        const match = formattedLine.match(/^(\d+\.\s)/);
        if (match) {
          formattedLine = formattedLine.substring(match[1].length);
        }
      }

      // Parse bold markdown "**bold**"
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(formattedLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formattedLine.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} style={{ color: 'white', fontWeight: '700' }}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < formattedLine.length) {
        parts.push(formattedLine.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : formattedLine;

      if (isListItem) {
        return (
          <li key={idx} style={{ marginLeft: '1rem', marginBottom: '0.25rem', listStyleType: 'disc', color: 'var(--text-primary)' }}>
            {content}
          </li>
        );
      }
      
      if (isNumberedItem) {
        return (
          <li key={idx} style={{ marginLeft: '1rem', marginBottom: '0.25rem', listStyleType: 'decimal', color: 'var(--text-primary)' }}>
            {content}
          </li>
        );
      }

      return (
        <p key={idx} style={{ marginBottom: line.trim() === '' ? '0.75rem' : '0.5rem', minHeight: '1px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
          {content}
        </p>
      );
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, fontFamily: 'var(--font-sans)' }}>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary)',
            border: 'none',
            boxShadow: '0 4px 20px var(--primary-glow), inset 0 2px 4px rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transition: 'var(--transition-smooth)',
          }}
          className="glow-button"
        >
          <svg style={{ width: '28px', height: '28px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" opacity=".3" />
          </svg>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div
          className="glass-panel slide-up-chat"
          style={{
            width: '380px',
            height: '520px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5), var(--glass-shadow-glow)',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(12, 15, 26, 0.85)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>BloodBridge AI</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Health Assistant • Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                transition: 'var(--transition-smooth)',
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(229, 57, 70, 0.25)' : 'none',
                  }}
                >
                  {msg.sender === 'bot' ? formatMessageText(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <div
                  style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    width: '60px',
                  }}
                >
                  <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }}></span>
                  <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }}></span>
                  <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(0,0,0,0.15)',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about blood donation..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '9999px',
                padding: '0.6rem 1.1rem',
                color: 'white',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'var(--transition-smooth)',
              }}
            />
            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)',
                boxShadow: '0 2px 8px rgba(229, 57, 70, 0.3)',
              }}
            >
              <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
