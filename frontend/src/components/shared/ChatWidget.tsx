'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I am the BloodBridge AI Assistant. How can I help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetPrompts = [
    'Am I eligible to donate?',
    'What blood groups are compatible with AB+?',
    'Where is the nearest blood bank?',
    'When can I donate next?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    // Simulated AI Response
    setTimeout(() => {
      setIsTyping(false);
      let reply = "I'm sorry, I don't have that information right now. Please consult our support team or check our docs.";

      const lowerText = text.toLowerCase();
      if (lowerText.includes('eligible')) {
        reply = 'Generally, if you are between 18 and 65 years old, weigh at least 50 kg, and are in good health, you are eligible to donate. You must also not have donated blood in the last 56 days (for whole blood).';
      } else if (lowerText.includes('compatible') || lowerText.includes('ab+')) {
        reply = 'AB+ is the universal recipient, meaning individuals with AB+ blood can receive red blood cells from any blood group (A, B, AB, and O). However, they can only donate to other AB+ individuals.';
      } else if (lowerText.includes('nearest') || lowerText.includes('bank')) {
        reply = 'You can view the active blood banks and hospitals in real-time on our Live Map in the dashboard (/dashboard/map).';
      } else if (lowerText.includes('when') || lowerText.includes('next')) {
        reply = 'Whole blood donations require a minimum wait time of 56 days between donations. You can check your eligibility counter on your Profile page (/dashboard/profile).';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* Collapsed Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#A4161A] text-white rounded-full shadow-lift hover:bg-[#660708] hover:translate-y-[-1px] transition-all duration-200"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">Ask BloodBridge</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[340px] h-[480px] bg-white dark:bg-[#1E293B] rounded-lg shadow-lift border border-border dark:border-border-dark flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-[#A4161A] dark:bg-[#660708] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="font-heading font-semibold text-sm">BloodBridge Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#A4161A] text-white'
                      : 'bg-[#F5F3F4] dark:bg-[#263548] text-[#161A1D] dark:text-[#F8FAFC] border border-border dark:border-border-dark'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#F5F3F4] dark:bg-[#263548] border border-border dark:border-border-dark rounded px-3 py-2 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-[#A4161A] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#A4161A] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#A4161A] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-border dark:border-border-dark bg-[#FAFAFA] dark:bg-[#263548] space-y-1">
            <p className="text-[10px] text-gray-500 font-semibold px-2 py-0.5">Quick Questions:</p>
            <div className="flex flex-wrap gap-1 px-1">
              {presetPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] bg-white dark:bg-[#1E293B] border border-border dark:border-border-dark text-[#161A1D] dark:text-[#F8FAFC] px-2 py-1 rounded hover:border-[#A4161A] transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-border dark:border-border-dark flex gap-2 bg-white dark:bg-[#1E293B]"
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 text-xs border border-border dark:border-border-dark bg-[#FAFAFA] dark:bg-[#263548] rounded px-3 py-2 outline-none focus:border-[#A4161A] dark:focus:border-red-600 transition-colors"
            />
            <button
              type="submit"
              className="p-2 bg-[#A4161A] text-white rounded hover:bg-[#660708] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
