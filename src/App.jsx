import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Leaf } from 'lucide-react';
import './index.css';

import HeroSequence from './HeroSequence';
import SplashScreen from './SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Always start at the top on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll while splash is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => { document.body.style.overflow = ''; };
  }, [showSplash]);

  return (
    <div className="app-container">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* --- NAVIGATION --- */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="logo" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
          {!showSplash && (
            <motion.div 
              layoutId="main-logo"
              onClick={() => window.location.reload()}
              style={{
                fontFamily: "'Cinzel', serif",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#f5f5f7',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <span style={{ 
                fontSize: '1.5rem', 
                letterSpacing: '0.05em', 
                fontWeight: 400, 
                lineHeight: 1 
              }}>
                Najran
              </span>
              <span style={{ 
                fontSize: '0.6rem', 
                letterSpacing: '0.2em', 
                fontWeight: 400,
                marginTop: '0.1rem'
              }}>
                Dates &amp; Nuts
              </span>
            </motion.div>
          )}
        </div>
        <div className="nav-links">
          <a href="#collection">Collection</a>
          <a href="#heritage">Heritage</a>
          <a href="#about">About</a>
        </div>
        <button className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.8rem' }}>
          SHOP NOW
        </button>
      </motion.nav>

      {/* --- SCROLL EFFECT HERO --- */}
      <HeroSequence />

      {/* --- PRODUCTS SECTION --- */}
      <section id="collection" className="section" style={{ zIndex: 3 }}>
        <motion.div 
          className="products-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
            hidden: {}
          }}
        >
          {/* Card 1 */}
          <motion.div 
            className="product-card glass-panel"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
          >
            <div className="category tracking-wide">SIGNATURE</div>
            <h3>Ajwa Dark</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Deep scarlet profiles with notes of smoked caramel.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="product-card glass-panel"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
          >
             <div className="category tracking-wide">PREMIUM NUTS</div>
            <h3>Obsidian Pistachio</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Roasted to absolute perfection in zero-gravity chambers.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="product-card glass-panel"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
          >
             <div className="category tracking-wide">LIMITED EDITION</div>
            <h3>Royal Walnuts</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Crisp, ethereal crunches infused with desert winds.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- HERITAGE SECTION --- */}
      <section id="heritage" className="section">
        <div className="heritage-content">
          <motion.div 
            className="heritage-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="tracking-wide text-scarlet-gradient" style={{marginBottom:'1rem', display:'block'}}><Fingerprint size={16} style={{display:'inline', verticalAlign:'middle'}}/> OUR ROOTS</span>
            <h2>Timeless<br/>Heritage</h2>
            <p>
              Centuries of Saudi agricultural mastery meet futuristic presentation. 
              Our organic farming techniques preserve the soul of the desert while 
              pushing boundaries of modern culinary luxury.
            </p>
            <p>
              Every bite is a suspension of time, a rich collision of deep earthly 
              textures and soaring aromatic profiles.
            </p>
          </motion.div>
          <div className="heritage-visual">
            <div className="blur-orb orb-1" />
            <div className="blur-orb orb-2" />
            
            <motion.div 
              className="glass-panel" 
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h3 style={{fontSize: '2rem', zIndex: 2}}>Rooted in Earth.<br/>Crafted for the Stars.</h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer>
        <div className="logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 400, color: '#f5f5f7', lineHeight: 1 }}>
            Najran
          </span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#f5f5f7', marginTop: '0.1rem' }}>
            Dates &amp; Nuts
          </span>
        </div>
        <div className="footer-links tracking-wide">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Instagram</a>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Najran Dates & Nuts.
        </div>
      </footer>
    </div>
  );
}

export default App;
