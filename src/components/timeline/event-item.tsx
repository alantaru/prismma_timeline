"use client";

import { Event } from '@/app/data/timeline-data';
import { motion } from 'framer-motion';

type EventItemProps = {
  event: Event;
  minYear: number;
  totalYears: number;
  onClick: () => void;
  level: number;
};

const LEVEL_HEIGHT = 100; 

export function EventItem({ event, minYear, totalYears, onClick, level }: EventItemProps) {
  const left = ((event.year - minYear) / totalYears) * 100;
  const topOffset = 2.5; // in rem, space from the ruler
  const top = topOffset + level * (LEVEL_HEIGHT / 16); // in rem

  return (
    <div
      className="absolute"
      style={{ 
        left: `${left}%`,
        top: 0,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Connector Line */}
      <div 
        className="absolute left-1/2 w-px bg-primary"
        style={{ height: `${top}rem`, top: `-${topOffset}rem` }}
      />

      {/* Event Card */}
      <motion.div
        onClick={onClick}
        className="absolute w-48 bg-card text-card-foreground rounded-md shadow-lg p-3 cursor-pointer border border-border"
        style={{
            transform: 'translateX(-50%)',
            top: `${top}rem`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.05, 
          zIndex: 10,
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          borderColor: 'hsl(var(--primary))'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <p className="font-bold text-sm truncate">{event.name}</p>
        <p className="text-xs text-muted-foreground">{event.year < 0 ? `${Math.abs(event.year)} BE` : `${event.year} AE`}</p>
      </motion.div>
    </div>
  );
}
