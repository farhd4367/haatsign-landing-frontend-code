import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Client-side only component to avoid hydration mismatch
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { 
  ssr: false 
});
const MotionH1 = dynamic(() => import('framer-motion').then(mod => mod.motion.h1), { 
  ssr: false 
});
const MotionP = dynamic(() => import('framer-motion').then(mod => mod.motion.p), { 
  ssr: false 
});

const BannerTitle = ({ title, description }) => {
  return (
    <div className="banner">
      <div className="container">
        <MotionH1
          className="banner-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
        >
          {title}
        </MotionH1>
        <MotionP
          className="banner-description"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
        >
          {description}
        </MotionP>
      </div>
    </div>
  );
};

export default BannerTitle;