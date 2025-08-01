import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Canvas } from '@react-three/fiber';
import './App.css';
import ChatInterface from './components/ChatInterface';
import AssistantChatWrapper from './components/AssistantChatWrapper';
import NovaOrb from './components/NovaOrb';
import useAIStore from './stores/aiStore';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [useAssistantUI, setUseAssistantUI] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { initializeAI, aiStatus } = useAIStore();

  useEffect(() => {
    const initEidolon = async () => {
      try {
        await initializeAI();
        console.log('✅ Nova AI initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Nova AI:', error);
        setHasError(true);
      }
    };

    initEidolon();
  }, []);

  // Error boundary fallback
  if (hasError) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #000000, #1a0033)',
        color: '#00FFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1>Nova Living AI Assistant</h1>
        <p>Welcome to your AI companion!</p>
        <button
          onClick={() => setHasError(false)}
          style={{
            padding: '10px 20px',
            background: '#00FFFF',
            color: '#000000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="app"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(to bottom, #000000, #1a0033)',
        color: '#00FFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 3D Nova Orb Background */}
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setHasError(true);
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <NovaOrb
          isListening={aiStatus === 'listening'}
          isSpeaking={aiStatus === 'speaking'}
        />
      </Canvas>

      {/* Toggle Button */}
      <button
        onClick={() => setUseAssistantUI(!useAssistantUI)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 100,
          padding: '10px',
          background: '#00FFFF',
          color: '#000000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Switch to {useAssistantUI ? 'Original Chat' : 'Assistant UI'}
      </button>

      {/* Main Chat Interface */}
      {useAssistantUI ? (
        <AssistantChatWrapper />
      ) : (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Toast Notifications */}
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
    </div>
  );
}

export default App;
