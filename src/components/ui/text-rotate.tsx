
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextRotateProps {
  texts: string[];
  mainClassName?: string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last";
  rotationInterval?: number;
  transition?: any;
}

interface SegmentResult {
  segment: string;
}

const segmentText = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      // @ts-ignore - Segmenter is not in the TypeScript types yet
      const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
      const segments = Array.from(segmenter.segment(text)) as SegmentResult[];
      return segments.map(s => s.segment);
    } catch (e) {
      // Fallback if Segmenter fails
      return text.split(' ');
    }
  }
  // Fallback: split by spaces
  return text.split(' ');
};

export const TextRotate: React.FC<TextRotateProps> = ({
  texts,
  mainClassName = '',
  staggerDuration = 0.03,
  staggerFrom = "last",
  rotationInterval = 2000,
  transition
}) => {
  const [index, setIndex] = useState(0);
  const [segments, setSegments] = useState<string[]>([]);
  const [segmentIndex, setSegmentIndex] = useState(0);

  useEffect(() => {
    const updateWords = () => {
      const newSegments = segmentText(texts[index]);
      setSegments(newSegments);
      setSegmentIndex(0);
    };

    updateWords();

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts, index, rotationInterval]);

  useEffect(() => {
    if (segments.length > 0) {
      const wordInterval = setInterval(() => {
        setSegmentIndex((prev) => (prev + 1) % segments.length);
      }, 50);

      return () => clearInterval(wordInterval);
    }
  }, [segments]);

  return (
    <span className={mainClassName}>
      {segments.map((segment, i) => (
        <AnimatePresence key={`${segment}-${i}`} initial={false}>
          {i === segmentIndex && (
            <motion.span
              key={`${segment}-${i}-motion`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={transition || { duration: 0.2, ease: 'easeInOut' }}
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
