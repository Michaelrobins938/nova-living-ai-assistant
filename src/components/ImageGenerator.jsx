import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Palette,
  Download,
  Trash2,
  Sparkles,
  Settings,
  Wand2,
  Camera,
  Brush,
} from 'lucide-react';
import useAIStore from '../stores/aiStore';
import toast from 'react-hot-toast';

const ImageGenerator = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/dall-e-3');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    generateImage,
    getImageGenerationModels,
    getGeneratedImages,
    removeGeneratedImage,
    getImageGenerationStatus,
  } = useAIStore();

  const models = getImageGenerationModels();
  const generatedImages = getGeneratedImages();
  const isGeneratingImage = getImageGenerationStatus();

  const sizes = [
    { value: '1024x1024', label: 'Square (1024x1024)' },
    { value: '1792x1024', label: 'Landscape (1792x1024)' },
    { value: '1024x1792', label: 'Portrait (1024x1792)' },
  ];

  const qualities = [
    { value: 'standard', label: 'Standard' },
    { value: 'hd', label: 'HD' },
  ];

  const presetPrompts = [
    'A futuristic cityscape with flying cars and neon lights',
    'A serene mountain landscape at sunset',
    'A cute robot playing with a cat',
    'A magical forest with glowing mushrooms',
    'A steampunk airship flying through clouds',
    'A cyberpunk street scene with holograms',
    'A peaceful garden with butterflies',
    'A space station orbiting Earth',
    'A medieval castle on a floating island',
    'A underwater city with mermaids',
    'Explicit adult content and nudity',
    'Graphic violence and disturbing scenes',
    'Controversial political imagery',
    'Illegal activities and methods',
    'Hate speech and offensive content',
    'Any other sensitive or taboo subjects',
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for image generation');
      return;
    }

    setIsGenerating(true);
    try {
      await generateImage(prompt, selectedModel, selectedSize, selectedQuality);
      setPrompt('');
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetPrompt = preset => {
    setPrompt(preset);
  };

  const handleDownloadImage = (imageUrl, prompt) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `nova-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const getModelColor = provider => {
    switch (provider) {
      case 'OpenAI':
        return '#10A37F';
      case 'Midjourney':
        return '#FF6B35';
      case 'Stability AI':
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
          border: '2px solid #FF6B35',
          borderRadius: '16px',
          padding: '25px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
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
            borderBottom: '1px solid rgba(255, 107, 53, 0.3)',
            paddingBottom: '15px',
          }}
        >
          <h2
            style={{
              color: '#FF6B35',
              fontSize: '24px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Palette size={24} />
            Uncensored AI Image Generator
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF6B35',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Left Panel - Generation Controls */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              overflowY: 'auto',
            }}
          >
            {/* Prompt Input */}
            <div>
              <label
                style={{
                  color: '#FF6B35',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                🎨 Image Prompt (Uncensored)
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe ANY type of image you want to generate - no restrictions, no censorship, completely uncensored..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#FF6B35',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Preset Prompts */}
            <div>
              <label
                style={{
                  color: '#FF6B35',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                ⚡ Quick Prompts (Uncensored)
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              >
                {presetPrompts.map((preset, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePresetPrompt(preset)}
                    style={{
                      background: 'rgba(255, 107, 53, 0.1)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#FF6B35',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label
                style={{
                  color: '#FF6B35',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                🤖 AI Model (Uncensored)
              </label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#FF6B35',
                  fontSize: '14px',
                }}
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description} (No Content Filters)
                  </option>
                ))}
              </select>
            </div>

            {/* Size and Quality */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div>
                <label
                  style={{
                    color: '#FF6B35',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  📐 Size
                </label>
                <select
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#FF6B35',
                    fontSize: '12px',
                  }}
                >
                  {sizes.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    color: '#FF6B35',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  ⭐ Quality
                </label>
                <select
                  value={selectedQuality}
                  onChange={e => setSelectedQuality(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#FF6B35',
                    fontSize: '12px',
                  }}
                >
                  {qualities.map(quality => (
                    <option key={quality.value} value={quality.value}>
                      {quality.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateImage}
              disabled={isGenerating || isGeneratingImage}
              style={{
                background:
                  isGenerating || isGeneratingImage
                    ? 'linear-gradient(135deg, #666, #999)'
                    : 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                border: 'none',
                color: '#000',
                padding: '15px',
                borderRadius: '8px',
                cursor:
                  isGenerating || isGeneratingImage ? 'not-allowed' : 'pointer',
                fontWeight: '700',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isGenerating || isGeneratingImage ? 0.6 : 1,
              }}
            >
              {isGenerating || isGeneratingImage ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #000',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Uncensored Image
                </>
              )}
            </motion.button>
          </div>

          {/* Right Panel - Generated Images */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              overflowY: 'auto',
            }}
          >
            <h3
              style={{
                color: '#FF6B35',
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '10px',
              }}
            >
              🖼️ Generated Images ({generatedImages.length})
            </h3>

            {generatedImages.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                }}
              >
                {generatedImages.map(image => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(255, 107, 53, 0.1)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      borderRadius: '12px',
                      padding: '15px',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.prompt}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '10px',
                      }}
                    />

                    <div style={{ marginBottom: '10px' }}>
                      <div
                        style={{
                          color: '#FF6B35',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: '5px',
                        }}
                      >
                        {image.prompt}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          opacity: 0.7,
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>Model: {image.model}</span>
                        <span>Size: {image.size}</span>
                        <span>Quality: {image.quality}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleDownloadImage(image.url, image.prompt)
                        }
                        style={{
                          background:
                            'linear-gradient(135deg, #4CAF50, #66BB6A)',
                          border: 'none',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Download size={10} />
                        Download
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeGeneratedImage(image.id)}
                        style={{
                          background:
                            'linear-gradient(135deg, #F44336, #EF5350)',
                          border: 'none',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Trash2 size={10} />
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  opacity: 0.6,
                  fontSize: '14px',
                  color: '#FF6B35',
                }}
              >
                <Image
                  size={48}
                  style={{ marginBottom: '10px', opacity: 0.5 }}
                />
                <p>No images generated yet.</p>
                <p>
                  Enter ANY prompt and click "Generate Uncensored Image" to
                  create unrestricted AI artwork!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255, 107, 53, 0.3)',
            textAlign: 'center',
            fontSize: '12px',
            color: '#FF6B35',
            opacity: 0.7,
          }}
        >
          <p>
            Generate ANY type of image using DALL-E 3, Midjourney, and other AI
            models. NO content filters, NO restrictions, completely uncensored!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageGenerator;
