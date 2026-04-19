import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import earthNightImg from '../assets/Earth-night.jpg'
import earthDayImg from '../assets/Earth-day.jpg' // Made available for theme switching if needed

// WebGL Error Boundary prevents fatal Canvas crashes from wiping the DOM
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Three.js Canvas Fatal Error Caught:", error);
  }
  render() {
    if (this.state.hasError) return null; 
    return this.props.children; 
  }
}

// ==========================================
// 1. DYNAMIC SHOOTING STARS
// ==========================================
const ShootingStars = () => {
    const { viewport } = useThree();
    const count = 5; 
    const stars = useRef(Array.from({ length: count }).map(() => ({
       x: (Math.random() - 0.5) * viewport.width * 2,
       y: viewport.height + Math.random() * 10,
       z: -3 + Math.random() * 2,
       speed: 0.2 + Math.random() * 0.4,
       length: 3 + Math.random() * 5,
    })));

    const geoRef = useRef()
    
    useFrame(() => {
        if (!geoRef.current) return;
        const positions = geoRef.current.attributes.position.array;
        
        for (let i = 0; i < count; i++) {
           const s = stars.current[i];
           s.x -= s.speed;
           s.y -= s.speed * 0.5; // Angled diagonal path matching atmosphere entry
           
           if (s.y < -viewport.height - s.length) {
               s.y = viewport.height + Math.random() * 15;
               s.x = (Math.random() - 0.5) * viewport.width * 2;
               s.speed = 0.2 + Math.random() * 0.4;
           }
           
           positions[i * 6] = s.x;
           positions[i * 6 + 1] = s.y;
           positions[i * 6 + 2] = s.z;
           positions[i * 6 + 3] = s.x + s.length;
           positions[i * 6 + 4] = s.y + s.length * 0.5;
           positions[i * 6 + 5] = s.z;
        }
        geoRef.current.attributes.position.needsUpdate = true;
    });

    const positions = useMemo(() => new Float32Array(count * 6), [count]);

    return (
       <lineSegments>
          <bufferGeometry ref={geoRef}>
             <bufferAttribute attach="attributes-position" count={count * 2} array={positions} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
       </lineSegments>
    )
}

// ==========================================
// 2. GOOGLE CLOUD PARTICLE WEB
// ==========================================
const ParticleWeb = () => {
    const particleCount = 120; // Dense network cluster
    const maxDistance = 3.8;   // Line connection threshold
    const { mouse, viewport } = useThree();
    
    // Arrays for raw buffer math
    const particles = useMemo(() => {
        const p = [];
        for (let i = 0; i < particleCount; i++) {
           p.push({
              x: (Math.random() - 0.5) * viewport.width * 1.5,
              y: (Math.random() - 0.5) * viewport.height * 1.5,
              z: (Math.random() - 0.5) * 5 - 2, 
              vx: (Math.random() - 0.5) * 0.015,
              vy: (Math.random() - 0.5) * 0.015,
              vz: (Math.random() - 0.5) * 0.015,
           });
        }
        return p;
    }, [viewport]);

    const linesGeoRef = useRef();
    const pointsGeoRef = useRef();

    useFrame(() => {
        if (!linesGeoRef.current || !pointsGeoRef.current) return;
        
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;
        
        const positions = linesGeoRef.current.attributes.position.array;
        const colors = linesGeoRef.current.attributes.color.array;
        const ptPositions = pointsGeoRef.current.attributes.position.array;

        // Map React mouse (-1 to 1) to active 3D coordinates securely
        const mx = mouse.x * (viewport.width / 2);
        const my = mouse.y * (viewport.height / 2);

        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            
            // Hover Gravity pulling effect!
            const dxMouse = mx - p.x;
            const dyMouse = my - p.y;
            const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
            if (distMouseSq < 15) {
                p.vx += dxMouse * 0.0003;
                p.vy += dyMouse * 0.0003;
            } else {
                // Decay velocity back to normal drift speed
                p.vx *= 0.99;
                p.vy *= 0.99;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            
            // Soft bounding box bounce
            const buffer = 2;
            if (p.x > viewport.width / 2 + buffer || p.x < -viewport.width / 2 - buffer) p.vx *= -1;
            if (p.y > viewport.height / 2 + buffer || p.y < -viewport.height / 2 - buffer) p.vy *= -1;
            if (p.z > 1 || p.z < -8) p.vz *= -1;

            ptPositions[i * 3] = p.x;
            ptPositions[i * 3 + 1] = p.y;
            ptPositions[i * 3 + 2] = p.z;

            // Highly optimized continuous pair checking
            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dz = p.z - p2.z;
                const distSq = dx*dx + dy*dy + dz*dz;
                
                if (distSq < maxDistance * maxDistance) {
                    const alpha = 1.0 - (distSq / (maxDistance * maxDistance));
                    
                    positions[vertexpos++] = p.x;
                    positions[vertexpos++] = p.y;
                    positions[vertexpos++] = p.z;
                    
                    positions[vertexpos++] = p2.x;
                    positions[vertexpos++] = p2.y;
                    positions[vertexpos++] = p2.z;
                    
                    // Golden Yellow/White lines linking nodes
                    colors[colorpos++] = 0.98; colors[colorpos++] = 0.8; colors[colorpos++] = 0.08; colors[colorpos++] = Math.max(0, alpha - 0.2);
                    colors[colorpos++] = 0.98; colors[colorpos++] = 0.8; colors[colorpos++] = 0.08; colors[colorpos++] = Math.max(0, alpha - 0.2);
                    
                    numConnected++;
                }
            }
        }
        
        linesGeoRef.current.setDrawRange(0, numConnected * 2);
        linesGeoRef.current.attributes.position.needsUpdate = true;
        linesGeoRef.current.attributes.color.needsUpdate = true;
        pointsGeoRef.current.attributes.position.needsUpdate = true;
    });

    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
    const lineColors = useMemo(() => new Float32Array(maxLines * 8), [maxLines]); 
    const pointsPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

    return (
        <group>
            {/* The white solid tech nodes */}
            <points>
                <bufferGeometry ref={pointsGeoRef}>
                    <bufferAttribute attach="attributes-position" count={particleCount} array={pointsPositions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color="#ffffff" size={0.06} transparent opacity={0.6} sizeAttenuation={true} />
            </points>
            {/* The golden tech beams */}
            <lineSegments>
                <bufferGeometry ref={linesGeoRef}>
                    <bufferAttribute attach="attributes-position" count={maxLines * 2} array={linePositions} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={maxLines * 2} array={lineColors} itemSize={4} />
                </bufferGeometry>
                <lineBasicMaterial vertexColors={true} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
            </lineSegments>
        </group>
    );
};

// ==========================================
// MAIN COMPONENT & LAYOUT
// ==========================================
const NetworkBackground = ({ alignment = 'center' }) => {
  // If we wanted to shift the visual container slightly, but for full-screen we can just center it safely
  return (
    <div 
        className="three-bg-container" 
        style={{ 
            position: 'absolute', 
            top: 0, left: 0, 
            width: '100%', height: '100%', 
            zIndex: -1,
            // Automatically covers empty black corners by treating the actual photograph as an ultra-HD wallpaper!
            backgroundImage: `url(${earthNightImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#020617' // Deep backup color
        }}
    >
      <CanvasErrorBoundary>
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ alpha: true }}>
          {/* We do NOT attach a dark background color here anymore, leaving it 100% transparent to see the photo! */}
          <Suspense fallback={null}>
              <ParticleWeb />
              <ShootingStars />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  )
}

export default NetworkBackground
