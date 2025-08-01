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
    getApiKeys,
    setApiKeys,
    getCurrentModel,
    getAvailableModels,
    switchModel,
    isApiConfigured,
    isElevenLabsConfigured,
  } = useAIStore();

  // Initialize form with current values
  useEffect(() => {
    if (isOpen) {
      const keys = getApiKeys();
      setApiKeyInput(keys.openai || keys.openrouter || '');
      setElevenLabsKeyInput(keys.elevenlabs || '');
      setSelectedModel(getCurrentModel());
    }
  }, [isOpen, getApiKeys, getCurrentModel]);

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

    // Determine if it's OpenAI or OpenRouter key
    const isOpenAI = apiKeyInput.startsWith('sk-proj-') || apiKeyInput.startsWith('sk-') && !apiKeyInput.startsWith('sk-or-');
    const isOpenRouter = apiKeyInput.startsWith('sk-or-');
    
    if (isOpenAI) {
      setApiKeys({ openai: apiKeyInput.trim() });
    } else if (isOpenRouter) {
      setApiKeys({ openrouter: apiKeyInput.trim() });
    } else {
      // Default to OpenAI
      setApiKeys({ openai: apiKeyInput.trim() });
    }
    
    setApiKeyInput('');
    toast.success('API key saved successfully!');
  };

  const handleSaveElevenLabsKey = () => {
    if (!elevenLabsKeyInput.trim()) {
      toast.error('Please enter an ElevenLabs API key');
      return;
    }

    setApiKeys({ elevenlabs: elevenLabsKeyInput.trim() });
    setElevenLabsKeyInput('');
    toast.success('ElevenLabs API key saved successfully!');
  };

  const handleModelChange = modelId => {
    setSelectedModel(modelId);
    switchModel(modelId);
    toast.success(`Model switched to ${modelId}`);
  };

  const handleGetApiKey = () => {
    window.open('https://openrouter.ai/keys', '_blank');
  };

  const handleGetElevenLabsKey = () => {
    window.open('https://elevenlabs.io/api', '_blank');
  };

  const availableModels = getAvailableModels();
  const isConfigured = isApiConfigured;
  const isElevenLabsReady = isElevenLabsConfigured;

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

            {/* API Key Section */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#00FFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Key size={16} />
                AI API Key (OpenAI or OpenRouter)
              </h3>
              
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="Enter your API key..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#00FFFF',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#00FFFF',
                  }}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                  onClick={handleSaveApiKey}
                  style={{
                    padding: '8px 16px',
                    background: '#00FFFF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  Save API Key
                </button>
                <button
                  onClick={handleGetApiKey}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(0, 255, 255, 0.2)',
                    color: '#00FFFF',
                    border: '1px solid #00FFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <ExternalLink size={12} />
                  Get Key
                </button>
              </div>
              
              <div
                style={{
                  padding: '8px 12px',
                  background: isConfigured ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                  border: `1px solid ${isConfigured ? '#00FF00' : '#FF0000'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: isConfigured ? '#00FF00' : '#FF0000',
                }}
              >
                Status: {isConfigured ? 'Configured' : 'Not Configured'}
              </div>
            </div>

            {/* ElevenLabs API Key Section */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#00FFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Brain size={16} />
                ElevenLabs API Key (Voice)
              </h3>
              
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type={showElevenLabsKey ? 'text' : 'password'}
                  value={elevenLabsKeyInput}
                  onChange={e => setElevenLabsKeyInput(e.target.value)}
                  placeholder="Enter your ElevenLabs API key..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#00FFFF',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={() => setShowElevenLabsKey(!showElevenLabsKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#00FFFF',
                  }}
                >
                  {showElevenLabsKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                  onClick={handleSaveElevenLabsKey}
                  style={{
                    padding: '8px 16px',
                    background: '#00FFFF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  Save ElevenLabs Key
                </button>
                <button
                  onClick={handleGetElevenLabsKey}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(0, 255, 255, 0.2)',
                    color: '#00FFFF',
                    border: '1px solid #00FFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <ExternalLink size={12} />
                  Get Key
                </button>
              </div>
              
              <div
                style={{
                  padding: '8px 12px',
                  background: isElevenLabsReady ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                  border: `1px solid ${isElevenLabsReady ? '#00FF00' : '#FF0000'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: isElevenLabsReady ? '#00FF00' : '#FF0000',
                }}
              >
                Status: {isElevenLabsReady ? 'Configured' : 'Not Configured'}
              </div>
            </div>

            {/* Model Selection */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  color: '#00FFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  marginBottom: '10px',
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
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  borderRadius: '8px',
                  color: '#00FFFF',
                  fontSize: '14px',
                }}
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            <div
              style={{
                padding: '15px',
                background: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#00FFFF',
              }}
            >
              <h4 style={{ marginBottom: '8px', fontWeight: '600' }}>
                Setup Instructions:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '15px' }}>
                <li>Get an API key from OpenRouter.ai or OpenAI</li>
                <li>Get an ElevenLabs API key for voice features</li>
                <li>Select your preferred AI model</li>
                <li>Save your settings to start chatting!</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
