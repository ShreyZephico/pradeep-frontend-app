"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./css/HeroSection.module.css";

const highlights = [
  "Certified stones and artisan finishing",
  "Complimentary gift-ready packaging",
  "Personalized consultations for custom pieces",
];

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-play video when loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section id="home" className={styles.hero}>
      {/* Hero Background Video */}
      <div className={styles.heroVideoWrapper}>
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          loop
          muted
          playsInline
          poster="/heroimage.png"
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/Image_Animation_Successful.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={`${styles.heroOverlay} ${isVideoLoaded ? styles.overlayVisible : ""}`} />
      </div>

      {/* Animated gradient orbs for depth */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={`${styles.container} ${isLoaded ? styles.loaded : ""}`}>
        <div className={styles.content}>
          
          

          {/* Floating highlights card */}
          
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </div>
    </section>
  );
}