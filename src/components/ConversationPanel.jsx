import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Trash2, Bot, User } from 'lucide-react';
import useAIStore from '../stores/aiStore';

const ConversationPanel = ({ conversationHistory, onSendMessage, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const messagesEndRef = useRef(null);
  const { getInterimTranscript, clearConversation } = useAIStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Update interim transcript
  useEffect(() => {
    const interval = setInterval(() => {
      const transcript = getInterimTranscript();
      setInterimTranscript(transcript);
    }, 100);

    return () => clearInterval(interval);
  }, [getInterimTranscript]);

  const handleSubmit = e => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      className="conversation-panel"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '2px solid #00FFFF',
        borderRadius: '15px',
        padding: '20px',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 255, 255, 0.2)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
        }}
      >
        <h3
          style={{
            color: '#00FFFF',
            fontSize: '16px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          💬 Chat with Nova
        </h3>

        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearConversation}
            style={{
              background: 'rgba(255, 0, 85, 0.2)',
              border: '1px solid #FF0055',
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Clear conversation"
          >
            <Trash2 size={16} color="#FF0055" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close chat"
          >
            <X size={16} color="#fff" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '20px',
          paddingRight: '10px',
        }}
      >
        {conversationHistory.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              marginTop: '50px',
            }}
          >
            <Bot
              size={48}
              color="rgba(0, 255, 255, 0.5)"
              style={{ marginBottom: '15px' }}
            />
            <div>Start a conversation with Nova!</div>
            <div style={{ fontSize: '12px', marginTop: '10px' }}>
              Try saying "Hello" or ask about the time, weather, or music.
            </div>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {conversationHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems:
                    message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    background:
                      message.role === 'user'
                        ? 'rgba(0, 255, 255, 0.1)'
                        : 'rgba(255, 0, 85, 0.1)',
                    border: `1px solid ${message.role === 'user' ? '#00FFFF' : '#FF0055'}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    maxWidth: '80%',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: message.role === 'user' ? '#00FFFF' : '#FF0055',
                    }}
                  >
                    {message.role === 'user' ? (
                      <User size={12} />
                    ) : (
                      <Bot size={12} />
                    )}
                    {message.role === 'user' ? 'You' : 'Nova'}
                  </div>

                  <div
                    style={{
                      color: '#fff',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                    }}
                  >
                    {message.content}
                  </div>

                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '8px',
                      textAlign: message.role === 'user' ? 'right' : 'left',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Interim transcript */}
            {interimTranscript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    maxWidth: '80%',
                    fontStyle: 'italic',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  {interimTranscript}
                </div>
              </motion.div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ marginTop: 'auto' }}>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.5)',
              border: '2px solid #00FFFF',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontSize: '14px',
              resize: 'none',
              minHeight: '50px',
              maxHeight: '100px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              background: inputValue.trim()
                ? 'linear-gradient(135deg, #00FFFF, #FF0055)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: inputValue.trim() ? 1 : 0.5,
            }}
          >
            <Send size={16} color={inputValue.trim() ? '#000' : '#fff'} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ConversationPanel;
