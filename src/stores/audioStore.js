import { create } from 'zustand';
import toast from 'react-hot-toast';

const useAudioStore = create((set, get) => ({
  // State
  isPlaying: false,
  currentAudio: null,
  audioContext: null,
  analyser: null,
  volume: 0.5,
  audioData: null,
  audioLoaded: false,

  // Initialize audio context
  initializeAudio: () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.75;

      set({ audioContext, analyser });
      console.log('Audio context initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      toast.error('Failed to initialize audio');
      return false;
    }
  },

  // Load audio file
  loadAudio: file => {
    const { audioContext, analyser } = get();
    if (!audioContext || !analyser) {
      if (!get().initializeAudio()) {
        return false;
      }
    }

    try {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.volume = get().volume;

      audio.addEventListener('loadedmetadata', () => {
        console.log('Audio loaded:', file.name);
        set({
          currentAudio: audio,
          audioLoaded: true,
        });
        toast.success(`${file.name} loaded successfully`);
      });

      audio.addEventListener('error', e => {
        console.error('Audio loading error:', e);
        toast.error('Failed to load audio file');
      });

      audio.addEventListener('ended', () => {
        set({ isPlaying: false });
      });

      // Connect to analyser
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      return true;
    } catch (error) {
      console.error('Error loading audio:', error);
      toast.error('Error loading audio file');
      return false;
    }
  },

  // Play audio
  play: () => {
    const { currentAudio, audioLoaded, audioContext } = get();

    if (!currentAudio || !audioLoaded) {
      toast.error('No audio loaded');
      return;
    }

    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    currentAudio
      .play()
      .then(() => {
        set({ isPlaying: true });
        toast.success('Playing audio');
      })
      .catch(error => {
        console.error('Playback error:', error);
        toast.error('Playback failed');
      });
  },

  // Pause audio
  pause: () => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      set({ isPlaying: false });
      toast.success('Audio paused');
    }
  },

  // Stop audio
  stop: () => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      set({ isPlaying: false });
      toast.success('Audio stopped');
    }
  },

  // Set volume
  setVolume: volume => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.volume = volume;
    }
    set({ volume });
  },

  // Get audio data for visualization
  getAudioData: () => {
    const { analyser } = get();
    if (!analyser) return null;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    return dataArray;
  },

  // Update audio data
  updateAudioData: () => {
    const audioData = get().getAudioData();
    if (audioData) {
      set({ audioData });
    }
  },

  // Clear audio
  clearAudio: () => {
    const { currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      if (currentAudio.src && currentAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudio.src);
      }
    }
    set({
      currentAudio: null,
      audioLoaded: false,
      isPlaying: false,
      audioData: null,
    });
  },
}));

export { useAudioStore };
