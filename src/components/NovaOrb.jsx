import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points } from '@react-three/drei';
import * as THREE from 'three';
import { useAudioStore } from '../stores/audioStore';

const NovaOrb = ({ isListening, isSpeaking }) => {
  const pointsRef = useRef();
  const { audioData, updateAudioData } = useAudioStore();

  useEffect(() => {
    const interval = setInterval(() => {
      updateAudioData();
    }, 50);
    return () => clearInterval(interval);
  }, [updateAudioData]);

  const [geometry, originalPositions, originalColors] = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1.5, 64);
    const pos = new Float32Array(geom.attributes.position.array);
    const colors = new Float32Array(pos.length);
    for (let i = 0; i < pos.length; i += 3) {
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.7);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return [geom, pos, colors];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current && audioData) {
      pointsRef.current.rotation.y += delta * 0.1;
      const positions = pointsRef.current.geometry.attributes.position.array;
      const colors = pointsRef.current.geometry.attributes.color.array;
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < positions.length; i += 3) {
        const p = new THREE.Vector3(
          originalPositions[i],
          originalPositions[i + 1],
          originalPositions[i + 2]
        );
        const freqIndex = i % audioData.length;
        const amp = audioData[freqIndex] / 255;

        const displacement = amp * 0.5 * Math.sin(p.y * 5 + time);
        p.add(p.clone().normalize().multiplyScalar(displacement));

        positions[i] = p.x;
        positions[i + 1] = p.y;
        positions[i + 2] = p.z;

        const color = new THREE.Color();
        color.setHSL(amp * 0.5 + 0.5, 0.8, 0.6);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default NovaOrb;
