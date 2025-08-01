import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Key,
  Brain,
  X,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import useAIStore from '../stores/aiStore';
import toast from 'react-hot-toast';

const SettingsPanel = ({ isOpen, onClose }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [elevenLabsKeyInput, setElevenLabsKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const {
    getApiKey,
    setApiKey,
    restoreApiKey,
    isApiConfigured,
    getElevenLabsApiKey,
    setElevenLabsApiKey,
    isElevenLabsConfigured,
    getAvailableModels,
    getCurrentModel,
    setDefaultModel,
  } = useAIStore();

  // Initialize form with current values
  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getApiKey() || '');
      setElevenLabsKeyInput(getElevenLabsApiKey() || '');
      setSelectedModel(getCurrentModel());
    }
  }, [isOpen]); // Remove dependencies to prevent infinite loops

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    // Accept both OpenAI and OpenRouter API keys
    if (!apiKeyInput.startsWith('sk-')) {
      toast.error('Please enter a valid API key (OpenAI or OpenRouter)');
      return;
    }

    setApiKey(apiKeyInput.trim());
    setApiKeyInput('');
    toast.success('API key saved successfully!');
  };

  const handleSaveElevenLabsKey = () => {
    if (!elevenLabsKeyInput.trim()) {
      toast.error('Please enter an ElevenLabs API key');
      return;
    }

    setElevenLabsApiKey(elevenLabsKeyInput.trim());
    setElevenLabsKeyInput('');
  };

  const handleModelChange = modelId => {
    setSelectedModel(modelId);
    setDefaultModel(modelId);
  };

  const handleGetApiKey = () => {
    window.open('https://openrouter.ai/keys', '_blank');
  };

  const handleGetElevenLabsKey = () => {
    window.open('https://elevenlabs.io/api', '_blank');
  };

  const availableModels = getAvailableModels();
  const isConfigured = isApiConfigured();
  const isElevenLabsReady = isElevenLabsConfigured();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '2px solid #00FFFF',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
              }}
            >
              <h2
                style={{
                  color: '#00FFFF',
                  fontSize: '18px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Settings size={20} />
                Nova Settings
              </h2>

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
              >
                <X size={16} color="#fff" />
              </motion.button>
            </div>

            {/* OpenRouter API Key Section */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#00FFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Key size={16} />
                OpenAI/OpenRouter API Key
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="Enter your OpenAI or OpenRouter API key"
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid #00FFFF',
                      borderRadius: '8px',
                      padding: '12px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowApiKey(!showApiKey)}
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
                  >
                    {showApiKey ? (
                      <EyeOff size={16} color="#fff" />
                    ) : (
                      <Eye size={16} color="#fff" />
                    )}
                  </motion.button>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveApiKey}
                    style={{
                      background: 'linear-gradient(135deg, #00FFFF, #FF0055)',
                      border: 'none',
                      color: '#000',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '12px',
                    }}
                  >
                    Save API Key
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const restored = restoreApiKey();
                      if (restored) {
                        toast.success('API key restored from storage!');
                        setApiKeyInput(getApiKey() || '');
                      } else {
                        toast.error('No API key found in storage');
                      }
                    }}
                    style={{
                      background: 'rgba(0, 255, 255, 0.2)',
                      border: '1px solid #00FFFF',
                      color: '#00FFFF',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '12px',
                    }}
                  >
                    Restore Key
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetApiKey}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Get API Key
                    <ExternalLink size={12} />
                  </motion.button>
                </div>
              </div>

              <div
                style={{
                  padding: '10px',
                  background: isConfigured
                    ? 'rgba(0, 255, 102, 0.1)'
                    : 'rgba(255, 0, 85, 0.1)',
                  border: `1px solid ${isConfigured ? '#00FF66' : '#FF0055'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: isConfigured ? '#00FF66' : '#FF0055',
                }}
              >
                {isConfigured
                  ? '✅ API key is configured and ready to use!'
                  : '⚠️ API key is required for full AI capabilities'}
              </div>
            </div>

            {/* ElevenLabs API Key Section */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#00FFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Key size={16} />
                ElevenLabs Voice API Key
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <input
                    type={showElevenLabsKey ? 'text' : 'password'}
                    value={elevenLabsKeyInput}
                    onChange={e => setElevenLabsKeyInput(e.target.value)}
                    placeholder="Enter your ElevenLabs API key"
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid #00FFFF',
                      borderRadius: '8px',
                      padding: '12px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowElevenLabsKey(!showElevenLabsKey)}
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
                  >
                    {showElevenLabsKey ? (
                      <EyeOff size={16} color="#fff" />
                    ) : (
                      <Eye size={16} color="#fff" />
                    )}
                  </motion.button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveElevenLabsKey}
                    style={{
                      background: 'linear-gradient(135deg, #00FFFF, #FF0055)',
                      border: 'none',
                      color: '#000',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '12px',
                    }}
                  >
                    Save Voice Key
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetElevenLabsKey}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Get Voice Key
                    <ExternalLink size={12} />
                  </motion.button>
                </div>
              </div>

              <div
                style={{
                  padding: '10px',
                  background: isElevenLabsReady
                    ? 'rgba(0, 255, 102, 0.1)'
                    : 'rgba(255, 0, 85, 0.1)',
                  border: `1px solid ${isElevenLabsReady ? '#00FF66' : '#FF0055'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: isElevenLabsReady ? '#00FF66' : '#FF0055',
                }}
              >
                {isElevenLabsReady
                  ? '✅ ElevenLabs voice is configured and ready!'
                  : '⚠️ ElevenLabs API key is required for high-quality voice'}
              </div>
            </div>

            {/* Model Selection */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#00FFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Brain size={16} />
                AI Model Selection
              </h3>

              <select
                value={selectedModel}
                onChange={e => handleModelChange(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '2px solid #00FFFF',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                {availableModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                ))}
              </select>

              <div
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: 'rgba(0, 255, 255, 0.1)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#00FFFF',
                }}
              >
                Current model:{' '}
                {availableModels.find(m => m.id === selectedModel)?.name ||
                  'Unknown'}
              </div>
            </div>

            {/* Info Section */}
            <div
              style={{
                padding: '15px',
                background: 'rgba(0, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <h4 style={{ color: '#00FFFF', marginBottom: '8px' }}>
                ℹ️ About the APIs
              </h4>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#00FFFF' }}>OpenRouter:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  <li>Access to GPT-4, Claude, Gemini, and more</li>
                  <li>Get your free API key at openrouter.ai</li>
                  <li>Pay only for what you use</li>
                </ul>
              </div>
              <div>
                <strong style={{ color: '#00FFFF' }}>ElevenLabs:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  <li>High-quality, natural voice synthesis</li>
                  <li>Get your free API key at elevenlabs.io</li>
                  <li>10,000 characters free per month</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
