import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, Brain, Zap, Shield, Clock } from 'lucide-react';
import useAIStore from '../stores/aiStore';

const ModelSelector = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { switchModel } = useAIStore();

  // Get models and current model info - use state to avoid calling during render
  const [models, setModels] = useState([]);
  const [currentModelInfo, setCurrentModelInfo] = useState(null);

  useEffect(() => {
    // Get functions from store to avoid calling during render
    const { getAvailableModels, getCurrentModel } = useAIStore.getState();
    const availableModels = getAvailableModels();
    const currentModel = getCurrentModel();
    setModels(availableModels);
    setCurrentModelInfo(currentModel);
  }, []); // Remove dependencies to prevent infinite loops

  const categories = {
    all: { name: 'All Models', icon: <Brain size={16} /> },
    multimodal: { name: 'Multimodal', icon: <Eye size={16} /> },
    text: { name: 'Text Only', icon: <Zap size={16} /> },
    fast: { name: 'Fast', icon: <Clock size={16} /> },
  };

  const filteredModels = models.filter(model => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'multimodal')
      return model.capabilities.includes('multimodal');
    if (selectedCategory === 'text')
      return (
        model.capabilities.length === 1 && model.capabilities.includes('text')
      );
    if (selectedCategory === 'fast') return model.maxTokens <= 8192;
    return true;
  });

  const getCapabilityIcon = capability => {
    switch (capability) {
      case 'text':
        return '📝';
      case 'image':
        return '🖼️';
      case 'vision':
        return '👁️';
      case 'multimodal':
        return '🎯';
      default:
        return '⚡';
    }
  };

  const getProviderColor = provider => {
    switch (provider) {
      case 'OpenAI':
        return '#10A37F';
      case 'Anthropic':
        return '#FF6B35';
      case 'Google':
        return '#4285F4';
      case 'Meta':
        return '#1877F2';
      case 'Mistral':
        return '#7C3AED';
      default:
        return '#6B7280';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #00FFFF',
          borderRadius: '16px',
          padding: '25px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'hidden',
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
            borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
            paddingBottom: '15px',
          }}
        >
          <h2
            style={{
              color: '#00FFFF',
              fontSize: '24px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Settings size={24} />
            AI Model Selection
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#00FFFF',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
            }}
          >
            ×
          </button>
        </div>

        {/* Current Model Display */}
        {currentModelInfo && (
          <div
            style={{
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid #00FFFF',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                color: '#00FFFF',
                fontSize: '16px',
                marginBottom: '8px',
              }}
            >
              Current Model: {currentModelInfo.name}
            </h3>
            <p
              style={{
                color: '#00FFFF',
                opacity: 0.8,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              {currentModelInfo.description}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currentModelInfo.capabilities.map(cap => (
                <span
                  key={cap}
                  style={{
                    background: 'rgba(0, 255, 255, 0.2)',
                    color: '#00FFFF',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {getCapabilityIcon(cap)} {cap}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          {Object.entries(categories).map(([key, category]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(key)}
              style={{
                background:
                  selectedCategory === key
                    ? 'linear-gradient(135deg, #00FFFF, #FF0055)'
                    : 'rgba(0, 255, 255, 0.1)',
                border: '1px solid #00FFFF',
                color: selectedCategory === key ? '#000' : '#00FFFF',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Models Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {filteredModels.map(model => (
            <motion.div
              key={model.id}
              whileHover={{ scale: 1.02 }}
              style={{
                background:
                  currentModel === model.id
                    ? 'rgba(0, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.3)',
                border:
                  currentModel === model.id
                    ? '2px solid #00FFFF'
                    : '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => {
                switchModel(model.id);
                onClose();
              }}
            >
              {/* Model Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <h3
                    style={{
                      color: '#00FFFF',
                      fontSize: '16px',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {model.name}
                  </h3>
                  <div
                    style={{
                      background: getProviderColor(model.provider),
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      display: 'inline-block',
                    }}
                  >
                    {model.provider}
                  </div>
                </div>
                {currentModel === model.id && (
                  <div
                    style={{
                      background: '#00FFFF',
                      color: '#000',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '700',
                    }}
                  >
                    ACTIVE
                  </div>
                )}
              </div>

              {/* Model Description */}
              <p
                style={{
                  color: '#00FFFF',
                  opacity: 0.8,
                  fontSize: '12px',
                  marginBottom: '12px',
                  lineHeight: '1.4',
                }}
              >
                {model.description}
              </p>

              {/* Capabilities */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    color: '#00FFFF',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginBottom: '6px',
                  }}
                >
                  Capabilities:
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {model.capabilities.map(cap => (
                    <span
                      key={cap}
                      style={{
                        background: 'rgba(0, 255, 255, 0.2)',
                        color: '#00FFFF',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      {getCapabilityIcon(cap)} {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Model Stats */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: '#00FFFF',
                  opacity: 0.7,
                }}
              >
                <span>Max Tokens: {model.maxTokens.toLocaleString()}</span>
                <span>Provider: {model.provider}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(0, 255, 255, 0.3)',
            textAlign: 'center',
            fontSize: '12px',
            color: '#00FFFF',
            opacity: 0.7,
          }}
        >
          <p>
            Select a model to switch Nova's AI capabilities. Different models
            excel at different tasks.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModelSelector;
