import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioStore } from '../stores/audioStore';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const { audioData, updateAudioData } = useAudioStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      if (audioData) {
        const barWidth = width / audioData.length;
        const barMaxHeight = height * 0.8;

        for (let i = 0; i < audioData.length; i++) {
          const barHeight = (audioData[i] / 255) * barMaxHeight;
          const x = i * barWidth;
          const y = height - barHeight;

          // Create gradient
          const gradient = ctx.createLinearGradient(x, y, x, height);
          gradient.addColorStop(0, '#00FFFF');
          gradient.addColorStop(0.5, '#FF0055');
          gradient.addColorStop(1, '#00FFFF');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [audioData]);

  // Update audio data
  useEffect(() => {
    const interval = setInterval(() => {
      updateAudioData();
    }, 50);

    return () => clearInterval(interval);
  }, [updateAudioData]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #00FFFF',
        borderRadius: '8px',
        padding: '10px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        style={{
          display: 'block',
          borderRadius: '4px',
        }}
      />
    </motion.div>
  );
};

export default AudioVisualizer;
