import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  MessageCircle,
  Play,
  Pause,
  Square,
  Volume2,
  Upload,
  X,
  Settings,
} from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import useAIStore from '../stores/aiStore';
import toast from 'react-hot-toast';

const ControlPanel = ({
  isListening,
  isSpeaking,
  isPlaying,
  onToggleListening,
  onTogglePlayback,
  onStop,
  volume,
  onVolumeChange,
  onShowConversation,
  onShowSettings,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const { loadAudio } = useAudioStore();
  const { isApiConfigured, isElevenLabsConfigured } = useAIStore();

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        loadAudio(file);
      } else {
        toast.error('Please select an audio file');
      }
    }
  };

  const handleDrop = event => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        loadAudio(file);
      } else {
        toast.error('Please drop an audio file');
      }
    }
  };

  const handleDragOver = event => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      className="control-panel"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '2px solid #00FFFF',
        borderRadius: '15px',
        padding: '25px',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 255, 255, 0.2)',
        minWidth: '350px',
        maxWidth: '400px',
      }}
    >
      {/* AI Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            color: '#00FFFF',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '15px',
          }}
        >
          🤖 AI Assistant
        </h3>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleListening}
            style={{
              background: isListening
                ? 'linear-gradient(135deg, #FF0055, #FF3366)'
                : 'linear-gradient(135deg, #00FFFF, #FF0055)',
              border: 'none',
              color: '#000',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              animation: isListening ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowConversation}
            style={{
              background: 'linear-gradient(135deg, #00FFFF, #FF0055)',
              border: 'none',
              color: '#000',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <MessageCircle size={16} />
            Chat
          </motion.button>
        </div>

        <div
          style={{
            textAlign: 'center',
            padding: '8px',
            background: 'rgba(0, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#00FFFF',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          {isListening
            ? 'Listening...'
            : isSpeaking
              ? 'Speaking...'
              : 'Ready to help'}
        </div>

        {/* API Status */}
        {!isApiConfigured() && (
          <div
            style={{
              textAlign: 'center',
              padding: '8px',
              background: 'rgba(255, 0, 85, 0.1)',
              borderRadius: '8px',
              color: '#FF0055',
              fontSize: '11px',
              marginTop: '8px',
            }}
          >
            ⚠️ OpenRouter API key needed for AI capabilities
          </div>
        )}

        {!isElevenLabsConfigured() && (
          <div
            style={{
              textAlign: 'center',
              padding: '8px',
              background: 'rgba(255, 165, 0, 0.1)',
              border: '1px solid #FFA500',
              borderRadius: '8px',
              color: '#FFA500',
              fontSize: '11px',
              marginTop: '8px',
            }}
          >
            ⚠️ ElevenLabs API key needed for high-quality voice
          </div>
        )}
      </div>

      {/* Audio Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            color: '#00FFFF',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '15px',
          }}
        >
          🎵 Audio Controls
        </h3>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTogglePlayback}
            disabled={!isPlaying && !isPlaying}
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #FF0055, #FF3366)'
                : 'linear-gradient(135deg, #00FFFF, #FF0055)',
              border: 'none',
              color: '#000',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: isPlaying ? 'pointer' : 'not-allowed',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isPlaying ? 1 : 0.5,
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            style={{
              background: 'linear-gradient(135deg, #FF0055, #FF6600)',
              border: 'none',
              color: '#000',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Square size={16} />
            Stop
          </motion.button>
        </div>

        {/* Volume Control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px',
          }}
        >
          <Volume2 size={16} color="#00FFFF" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={e => onVolumeChange(parseFloat(e.target.value))}
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #333, #555)',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <span
            style={{ color: '#00FFFF', fontSize: '12px', minWidth: '40px' }}
          >
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <h3
          style={{
            color: '#00FFFF',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '15px',
          }}
        >
          📁 Upload Audio
        </h3>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: isDragging
              ? 'linear-gradient(135deg, #2a4a2a, #3a5a3a)'
              : 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
            border: `2px dashed ${isDragging ? '#00FF66' : '#00FFFF'}`,
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isDragging ? '0 0 30px rgba(0, 255, 102, 0.5)' : 'none',
          }}
        >
          <Upload size={24} color="#00FFFF" style={{ marginBottom: '8px' }} />
          <div style={{ color: '#fff', fontSize: '14px' }}>
            <strong>Upload Audio File</strong>
            <br />
            <small>Click here or drag & drop MP3, WAV, OGG files</small>
          </div>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Keyboard Shortcuts */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(0, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 255, 255, 0.2)',
        }}
      >
        <h4 style={{ color: '#FF0055', fontSize: '12px', marginBottom: '8px' }}>
          ⌨️ Keyboard Shortcuts
        </h4>
        <div style={{ fontSize: '11px', color: '#00FFFF' }}>
          <div>Space - Play/Pause</div>
          <div>T - Toggle Chat</div>
          <div>M - Toggle Microphone</div>
          <div>C - Toggle Controls</div>
          <div>S - Open Settings</div>
        </div>
      </div>

      {/* Settings Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onShowSettings}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#fff',
          padding: '12px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          marginTop: '15px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        <Settings size={16} />
        AI Settings
      </motion.button>
    </motion.div>
  );
};

export default ControlPanel;
