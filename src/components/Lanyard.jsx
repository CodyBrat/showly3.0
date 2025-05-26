/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

// Create geometry directly instead of importing GLB
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true, bookingData }) {
  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band bookingData={bookingData} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, bookingData }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  
  // Create a texture in-memory instead of loading from file
  const [texture] = useState(() => {
    // Create a canvas to draw the texture
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Fill with dark but visible gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#2c2e43');
    gradient.addColorStop(0.5, '#4f3a65');
    gradient.addColorStop(1, '#2c2e43');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some design elements with subtle glow
    ctx.shadowColor = '#7d6b91';
    ctx.shadowBlur = 5;
    ctx.fillStyle = 'rgba(184, 148, 215, 0.8)';
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.fillRect(i, 40, 20, 2);
    }
    ctx.shadowBlur = 0;
    
    // Add text with glow effect
    ctx.font = '30px Arial';
    ctx.shadowColor = '#7d6b91';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(230, 220, 250, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('SHOWLY', canvas.width / 2, 60);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  });

  // Create card texture with booking info
  const [cardTexture] = useState(() => {
    // Create a canvas to draw the card texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    
    // Get event type for styling
    const eventType = bookingData?.type || 'movie';
    
    // Modern dark background
    ctx.fillStyle = '#151515';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle texture to background
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < canvas.width; i += 40) {
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.fillRect(i, j, 20, 20);
      }
    }
    
    // Determine accent color based on event type
    let accentColor;
    switch(eventType) {
      case 'concert':
        accentColor = '#7f5af0';
        break;
      case 'comedy':
        accentColor = '#ff9e41';
        break;
      case 'movie':
      default:
        accentColor = '#ff3366';
    }
    
    // Add top colored header bar
    const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    headerGradient.addColorStop(0, accentColor);
    headerGradient.addColorStop(1, adjustColor(accentColor, -40));
    ctx.fillStyle = headerGradient;
    roundedRect(ctx, 0, 0, canvas.width, 120, [20, 20, 0, 0], true, false);
    
    // Add event type label
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px "Inter", "Roboto", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(eventType.toUpperCase(), canvas.width / 2, 70);
    
    // Add event icon
    let eventIcon;
    if (eventType === 'concert') {
      eventIcon = '🎵';
    } else if (eventType === 'comedy') {
      eventIcon = '😂';
    } else {
      eventIcon = '🎬';
    }
    
    // Draw the icon in a circle with border
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 180, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Add circle outline with accent color
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 180, 50, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw icon
    ctx.font = '60px "Inter", "Roboto", sans-serif';
    ctx.fillStyle = accentColor;
    ctx.fillText(eventIcon, canvas.width / 2, 200);
    
    // Add glow effect around the icon
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 180, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Event title with modern font - improved for long titles
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px "Inter", "Roboto", sans-serif';
    const title = bookingData?.title || 'SHOWLY EVENT';
    
    // Handle long titles by wrapping text appropriately
    const titleLines = breakTextIntoLines(title, 20); // Break title into lines of approximately 20 chars
    
    let titleY = 280;
    for (let i = 0; i < titleLines.length; i++) {
      ctx.fillText(titleLines[i], canvas.width / 2, titleY);
      titleY += 40; // Increase y position for next line
    }
    
    // Artist/director info if available
    if (bookingData?.artist || bookingData?.director) {
      ctx.fillStyle = '#bbbbbb';
      ctx.font = '400 22px "Inter", "Roboto", sans-serif';
      const creator = bookingData?.artist || bookingData?.director || '';
      ctx.fillText(creator, canvas.width / 2, 320);
    }
    
    // Add divider line
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 350);
    ctx.lineTo(canvas.width - 40, 350);
    ctx.stroke();
    
    // Event details in clean layout
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'left';
    ctx.font = '600 18px "Inter", "Roboto", sans-serif';
    
    // Venue
    ctx.fillText('VENUE', 60, 390);
    ctx.font = '400 18px "Inter", "Roboto", sans-serif';
    ctx.fillStyle = '#dddddd';
    ctx.fillText(bookingData?.venue || 'SHOWLY VENUE', 60, 420);
    
    // Date
    ctx.fillStyle = accentColor;
    ctx.font = '600 18px "Inter", "Roboto", sans-serif';
    ctx.fillText('DATE', 60, 460);
    ctx.font = '400 18px "Inter", "Roboto", sans-serif';
    ctx.fillStyle = '#dddddd';
    const dateStr = bookingData?.date || new Date().toLocaleDateString();
    ctx.fillText(dateStr, 60, 490);
    
    // Time on the right side
    if (bookingData?.time) {
      ctx.fillStyle = accentColor;
      ctx.font = '600 18px "Inter", "Roboto", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('TIME', canvas.width - 60, 460);
      ctx.font = '400 18px "Inter", "Roboto", sans-serif';
      ctx.fillStyle = '#dddddd';
      ctx.fillText(bookingData?.time, canvas.width - 60, 490);
    }
    
    // Add another divider
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 520);
    ctx.lineTo(canvas.width - 40, 520);
    ctx.stroke();
    
    // Seat info with improved visibility
    if (bookingData?.seatsInfo) {
      ctx.textAlign = 'center';
      ctx.fillStyle = accentColor;
      ctx.font = '600 20px "Inter", "Roboto", sans-serif';
      ctx.fillText('SEATS', canvas.width / 2, 560);
      
      // Add glowing effect to seats
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px "Inter", "Roboto", sans-serif';
      
      // If seats info is too long, break it into multiple lines
      const seatsInfo = bookingData.seatsInfo;
      if (seatsInfo.length > 15) {
        const parts = breakTextIntoLines(seatsInfo, 15);
        for (let i = 0; i < parts.length; i++) {
          ctx.fillText(parts[i], canvas.width / 2, 590 + (i * 30));
        }
      } else {
        ctx.fillText(seatsInfo, canvas.width / 2, 590);
      }
      ctx.shadowBlur = 0;
    }
    
    // Add barcode area at bottom
    ctx.fillStyle = '#222222';
    roundedRect(ctx, 80, 620, canvas.width - 160, 100, [8, 8, 8, 8], true, false);
    
    // Add barcode
    ctx.fillStyle = '#ffffff';
    const barcodeStart = canvas.width / 2 - 100;
    const barcodeWidth = 200;
    for (let i = 0; i < 40; i++) {
      const barWidth = Math.random() > 0.7 ? 3 : 1;
      const barHeight = 40 + Math.random() * 40;
      const barX = barcodeStart + (i * barcodeWidth / 40);
      ctx.fillRect(barX, 640, barWidth, barHeight);
    }
    
    // Booking ID
    if (bookingData?.bookingId) {
      ctx.fillStyle = '#888888';
      ctx.font = '400 14px "Inter", "Roboto", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bookingData.bookingId, canvas.width / 2, 710);
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });

  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.5]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.5]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.5]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.50, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  // Helper function for rounded rectangles with variable corner radii
  function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'number') {
      radius = [radius, radius, radius, radius];
    }
    
    ctx.beginPath();
    ctx.moveTo(x + radius[0], y);
    ctx.lineTo(x + width - radius[1], y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius[1]);
    ctx.lineTo(x + width, y + height - radius[2]);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius[2], y + height);
    ctx.lineTo(x + radius[3], y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius[3]);
    ctx.lineTo(x, y + radius[0]);
    ctx.quadraticCurveTo(x, y, x + radius[0], y);
    ctx.closePath();
    
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  // Helper function for text wrapping - improved for title wrapping
  function breakTextIntoLines(text, maxCharsPerLine) {
    // Special case for very long titles - split by words
    if (text.length > maxCharsPerLine) {
      const words = text.split(/\s+/);
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        if ((currentLine + word).length > maxCharsPerLine) {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      }
      
      if (currentLine.trim().length > 0) {
        lines.push(currentLine.trim());
      }
      
      return lines;
    }
    
    // If we have commas, try to break at commas too
    if (text.includes(',')) {
      return text.split(',').map(part => part.trim());
    }
    
    return [text]; // Return as single line if short enough
  }

  // Helper function for color adjustment
  function adjustColor(color, amount) {
    // Convert hex to RGB
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith('rgb')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        return color; // Return original if can't parse
      }
    } else {
      return color; // Return original if not hex or rgb
    }
    
    // Adjust color
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.2, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.4, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.6, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.8, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            {/* Simple card made with box geometry instead of imported GLB */}
            <mesh>
              <boxGeometry args={[1.6, 2.25, 0.05]} />
              <meshPhysicalMaterial 
                map={cardTexture} 
                map-anisotropy={16} 
                clearcoat={1} 
                clearcoatRoughness={0.15} 
                roughness={0.9} 
                metalness={0.8} 
              />
            </mesh>
            {/* Simple clasp */}
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
              <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
} 