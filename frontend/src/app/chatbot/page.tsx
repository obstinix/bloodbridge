'use client';

import React, { useState, useEffect, useRef } from 'react';
import TopNav from '@/components/TopNav/TopNav';
import Button from '@/components/Button/Button';
import styles from './chatbot.module.css';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isResultCard?: boolean;
  resultData?: {
    bloodType: string;
    units: number;
    facility: string;
    distance: number;
  };
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am BloodBridge AI. Ask me about blood reserves, donor eligibility rules, or partner facility coordinates.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'What blood types are critically low?',
    'How do I register as a donor?',
    'Find nearest blood bank',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(messages.length + 1),
      sender: 'user',
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock bot responses
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I'm sorry, I didn't quite catch that. You can ask me about blood stocks, donor qualifications, or nearest emergency centers.";
      let isResultCard = false;
      let resultData;

      const normalized = text.toLowerCase();
      if (normalized.includes('low') || normalized.includes('critical') || normalized.includes('shortage')) {
        replyText = 'Current system checks show O- is in critical shortage with only 9 units left. B- and AB- are also flagged as low supply reserves.';
      } else if (normalized.includes('register') || normalized.includes('donor') || normalized.includes('eligibility')) {
        replyText = 'To sign up as a donor, click Register on the navbar. You must be between 18-65 years old, weigh at least 50 kg, and have had no major surgeries or tattoos in the last 6 months.';
      } else if (normalized.includes('bank') || normalized.includes('nearest') || normalized.includes('find')) {
        replyText = 'Here is the closest match matching emergency search filters:';
        isResultCard = true;
        resultData = {
          bloodType: 'O-',
          units: 9,
          facility: 'City General Hospital',
          distance: 1.2,
        };
      }

      const botMsg: Message = {
        id: String(messages.length + 2),
        sender: 'bot',
        text: replyText,
        isResultCard,
        resultData,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <TopNav />

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              setMessages([
                {
                  id: '1',
                  sender: 'bot',
                  text: 'Hello! I am BloodBridge AI. Ask me about blood reserves, donor eligibility rules, or partner facility coordinates.',
                },
              ])
            }
            className={styles.newChatBtn}
          >
            New Conversation
          </Button>

          <div className={styles.historyList}>
            <div className={`${styles.historyItem} ${styles.historyItemActive}`}>
              <span className={styles.historyTitle}>Emergency Stock Query</span>
              <span className={styles.historyTime}>Active now</span>
            </div>
            <div className={styles.historyItem}>
              <span className={styles.historyTitle}>Donor Eligibility Checklist</span>
              <span className={styles.historyTime}>2 hours ago</span>
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.sender === 'user' ? styles.userRow : styles.botRow
                }`}
              >
                <div
                  className={`${styles.bubble} ${
                    msg.sender === 'user' ? styles.userBubble : styles.botBubble
                  }`}
                >
                  <div>{msg.text}</div>

                  {msg.isResultCard && msg.resultData && (
                    <div className={styles.queryResultCard}>
                      <span className={styles.queryCardTitle}>
                        Facility Match: {msg.resultData.facility}
                      </span>
                      <div className={styles.queryStats}>
                        <div className={styles.queryStatsRow}>
                          <span>Blood Type Required:</span>
                          <span style={{ color: 'var(--crimson)', fontWeight: 'bold' }}>
                            {msg.resultData.bloodType}
                          </span>
                        </div>
                        <div className={styles.queryStatsRow}>
                          <span>Units Available:</span>
                          <span>{msg.resultData.units} units</span>
                        </div>
                        <div className={styles.queryStatsRow}>
                          <span>Proximity Distance:</span>
                          <span>{msg.resultData.distance} km</span>
                        </div>
                      </div>
                      <div className={styles.queryBtnGroup}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => alert('Routing query instructions...')}
                          fullWidth
                        >
                          Contact Hub
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageRow} ${styles.botRow}`}>
                <div className={`${styles.bubble} ${styles.botBubble}`}>
                  <div className={styles.typing}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Inputs Section */}
          <div className={styles.inputSection}>
            <div className={styles.promptRow}>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className={styles.promptChip}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className={styles.inputBox}>
              <textarea
                className={styles.textarea}
                placeholder="Ask BloodBridge AI..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(inputValue);
                  }
                }}
              />
              <Button variant="primary" size="sm" onClick={() => handleSend(inputValue)}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
