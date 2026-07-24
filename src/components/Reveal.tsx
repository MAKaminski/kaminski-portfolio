import React from 'react';
import { motion } from 'framer-motion';

const RILLA_EASE = [0.445, 0.05, 0.55, 0.95] as const;

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/** Rilla-style scroll reveal: opacity + subtle rise & scale on the sine ease. */
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, y = 28, className, once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once, margin: '-80px' }}
    transition={{ duration: 0.7, ease: RILLA_EASE, delay }}
  >
    {children}
  </motion.div>
);

export default Reveal;
