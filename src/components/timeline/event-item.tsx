"use client";

import { Event } from '@/app/data/timeline-data';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type EventItemProps = {
  event: Event;
  minYear: number;
  totalYears: number;
  onClick: () => void;
};

export function EventItem({ event, minYear, totalYears, onClick }: EventItemProps) {
  const left = ((event.year - minYear) / totalYears) * 100;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            onClick={onClick}
            className="absolute top-[calc(50%-0.75rem)] w-6 h-6 rounded-full bg-accent/50 border-2 border-accent cursor-pointer flex items-center justify-center group"
            style={{
              left: `${left}%`,
              transform: 'translateX(-50%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.5, zIndex: 10,
              boxShadow: '0 0 15px hsl(var(--accent))'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
             <div className="w-2 h-2 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125"></div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-headline">{event.name} ({event.year})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
