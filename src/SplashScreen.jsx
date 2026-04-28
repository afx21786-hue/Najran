import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    // Hold the splash screen for 7.5 seconds to let the pulse animation finish
    const timer = setTimeout(() => {
      onComplete();
    }, 7500); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        background: 'radial-gradient(circle at center, #6b0505 0%, #170000 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        color: '#f5f5f7'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: [0, 1, 0.9, 1, 0.9, 1],
          scale: [0.95, 1, 1.03, 1, 1.03, 1]
        }}
        transition={{ duration: 7.5, ease: "easeInOut", times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
      >
        <motion.div 
          layoutId="main-logo"
          style={{ 
            fontFamily: "'Cinzel', serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#f5f5f7',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            letterSpacing: '0.05em', 
            fontWeight: 400, 
            lineHeight: 1,
            textShadow: '0 4px 30px rgba(0,0,0,0.5)'
          }}>
            Najran
          </span>
          <span style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', 
            letterSpacing: '0.3em', 
            fontWeight: 400,
            marginTop: '0.5rem'
          }}>
            Dates &amp; Nuts
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
