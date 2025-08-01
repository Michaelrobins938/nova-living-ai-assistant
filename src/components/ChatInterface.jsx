import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  Trash2,
  Download,
  Copy,
  MessageSquare,
  Brain,
  Settings,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Mic,
  MicOff,
  Camera,
  Video,
  Monitor,
  Eye,
  EyeOff,
  Upload,
  File,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import useAIStore from '../stores/aiStore';
import { useAudioStore } from '../stores/audioStore';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import ModelSelector from './ModelSelector';
import SettingsPanel from './SettingsPanel';

const ChatInterface = ({ isOpen, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedImageModel, setSelectedImageModel] =
    useState('openai/dall-e-3');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [imageQuality, setImageQuality] = useState('standard');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isScreenWatching, setIsScreenWatching] = useState(false);
  const [screenCapture, setScreenCapture] = useState(null);
  const [screenAnalysis, setScreenAnalysis] = useState('');
  const [showScreenPanel, setShowScreenPanel] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [isProcessingMultimodal, setIsProcessingMultimodal] = useState(false);
  const [isGeneratingImageGlobal, setIsGeneratingImageGlobal] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef();
  const cameraRef = useRef();
  const screenCaptureRef = useRef();
  const screenIntervalRef = useRef();

  const {
    processUserInput,
    conversationHistory,
    aiStatus,
    clearConversation,
    getConversationHistory,
    setConversationHistory,
    generateImage,
    getImageGenerationModels,
    getImageGenerationStatus,
    startListening,
    stopListening,
    initializeAI,
    testApiConnection,
    getProcessingStatus,
    addTask,
    getActiveTasks,
    completeTask,
    removeTask,
    getGeneratedImages,
    startComputerUse,
    startCodeInterpreter,
    createAssistant,
    createThread,
    runAssistant,
    getAssistants,
    getComputerUseStatus,
    getCodeInterpreterStatus,
    lastVoiceTranscript,
  } = useAIStore();

  const { isPlaying, currentAudio, play, pause, stop, volume, setVolume } =
    useAudioStore();

  // Initialize AI on component mount
  useEffect(() => {
    console.log('Initializing Nova AI...');
    initializeAI();
  }, []); // Remove initializeAI from dependencies to prevent infinite loops

  // Get current model info - use state to avoid calling during render
  const [currentModel, setCurrentModel] = useState(null);

  useEffect(() => {
    // Get function from store to avoid calling during render
    const { getCurrentModel } = useAIStore.getState();
    const model = getCurrentModel();
    setCurrentModel(model);
  }, []); // Remove dependencies to prevent infinite loops

  // Handle voice input and populate chat
  const handleVoiceInput = useCallback(transcribedText => {
    setInputMessage(transcribedText);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 100);
  }, []);

  // Watch for voice transcripts and populate the text box
  useEffect(() => {
    if (lastVoiceTranscript) {
      setInputMessage(lastVoiceTranscript);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
      toast.success(
        'Voice input captured! Edit if needed, then press Enter to send.'
      );
    }
  }, [lastVoiceTranscript]);

  // Text-to-Speech function
  const speakText = text => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = event => {
        console.error('TTS error:', event.error);
        setIsSpeaking(false);
        toast.error('TTS error occurred');
      };

      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  // Stop TTS
  const stopTTS = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Cleanup screen capture on unmount
  useEffect(() => {
    return () => {
      if (screenIntervalRef.current) {
        clearInterval(screenIntervalRef.current);
      }
    };
  }, []);

  // Start real-time screen watching
  const startScreenWatching = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: false,
      });

      setIsScreenWatching(true);
      setShowScreenPanel(true);

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      screenIntervalRef.current = setInterval(async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);

          canvas.toBlob(async blob => {
            const file = new File([blob], 'screen-capture.jpg', {
              type: 'image/jpeg',
            });
            setScreenCapture(URL.createObjectURL(blob));

            const analysis = await analyzeScreenContent(canvas);
            setScreenAnalysis(analysis);

            if (
              analysis.includes('significant') ||
              analysis.includes('change')
            ) {
              const message = `Screen activity detected: ${analysis}`;
              processUserInput(message);
            }
          }, 'image/jpeg');
        } catch (error) {
          console.error('Screen capture error:', error);
        }
      }, 5000);

      stream.getVideoTracks()[0].onended = () => {
        stopScreenWatching();
      };
    } catch (error) {
      console.error('Screen capture permission denied:', error);
      toast.error('Screen capture permission denied');
    }
  };

  // Stop screen watching
  const stopScreenWatching = () => {
    if (screenIntervalRef.current) {
      clearInterval(screenIntervalRef.current);
      screenIntervalRef.current = null;
    }
    setIsScreenWatching(false);
    setScreenCapture(null);
    setScreenAnalysis('');
    setShowScreenPanel(false);
  };

  // Analyze screen content
  const analyzeScreenContent = async canvas => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let brightness = 0;
    let colorVariety = 0;
    const colors = new Set();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      brightness += (r + g + b) / 3;
      colors.add(`${r},${g},${b}`);
    }

    brightness = brightness / (data.length / 4);
    colorVariety = colors.size;

    if (brightness > 200) {
      return 'Bright screen detected - likely active application or document';
    } else if (brightness < 50) {
      return 'Dark screen detected - possibly idle or dark application';
    } else if (colorVariety > 1000) {
      return 'High color variety detected - likely active content or video';
    } else {
      return 'Moderate screen activity - normal desktop usage';
    }
  };

  // Handle file upload with multimodal processing
  const handleFileUpload = async event => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : file.type.startsWith('audio/')
            ? 'audio'
            : 'document',
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setShowFileUpload(false);

    for (const fileObj of newFiles) {
      setIsProcessing(true);
      try {
        if (fileObj.type === 'image') {
          const base64 = await fileToBase64(fileObj.file);
          const multimodalData = {
            type: 'image',
            base64: base64.split(',')[1],
          };

          const message = `I've uploaded an image: ${fileObj.file.name}. Can you analyze this image for me?`;
          await processUserInput(message, multimodalData);
        } else {
          const description = await analyzeFile(fileObj.file);
          const message = `I've uploaded a ${fileObj.type} file: ${fileObj.file.name}. ${description}`;
          await processUserInput(message);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Error processing file');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Convert file to base64
  const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Analyze uploaded file
  const analyzeFile = async file => {
    if (file.type.startsWith('image/')) {
      return 'This appears to be an image file. I can help you analyze its contents.';
    } else if (file.type.startsWith('video/')) {
      return 'This is a video file. I can help you with video analysis.';
    } else if (file.type.startsWith('audio/')) {
      return 'This is an audio file. I can help you with audio processing.';
    } else {
      return 'This is a document file. I can help you with document analysis.';
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();

          setTimeout(async () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            canvas.toBlob(async blob => {
              const file = new File([blob], 'captured-image.jpg', {
                type: 'image/jpeg',
              });
              const fileObj = {
                id: Date.now(),
                file,
                type: 'image',
                preview: URL.createObjectURL(blob),
              };
              setCapturedImage(fileObj);
              setUploadedFiles(prev => [...prev, fileObj]);

              setIsProcessing(true);
              try {
                const base64 = await fileToBase64(file);
                const multimodalData = {
                  type: 'image',
                  base64: base64.split(',')[1],
                };

                const message = `I've captured an image from the camera. Can you analyze what you see?`;
                await processUserInput(message, multimodalData);
              } catch (error) {
                console.error('Error processing captured image:', error);
                toast.error('Error processing captured image');
              } finally {
                setIsProcessing(false);
              }
            }, 'image/jpeg');

            stream.getTracks().forEach(track => track.stop());
          }, 1000);
        })
        .catch(error => {
          console.error('Camera error:', error);
          toast.error('Camera access denied');
        });
    }
  };

  // Remove uploaded file
  const removeFile = fileId => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  // Add task
  const handleAddTask = () => {
    const taskTitle = prompt('Enter task title:');
    if (taskTitle) {
      addTask({
        title: taskTitle,
        description: prompt('Enter task description (optional):') || '',
        priority: 'medium',
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Debug selectedChat changes
  useEffect(() => {
    console.log('Selected chat updated:', selectedChat);
    if (selectedChat) {
      console.log('Selected chat messages:', selectedChat.messages);
    }
  }, [selectedChat]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Load chats from localStorage
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('nova_chats');
    return saved ? JSON.parse(saved) : [];
  });

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('nova_chats', JSON.stringify(chats));
  }, [chats]);

  // Auto-create new chat if none exists or if returning to app
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    } else if (!selectedChat) {
      const mostRecentChat = chats[0];
      setSelectedChat(mostRecentChat);
      if (mostRecentChat.messages.length > 0) {
        clearConversation();
        setConversationHistory(mostRecentChat.messages);
      }
    }
  }, [chats, selectedChat]);

  // Create new chat
  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      model: currentModel?.name || 'GPT-4',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
    setChatTitle('');
    setShowNewChat(false);
    clearConversation();
    toast.success('New chat created!');
  };

  // Delete chat
  const deleteChat = chatId => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChat?.id === chatId) {
      createNewChat();
    }
    toast.success('Chat deleted!');
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const message = inputMessage.trim();
    console.log('Sending message:', message);
    setInputMessage('');
    setIsTyping(true);

    if (!selectedChat) {
      createNewChat();
    }

    const updatedChat = {
      ...selectedChat,
      messages: [
        ...selectedChat.messages,
        {
          role: 'user',
          content: message,
          timestamp: new Date(),
        },
      ],
      updatedAt: new Date(),
    };

    console.log('Updated chat with user message:', updatedChat);
    setChats(prev =>
      prev.map(chat => (chat.id === selectedChat.id ? updatedChat : chat))
    );
    setSelectedChat(updatedChat);

    if (updatedChat.title === 'New Chat') {
      const newTitle =
        message.length > 30 ? message.substring(0, 30) + '...' : message;
      const titledChat = {
        ...updatedChat,
        title: newTitle,
      };
      setChats(prev =>
        prev.map(chat => (chat.id === selectedChat.id ? titledChat : chat))
      );
      setSelectedChat(titledChat);
    }

    try {
      console.log('Processing with AI...');
      const aiResponse = await processUserInput(message);
      console.log('AI response received:', aiResponse);

      const conversationHistory = getConversationHistory();
      const latestMessage = conversationHistory[conversationHistory.length - 1];

      if (aiResponse && selectedChat) {
        const aiMessage = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        };

        if (
          latestMessage &&
          latestMessage.type === 'image-response' &&
          latestMessage.image
        ) {
          aiMessage.type = 'image-response';
          aiMessage.image = latestMessage.image;
        }

        const finalChat = {
          ...selectedChat,
          messages: [...selectedChat.messages, aiMessage],
          updatedAt: new Date(),
        };

        console.log('Updated chat with AI response:', finalChat);
        setChats(prev =>
          prev.map(chat => (chat.id === selectedChat.id ? finalChat : chat))
        );
        setSelectedChat(finalChat);

        // Speak the AI response if TTS is enabled
        if (ttsEnabled) {
          speakText(aiResponse);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  // Generate image within chat
  const generateImageInChat = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }

    setIsGeneratingImage(true);

    try {
      const userMessage = {
        role: 'user',
        content: `Generate an image: ${imagePrompt}`,
        timestamp: new Date(),
        type: 'image-request',
      };

      if (selectedChat) {
        const updatedChat = {
          ...selectedChat,
          messages: [...selectedChat.messages, userMessage],
          updatedAt: new Date(),
        };

        setChats(prev =>
          prev.map(chat => (chat.id === selectedChat.id ? updatedChat : chat))
        );
        setSelectedChat(updatedChat);
      }

      const generatedImage = await generateImage(
        imagePrompt,
        selectedImageModel,
        imageSize,
        imageQuality
      );

      console.log('Generated image result:', generatedImage);

      if (!generatedImage) {
        throw new Error('Image generation failed - no image returned');
      }

      const aiMessage = {
        role: 'assistant',
        content: `Here's your generated image: ${imagePrompt}`,
        timestamp: new Date(),
        type: 'image-response',
        image: generatedImage,
      };

      if (selectedChat) {
        const updatedChat = {
          ...selectedChat,
          messages: [...selectedChat.messages, aiMessage],
          updatedAt: new Date(),
        };

        setChats(prev =>
          prev.map(chat => (chat.id === selectedChat.id ? updatedChat : chat))
        );
        setSelectedChat(updatedChat);
      }

      setImagePrompt('');
      setShowImageGenerator(false);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Copy message to clipboard
  const copyMessage = content => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard!');
  };

  // Export chat
  const exportChat = chat => {
    const chatData = {
      title: chat.title,
      model: chat.model,
      createdAt: chat.createdAt,
      messages: chat.messages,
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Chat exported!');
  };

  // Load chat into conversation
  const loadChat = chat => {
    setSelectedChat(chat);
    clearConversation();

    if (chat.messages.length > 0) {
      setConversationHistory(chat.messages);
    }

    toast.success(`Loaded chat: ${chat.title}`);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="chat-interface-container"
    >
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="new-chat-button" onClick={createNewChat}>
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-list-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
              onClick={() => loadChat(chat)}
            >
              <MessageSquare size={16} />
              <span className="chat-title">{chat.title}</span>
              <button
                className="delete-chat-button"
                onClick={e => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button
            className="sidebar-footer-button"
            onClick={() => setShowModelSelector(true)}
          >
            <Brain size={16} /> Model
          </button>
          <button
            className="sidebar-footer-button"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat-area">
        <div className="chat-messages">
          {selectedChat ? (
            selectedChat.messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                <div className="message-icon">
                  {message.role === 'user' ? 'U' : 'A'}
                </div>
                <div className="message-content">
                  <div className="message-role">
                    {message.role === 'user' ? 'You' : 'Eidolon'}
                  </div>
                  <div className="message-text">{message.content}</div>
                  {message.type === 'image-response' && message.image && (
                    <div className="generated-image-container">
                      <img
                        src={message.image.url}
                        alt={message.image.prompt}
                        className="generated-image"
                      />
                      <div className="generated-image-info">
                        Generated with {message.image.model}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-messages">
              No messages yet. Start a conversation with Eidolon.
            </div>
          )}
          {isTyping && (
            <div className="chat-message assistant typing">
              <div className="message-icon">A</div>
              <div className="message-content">
                <div className="message-role">Eidolon</div>
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Shift+Enter for new line)"
            className="chat-input"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Modals and Toasters */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#00FFFF',
            border: '1px solid #00FFFF',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      <ModelSelector
        isOpen={showModelSelector}
        onClose={() => setShowModelSelector(false)}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </motion.div>
  );
};

export default ChatInterface;
