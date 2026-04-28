import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, useSpring } from 'framer-motion';

const framesPerSeq = 240;
const getHeroFrame = (index) => `/heroimg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
const getBodyFrame = (index) => `/bodyimg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;


export default function HeroSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [layoutScale, setLayoutScale] = useState({ scale: 1, x: 0, y: 0, w: 1920, h: 1080 });
  
  // Store image objects persistently outside the render cycle so they aren't garbage collected
  const heroImages = useRef([]);
  const bodyImages = useRef([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Preload images into persistent memory objects
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = framesPerSeq * 2;
    
    // We fetch lazily over time to not block thread but initiate them immediately
    for (let i = 1; i <= framesPerSeq; i++) {
      const heroImg = new Image();
      heroImg.src = getHeroFrame(i);
      heroImg.onload = () => {
        loadedCount++;
        if(loadedCount >= totalFrames * 0.3) setImagesLoaded(true); // render early once sufficiently loaded
      };
      heroImages.current.push(heroImg);

      const bodyImg = new Image();
      bodyImg.src = getBodyFrame(i);
      bodyImg.onload = () => {
        loadedCount++;
        if(loadedCount >= totalFrames * 0.3) setImagesLoaded(true);
      };
      bodyImages.current.push(bodyImg);
    }
  }, []);

  const drawFrame = (latest) => {
    if (!canvasRef.current || heroImages.current.length < framesPerSeq || bodyImages.current.length < framesPerSeq) return;

    const ctx = canvasRef.current.getContext('2d', { alpha: true }); // alpha true to allow destination-out erasing
    
    // Natively antialias & upscale
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    let activeImg;

    if (latest <= 0.5) {
      const localProgress = latest * 2;
      const frameIndex = Math.max(0, Math.min(framesPerSeq - 1, Math.floor(localProgress * framesPerSeq)));
      activeImg = heroImages.current[frameIndex];
    } else {
      const localProgress = (latest - 0.5) * 2;
      const frameIndex = Math.max(0, Math.min(framesPerSeq - 1, Math.floor(localProgress * framesPerSeq)));
      activeImg = bodyImages.current[frameIndex];
    }

    if (activeImg && activeImg.complete && activeImg.naturalHeight !== 0) {
      const hRatio = width / activeImg.width;
      const vRatio = height / activeImg.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (width - activeImg.width * ratio) / 2;
      const centerShift_y = (height - activeImg.height * ratio) / 2;
      
      // Update our alignment state dynamically so CSS hotspots clamp exactly 1:1 to image pixels
      setLayoutScale({
        scale: ratio,
        x: centerShift_x,
        y: centerShift_y,
        w: activeImg.width,
        h: activeImg.height
      });

      // Ensure canvas is opaque by default to prevent transparency leaks, allowing destination-out later
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(
        activeImg, 
        0, 0, activeImg.width, activeImg.height,
        centerShift_x, centerShift_y, activeImg.width * ratio, activeImg.height * ratio
      );
    } // CRITICAL missing brace added back
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    requestAnimationFrame(() => drawFrame(latest));
  });


  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawFrame(scrollYProgress.get());
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollYProgress]);

  useEffect(() => {
    if (imagesLoaded) {
      requestAnimationFrame(() => drawFrame(scrollYProgress.get()));
    }
  }, [imagesLoaded, scrollYProgress]);

  // --- Animation Values for Text Overlay ---

  const introOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  
  const f1Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const f1Y = useTransform(scrollYProgress, [0.2, 0.25, 0.4, 0.45], [50, 0, 0, -50]);

  const f2Opacity = useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], [0, 1, 1, 0]);
  const f2Y = useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], [50, 0, 0, -50]);

  const outroOpacity = useTransform(scrollYProgress, [0.8, 0.85, 1], [0, 1, 1]);
  const outroY = useTransform(scrollYProgress, [0.8, 0.85, 1], [50, 0, 0]);

  const finalPhaseOpacity = useTransform(scrollYProgress, [0.85, 0.90], [0, 1]);

  return (
    <section ref={containerRef} className="hero-sequence-container">
      <div className="hero-sequence-sticky">
        {/* Hardware Accelerated Canvas Engine */}
        <div className="hero-sequence-img-wrapper upscale" style={{ overflow: 'hidden' }}>
          {/* Main Sequence Frame Drawing */}
          <canvas 
            ref={canvasRef}
            className="hero-sequence-canvas"
            style={{ position: 'relative', zIndex: 1, touchAction: 'none' }}
          />
          

        </div>

        {/* Text Overlays & Buttons */}
        <div className="hero-sequence-content-wrapper">
          {/* Interactive Nut Hotspots mapped identically to image resolution */}
          <motion.div 
            style={{ 
              opacity: finalPhaseOpacity, 
              position: 'absolute', 
              top: `${layoutScale.y}px`, 
              left: `${layoutScale.x}px`, 
              width: `${layoutScale.w * layoutScale.scale}px`, 
              height: `${layoutScale.h * layoutScale.scale}px`,
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <a href="/product/pista" className="nut-hotspot" style={{ top: '34%', left: '7%', pointerEvents: 'auto' }}>
              <span className="nut-tooltip">Pista</span>
            </a>
            <a href="/product/badam" className="nut-hotspot" style={{ top: '13%', left: '14%', pointerEvents: 'auto' }}>
              <span className="nut-tooltip">Badam</span>
            </a>
            <a href="/product/cashew" className="nut-hotspot" style={{ top: '22%', left: '19%', pointerEvents: 'auto' }}>
              <span className="nut-tooltip">Cashew Nuts</span>
            </a>
            <a href="/product/date" className="nut-hotspot" style={{ top: '8%', left: '71%', pointerEvents: 'auto' }}>
              <span className="nut-tooltip">Date</span>
            </a>
            <a href="/product/walnut" className="nut-hotspot" style={{ top: '4%', left: '79%', pointerEvents: 'auto' }}>
               <span className="nut-tooltip">Walnut</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
