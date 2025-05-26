import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from 'ogl'

import './CircularGallery.css';

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}

function createTextTexture(gl, text, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  context.font = font
  const metrics = context.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2)
  canvas.width = textWidth + 20
  canvas.height = textHeight + 20
  context.font = font
  context.fillStyle = color
  context.textBaseline = "middle"
  context.textAlign = "center"
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width: canvas.width, height: canvas.height }
}

// Function to create custom card texture with animated elements
function createCustomCardTexture(gl, text, index = 0) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const width = 800
  const height = 600
  
  canvas.width = width
  canvas.height = height
  
  // Create different designs based on category name
  const designs = {
    'Movies': {
      bgColor: 'rgba(25, 21, 35, 1)',
      gradientColor: 'rgba(43, 30, 64, 1)',
      iconType: 'film',
      accentColor: 'rgba(120, 60, 190, 0.2)',
      linePattern: 'horizontal',
    },
    'Food': {
      bgColor: 'rgba(22, 33, 35, 1)',
      gradientColor: 'rgba(30, 50, 55, 1)',
      iconType: 'plate',
      accentColor: 'rgba(60, 190, 170, 0.2)',
      linePattern: 'circular',
    },
    'Concerts': {
      bgColor: 'rgba(35, 25, 21, 1)',
      gradientColor: 'rgba(60, 40, 30, 1)',
      iconType: 'music',
      accentColor: 'rgba(200, 150, 70, 0.2)',
      linePattern: 'wave',
    },
    'Music': {
      bgColor: 'rgba(20, 20, 35, 1)',
      gradientColor: 'rgba(35, 35, 60, 1)',
      iconType: 'note',
      accentColor: 'rgba(80, 130, 210, 0.2)',
      linePattern: 'dots',
    },
    'Comedy': {
      bgColor: 'rgba(35, 22, 30, 1)',
      gradientColor: 'rgba(55, 30, 45, 1)',
      iconType: 'mask',
      accentColor: 'rgba(200, 70, 120, 0.2)',
      linePattern: 'zigzag',
    },
    'Sports': {
      bgColor: 'rgba(22, 35, 25, 1)',
      gradientColor: 'rgba(30, 60, 40, 1)',
      iconType: 'ball',
      accentColor: 'rgba(70, 180, 90, 0.2)',
      linePattern: 'diamond',
    }
  }
  
  // Default design for any other categories
  const defaultDesign = {
    bgColor: 'rgba(20, 20, 30, 1)',
    gradientColor: 'rgba(30, 30, 45, 1)',
    iconType: 'circle',
    accentColor: 'rgba(100, 100, 150, 0.2)',
    linePattern: 'grid',
  }
  
  // Get design for this card
  const design = designs[text] || defaultDesign
  
  // Background gradient
  const gradientDirection = index % 2 === 0 ? [0, 0, width, height] : [width, 0, 0, height]
  const gradient = ctx.createLinearGradient(...gradientDirection)
  gradient.addColorStop(0, design.bgColor)
  gradient.addColorStop(1, design.gradientColor)
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Draw animated-like particles 
  const particleCount = 12 + Math.floor(Math.random() * 8)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 4 + 1
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Draw custom line patterns based on design
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1.5
  
  switch (design.linePattern) {
    case 'horizontal':
      // Horizontal lines like film strips
      for (let i = 0; i < 6; i++) {
        const y = height * 0.3 + (i * 15)
        ctx.beginPath()
        ctx.moveTo(width * 0.2, y)
        ctx.lineTo(width * 0.8, y)
        ctx.stroke()
      }
      break
    
    case 'circular':
      // Circular pattern for food
      for (let i = 0; i < 3; i++) {
        const radius = 80 + (i * 25)
        ctx.beginPath()
        ctx.arc(width / 2, height * 0.35, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    
    case 'wave':
      // Wave pattern for concerts
      ctx.beginPath()
      for (let x = width * 0.2; x <= width * 0.8; x += 5) {
        const baseY = height * 0.3
        const amplitude = 15
        const frequency = 0.02
        const y = baseY + Math.sin(x * frequency) * amplitude
        
        if (x === width * 0.2) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      
      ctx.beginPath()
      for (let x = width * 0.2; x <= width * 0.8; x += 5) {
        const baseY = height * 0.3 + 40
        const amplitude = 15
        const frequency = 0.02
        const y = baseY + Math.sin(x * frequency + 1) * amplitude
        
        if (x === width * 0.2) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      break
    
    case 'dots':
      // Dotted pattern for music
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2
        const radius = 80
        const x = width / 2 + Math.cos(angle) * radius
        const y = height * 0.35 + Math.sin(angle) * radius
        
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    
    case 'zigzag':
      // Zigzag pattern for comedy
      ctx.beginPath()
      let startY = height * 0.25
      ctx.moveTo(width * 0.2, startY)
      
      for (let i = 0; i < 6; i++) {
        const x1 = width * 0.2 + ((width * 0.6) / 6) * (i + 0.5)
        const y1 = startY + (i % 2 === 0 ? 30 : 0)
        const x2 = width * 0.2 + ((width * 0.6) / 6) * (i + 1)
        const y2 = startY
        
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
      }
      ctx.stroke()
      
      // Second zigzag
      ctx.beginPath()
      startY = height * 0.25 + 40
      ctx.moveTo(width * 0.2, startY)
      
      for (let i = 0; i < 6; i++) {
        const x1 = width * 0.2 + ((width * 0.6) / 6) * (i + 0.5)
        const y1 = startY + (i % 2 === 0 ? 30 : 0)
        const x2 = width * 0.2 + ((width * 0.6) / 6) * (i + 1)
        const y2 = startY
        
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
      }
      ctx.stroke()
      break
    
    case 'diamond':
      // Diamond pattern for sports
      for (let i = 0; i < 3; i++) {
        const size = 40 + i * 20
        ctx.beginPath()
        ctx.moveTo(width / 2, height * 0.35 - size)
        ctx.lineTo(width / 2 + size, height * 0.35)
        ctx.lineTo(width / 2, height * 0.35 + size)
        ctx.lineTo(width / 2 - size, height * 0.35)
        ctx.closePath()
        ctx.stroke()
      }
      break
    
    case 'grid':
    default:
      // Grid pattern for default
      for (let i = 0; i < 5; i++) {
        // Horizontal
        ctx.beginPath()
        ctx.moveTo(width * 0.2, height * 0.2 + i * 20)
        ctx.lineTo(width * 0.8, height * 0.2 + i * 20)
        ctx.stroke()
        
        // Vertical
        ctx.beginPath()
        ctx.moveTo(width * 0.2 + i * 30, height * 0.2)
        ctx.lineTo(width * 0.2 + i * 30, height * 0.2 + 80)
        ctx.stroke()
      }
      break
  }
  
  // Add icon based on category
  ctx.fillStyle = design.accentColor
  
  switch (design.iconType) {
    case 'film':
      // Draw film reel icon
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Film holes
      ctx.fillStyle = design.bgColor
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const x = width / 2 + Math.cos(angle) * 35
        const y = height * 0.35 + Math.sin(angle) * 35
        
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()
      }
      break
      
    case 'plate':
      // Draw plate icon
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Plate inner circle
      ctx.fillStyle = design.bgColor
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 35, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'music':
      // Concert/stage icon
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Stage spotlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      for (let i = -2; i <= 2; i += 2) {
        ctx.beginPath()
        ctx.moveTo(width / 2 + i * 15, height * 0.35 - 10)
        ctx.lineTo(width / 2 + i * 25, height * 0.35 - 40)
        ctx.lineTo(width / 2 + i * 5, height * 0.35 - 40)
        ctx.closePath()
        ctx.fill()
      }
      break
      
    case 'note':
      // Music note
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Note shape
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.beginPath()
      const noteX = width / 2
      const noteY = height * 0.35
      ctx.moveTo(noteX - 15, noteY - 25)
      ctx.lineTo(noteX - 15, noteY + 10)
      ctx.bezierCurveTo(noteX - 35, noteY + 5, noteX - 35, noteY + 30, noteX - 15, noteY + 25)
      ctx.bezierCurveTo(noteX + 5, noteY + 20, noteX + 5, noteY - 5, noteX - 15, noteY - 5)
      ctx.lineTo(noteX - 15, noteY - 25)
      ctx.lineTo(noteX + 15, noteY - 30)
      ctx.lineTo(noteX + 15, noteY)
      ctx.bezierCurveTo(noteX - 5, noteY - 5, noteX - 5, noteY + 20, noteX + 15, noteY + 15)
      ctx.bezierCurveTo(noteX + 35, noteY + 10, noteX + 35, noteY - 15, noteX + 15, noteY - 20)
      ctx.lineTo(noteX + 15, noteY - 30)
      ctx.closePath()
      ctx.fill()
      break
      
    case 'mask':
      // Comedy mask
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Mask features
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      
      // Eyes
      ctx.beginPath()
      ctx.arc(width / 2 - 15, height * 0.35 - 10, 10, 0, Math.PI * 2)
      ctx.arc(width / 2 + 15, height * 0.35 - 10, 10, 0, Math.PI * 2)
      ctx.fill()
      
      // Smile
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35 + 10, 25, 0, Math.PI, false)
      ctx.fill()
      break
      
    case 'ball':
      // Sports ball
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Ball pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 3
      
      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(width / 2 - 50, height * 0.35)
      ctx.lineTo(width / 2 + 50, height * 0.35)
      ctx.stroke()
      
      // Vertical line
      ctx.beginPath()
      ctx.moveTo(width / 2, height * 0.35 - 50)
      ctx.lineTo(width / 2, height * 0.35 + 50)
      ctx.stroke()
      
      // Curve lines
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 35, Math.PI * 0.25, Math.PI * 0.75, false)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 35, Math.PI * 1.25, Math.PI * 1.75, false)
      ctx.stroke()
      break
      
    case 'circle':
    default:
      // Default circle icon
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 50, 0, Math.PI * 2)
      ctx.fill()
      
      // Inner circle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.beginPath()
      ctx.arc(width / 2, height * 0.35, 25, 0, Math.PI * 2)
      ctx.fill()
      break
  }
  
  // Add text
  const fontGradient = ctx.createLinearGradient(width / 2 - 100, height * 0.7, width / 2 + 100, height * 0.7 + 20)
  fontGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  fontGradient.addColorStop(1, 'rgba(220, 220, 255, 0.9)')
  
  ctx.font = 'bold 60px sans-serif'
  ctx.fillStyle = fontGradient
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height * 0.7)
  
  // Add subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
  ctx.lineWidth = 4
  ctx.strokeRect(10, 10, width - 20, height - 20)
  
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width, height }
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = "#545050", font = "30px sans-serif" }) {
    autoBind(this)
    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.text = text
    this.textColor = textColor
    this.font = font
    this.createMesh()
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    )
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width / height
    const textHeight = this.plane.scale.y * 0.15
    const textWidth = textHeight * aspect
    this.mesh.scale.set(textWidth, textHeight, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.viewport = viewport
    this.bend = bend
    this.textColor = textColor
    this.borderRadius = borderRadius
    this.font = font
    this.createShader()
    this.createMesh()
    this.onResize()
  }
  createShader() {
    // Use custom card texture instead of image
    const { texture, width, height } = createCustomCardTexture(this.gl, this.text, this.index)
    
    // Get category-specific colors for animations
    const categoryColors = {
      'Movies': [0.5, 0.2, 0.8],  // Purple
      'Food': [0.2, 0.8, 0.7],    // Teal
      'Concerts': [0.8, 0.6, 0.3], // Gold
      'Music': [0.3, 0.5, 0.9],   // Blue
      'Comedy': [0.8, 0.3, 0.5],  // Pink
      'Sports': [0.3, 0.7, 0.4]   // Green
    }
    
    // Default color (blue-purple)
    const defaultColor = [0.4, 0.4, 0.8]
    
    // Get color for this category
    const particleColor = categoryColors[this.text] || defaultColor
    
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vUv = uv;
          vec3 p = position;
          
          // Create wave effect
          float wave = sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5;
          p.z = wave * (0.1 + uSpeed * 0.5);
          vWave = wave * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uTime;
        uniform vec3 uParticleColor;
        varying vec2 vUv;
        varying float vWave;
        
        // Rounded box SDF for UV space
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        // Noise function for animated particles
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          
          // Get base texture color
          vec4 color = texture2D(tMap, uv);
          
          // Add animated particles
          vec2 st = vUv * 20.0;
          float n = noise(st + uTime * 0.1);
          
          // Only show particles in certain areas & with certain noise values
          if (n > 0.96 && vUv.y < 0.7 && vUv.x > 0.2 && vUv.x < 0.8) {
            // Add glowing particles
            float size = 0.03 * (sin(uTime + vUv.x * 10.0) * 0.5 + 0.5);
            vec2 pos = mod(st + vec2(sin(uTime * 0.5) * 0.5, uTime * 0.2), 1.0);
            float dist = length(pos - vec2(0.5));
            
            if (dist < size) {
              // Add glow effect with category-specific color
              color.rgb += uParticleColor * (1.0 - dist / size);
            }
          }
          
          // Add additional subtle particles 
          float n2 = noise(st * 2.0 - uTime * 0.05);
          if (n2 > 0.97) {
            color.rgb += uParticleColor * 0.3;
          }
          
          // Add subtle wave color effect based on category color
          color.rgb += uParticleColor * vWave;
          
          // Apply rounded corners
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [width, height] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uParticleColor: { value: particleColor }
      },
      transparent: true
    })
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    this.plane.setParent(this.scene)
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      }
    }
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

class App {
  constructor(container, { items, bend, textColor = "#ffffff", borderRadius = 0, font = "bold 30px DM Sans" } = {}) {
    document.documentElement.classList.remove('no-js')
    this.container = container
    this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck, 200)
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update()
    this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene() {
    this.scene = new Transform()
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
      { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' },
      { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall' },
      { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries' },
      { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving' },
      { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track' },
      { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: 'Santorini' },
      { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: 'Blurry Lights' },
      { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: 'New York' },
      { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: 'Good Boy' },
      { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: 'Coastline' },
      { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: "Palm Trees" }
    ]
    const galleryItems = items && items.length ? items : defaultItems
    this.mediasImages = galleryItems.concat(galleryItems)
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      })
    })
  }
  onTouchDown(e) {
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
  }
  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const distance = (this.start - x) * 0.05
    this.scroll.target = this.scroll.position + distance
  }
  onTouchUp() {
    this.isDown = false
    this.onCheck()
  }
  onWheel() {
    this.scroll.target += 2
    this.onCheckDebounce()
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      )
    }
  }
  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    )
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction))
    }
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this)
    this.boundOnWheel = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    window.addEventListener('resize', this.boundOnResize)
    window.addEventListener('mousewheel', this.boundOnWheel)
    window.addEventListener('wheel', this.boundOnWheel)
    window.addEventListener('mousedown', this.boundOnTouchDown)
    window.addEventListener('mousemove', this.boundOnTouchMove)
    window.addEventListener('mouseup', this.boundOnTouchUp)
    window.addEventListener('touchstart', this.boundOnTouchDown)
    window.addEventListener('touchmove', this.boundOnTouchMove)
    window.addEventListener('touchend', this.boundOnTouchUp)
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    window.removeEventListener('mousewheel', this.boundOnWheel)
    window.removeEventListener('wheel', this.boundOnWheel)
    window.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    window.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove', this.boundOnTouchMove)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px DM Sans"
}) {
  const containerRef = useRef(null)
  
  useEffect(() => {
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font })
    
    // Add click event listener to detect card clicks
    const handleClick = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate approximate card positions (simplified detection)
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Distance from center
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      // If click is close to center (active card), trigger navigation
      if (distance < containerWidth * 0.2) {
        // Find which card is currently centered
        const scrollOffset = app.scroll.current % app.medias[0].widthTotal;
        const cardWidth = app.medias[0].width;
        const activeIndex = Math.round(scrollOffset / cardWidth) % items.length;
        
        // Get the text of the active card to determine where to navigate
        const activeCardText = items[activeIndex].text;
        
        // Navigate based on card text
        let targetPath = '';
        switch (activeCardText) {
          case 'Movies':
            targetPath = '/movies';
            break;
          case 'Concerts':
            targetPath = '/concerts';
            break;
          case 'Comedy':
            targetPath = '/comedy';
            break;
          case 'Sports':
            targetPath = '/sports';
            break;
          case 'Food':
            targetPath = '/food';
            break;
          case 'Music':
            targetPath = '/concerts';
            break;
          default:
            targetPath = '/';
        }
        
        // Navigate to the target path
        if (targetPath) {
          window.location.href = targetPath;
        }
      }
    };
    
    containerRef.current.addEventListener('click', handleClick);
    
    return () => {
      containerRef.current?.removeEventListener('click', handleClick);
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font]);
  
  return (
    <div className='circular-gallery' ref={containerRef} />
  );
} 