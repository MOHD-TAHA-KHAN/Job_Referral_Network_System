import React, { useRef, useState, forwardRef } from 'react';

const TiltCard = forwardRef(({ children, className = '', style: propStyle = {} }, forwardedRef) => {
  const internalRef = useRef(null);
  
  // Mathematically perfect ref-sharing pattern that avoids React lifecycle race conditions!
  const setRefs = (node) => {
    internalRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const [dynamicStyle, setDynamicStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!internalRef.current) return;
    const rect = internalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Smooth responsive boundaries
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setDynamicStyle({
      transform: `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      backgroundImage: `
        radial-gradient(
          circle at ${percentX}% ${percentY}%, 
          rgba(255,255,255,0.15) 0%, 
          transparent 60%
        )
      `,
      boxShadow: `
        0 15px 35px rgba(0, 0, 0, 0.4),
        0 5px 15px rgba(0, 0, 0, 0.2)
      `
    });
  };

  const handleMouseLeave = () => {
    setDynamicStyle({
      transform: `perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      backgroundImage: 'none',
      boxShadow: 'none'
    });
  };

  return (
    <div 
      ref={setRefs}
      className={className} 
      style={{ ...propStyle, ...dynamicStyle, position: 'relative', willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
});

export default TiltCard;
