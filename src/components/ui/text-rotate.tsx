import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextRotateProps {
  phrases: string[];
  className?: string;
  delay?: number;
}

const segmentText = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    // @ts-ignore - Segmenter is not in the TypeScript types yet
    const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
    return Array.from(segmenter.segment(text)).map(s => s.segment);
  }
  // Fallback: split by spaces
  return text.split(' ');
};

const TextRotate: React.FC<TextRotateProps> = ({ phrases, className = '', delay = 2000 }) => {
  const [index, setIndex] = useState(0);
  const [segments, setSegments] = useState(segmentText(phrases[0]));
  const [segmentIndex, setSegmentIndex] = useState(0);

  useEffect(() => {
    let phraseTimer: NodeJS.Timeout;
    let segmentTimer: NodeJS.Timeout;

    const updateSegment = () => {
      setSegments(segmentText(phrases[index]));
      setSegmentIndex(0);
    };

    const nextSegment = () => {
      setSegmentIndex((prevIndex) => (prevIndex + 1) % segments.length);
    };

    const nextPhrase = () => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    };

    updateSegment();
    phraseTimer = setTimeout(nextPhrase, delay);

    segmentTimer = setInterval(() => {
      nextSegment();
    }, 50);

    return () => {
      clearTimeout(phraseTimer);
      clearInterval(segmentTimer);
    };
  }, [phrases, index, delay]);

  return (
    <span className={className}>
      {segments.map((segment, i) => (
        <AnimatePresence key={i} initial={false}>
          {i === segmentIndex && (
            <motion.span
              key={segment}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {segment}
            </motion.span>
          )}
        </AnimatePresence>
      ))}
    </span>
  );
};

export default TextRotate;
