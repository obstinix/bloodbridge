'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import styles from './ChatWidget.module.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I am BloodBridge AI. How can I assist you with emergency donor matching or blood stock levels today?' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'What blood types are critically low?',
    'How do I register as a donor?',
    'Find nearest blood bank',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputVal('');
    setIsTyping(true);

    // Simulated Bot response delay
    setTimeout(() => {
      setIsTyping(false);
      let reply = 'I will query the system coordinates for that data now. Please sign in to access full analytics and routing channels.';
      
      const lower = text.toLowerCase();
      if (lower.includes('low') || lower.includes('shortage')) {
        reply = 'Currently, O- (Universal Donor) is under critical shortage levels (under 10 units at City General Hospital). A- is also at low alert status.';
      } else if (lower.includes('register') || lower.includes('donor')) {
        reply = 'You can register as a volunteer donor by navigating to the Register page, selecting the "Donor" role, and filling in your details.';
      } else if (lower.includes('bank') || lower.includes('hospital')) {
        reply = 'Partner blood banks and hospital inventories are plotted live on the Live Map. Visit the Dashboard to see coordinates.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 1200);
  };

  return (
    <div className={styles.widgetContainer}>
      {/* Chat window */}
      {isOpen && (
        <div className={styles.window}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <span className={styles.title}>BloodBridge AI</span>
              <span className={styles.subtitle}>Powered by Claude</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className={styles.chatBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.msg} ${
                  msg.sender === 'user' ? styles.userMsg : styles.botMsg
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className={styles.typing}>
                <span />
                <span />
                <span />
              </div>
            )}

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className={styles.suggestionList}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className={styles.suggestionBtn}
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Footer Input */}
          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
          >
            <input
              className={styles.input}
              type="text"
              placeholder="Ask BloodBridge AI..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button className={styles.sendBtn} type="submit">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Toggle Button */}
      <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
