import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-1 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gold" />
        <h2
          className="text-sm font-semibold text-gold uppercase tracking-[0.15em]"
        >
          {title}
        </h2>
      </div>
      {subtitle && <p className="text-xs text-gray-400 pl-4">{subtitle}</p>}
    </motion.div>
  );
};
