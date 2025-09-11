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
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-500 border-2 border-slate-300 cursor-pointer flex items-center justify-center group"
            style={{
              left: `${left}%`,
              transform: 'translateX(-50%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ 
              scale: 1.75, 
              zIndex: 10,
              borderColor: '#f8fafc',
              backgroundColor: '#cbd5e1'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
             <div className="w-1 h-1 rounded-full bg-slate-200 transition-transform duration-300 group-hover:scale-125"></div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-headline">{event.name} ({event.year})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
