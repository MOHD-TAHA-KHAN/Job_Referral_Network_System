import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

const Particles = (props) => {
  const ref = useRef()
  // Generate random positions using built-in three.js math utilities
  const sphere = useMemo(() => {
    const points = new Float32Array(3000)
    for (let i = 0; i < 3000; i++) {
      // Point in a sphere of radius 15
      const r = 15 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)

      points[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      points[i * 3 + 2] = r * Math.cos(phi)
    }
    return points
  }, [])

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

const NetworkBackground = () => {
  return (
    <div className="three-bg-container">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <color attach="background" args={['#0f172a']} />
        <Particles />
      </Canvas>
    </div>
  )
}

export default NetworkBackground
