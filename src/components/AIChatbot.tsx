import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Michael's AI assistant. I can answer questions about his experience, skills, and career background. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base for the AI
  const knowledgeBase = {
    experience: {
      keywords: ['experience', 'background', 'career', 'work history', 'jobs'],
      response: "I have over 13 years of executive experience, including:\n• CXO/CSTO roles in fintech and technology companies\n• Led $10.8B+ in transactions across equity, debt, and M&A\n• Successfully scaled operations from 0→1→10\n• IPO experience with GreenSky\n• Turnaround and transformation expertise"
    },
    skills: {
      keywords: ['skills', 'technologies', 'software', 'tools', 'expertise'],
      response: "My technical expertise includes:\n• ERP Systems: SAP, NetSuite, Microsoft Dynamics\n• Analytics: Tableau, PowerBI, Looker, Snowflake\n• Programming: Python, SQL, React, TypeScript\n• Cloud: AWS, GCP, Docker, Vercel\n• Specialized: Core banking systems, payment processors, regulatory compliance"
    },
    compensation: {
      keywords: ['salary', 'compensation', 'pay', 'bonus', 'target'],
      response: "I'm targeting a base salary of $225K with $50K+ performance bonus and equity. I prioritize performance-based compensation and am open to discussing the full package based on the opportunity and impact potential."
    },
    location: {
      keywords: ['location', 'remote', 'atlanta', 'relocation', 'where'],
      response: "I'm based in Atlanta, GA and prefer local opportunities, but I'm open to relocation for the right role. I'm also comfortable with remote or hybrid work arrangements."
    },
    industries: {
      keywords: ['industries', 'sectors', 'fintech', 'saas', 'ai', 'target'],
      response: "I'm targeting companies in:\n• Fintech & Financial Services\n• Technology & SaaS\n• AI & Machine Learning\n• PropTech & Real Estate\n• Residential Services\n• Revenue: $0-50MM, Headcount: 2-200"
    },
    contact: {
      keywords: ['contact', 'email', 'phone', 'reach', 'connect'],
      response: "You can reach me at:\n• Email: mkaminski1337@gmail.com\n• Phone: (404) 838-8613\n• LinkedIn: linkedin.com/in/michaelxaxkaminski\n• Or schedule a call through the website!"
    },
    transactions: {
      keywords: ['transactions', 'deals', 'm&a', 'ipo', 'debt', 'equity'],
      response: "I've led $10.8B+ in transactions including:\n• GreenSky IPO ($1B+)\n• HD Supply divestitures ($1.8B+)\n• Home Depot share repurchase ($4B)\n• Various debt facilities and equity rounds\n• Experience across public markets, PE, and strategic buyers"
    }
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check each knowledge category
    for (const [, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }

    // Default responses for common questions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help answer questions about Michael's background and experience. What would you like to know?";
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about Michael's experience or background?";
    }

    return "I'm not sure about that specific question, but I can help with information about Michael's experience, skills, compensation expectations, target industries, or contact information. What would you like to know?";
  };

  const promptSuggestions = [
    "How much experience does Michael have by year by skill?",
    "What are Michael's top 5 projects?",
    "What is Michael's experience with Board and PE Sponsor Reporting?",
    "What are Michael's strongest technical skills?",
    "What is Michael's compensation target?",
    "What industries has Michael worked in?"
  ];

  // Split send logic for prompt buttons and input send
  const sendPrompt = (msg: string) => {
    if (!msg.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: msg,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(msg),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      window.dispatchEvent(new CustomEvent('ai-chat-interaction', {
        detail: {
          question: userMessage.text,
          response: aiResponse.text
        }
      }));
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    sendPrompt(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[32rem] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Michael's AI Assistant</h3>
                    <p className="text-sm text-gray-500">Ask me anything!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Prompt Suggestions */}
              <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
                {promptSuggestions.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors duration-200"
                    style={{ cursor: isTyping ? 'not-allowed' : 'pointer' }}
                    disabled={isTyping}
                    onClick={() => {
                      setInputValue(prompt);
                      setTimeout(() => { sendPrompt(prompt); }, 100);
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isUser
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {!message.isUser && (
                          <Bot size={16} className="text-primary-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-line">{message.text}</div>
                        {message.isUser && (
                          <User size={16} className="text-white mt-1 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-1">
                        <Bot size={16} className="text-primary-600" />
                        <span>Typing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about Michael's experience..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot; 