"use client";

import { Era } from '@/app/data/timeline-data';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type EraItemProps = {
  era: Era;
  minYear: number;
  totalYears: number;
  onClick: () => void;
  level: number;
};

export function EraItem({ era, minYear, totalYears, onClick, level }: EraItemProps) {
  const left = ((era.startYear - minYear) / totalYears) * 100;
  const width = ((era.endYear - era.startYear) / totalYears) * 100;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            onClick={onClick}
            className={cn(
              'absolute h-8 rounded-md border text-sm flex items-center justify-start px-4 cursor-pointer transition-all duration-300',
              'bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground'
            )}
            style={{
              left: `${left}%`,
              width: `${width}%`,
              bottom: `${2 + level * 2.5}rem`,
              minWidth: 'max-content',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -2,
                boxShadow: '0 0 15px rgba(203, 213, 225, 0.1)'
             }}
          >
            <span className="truncate font-headline">{era.name}</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{era.name} ({era.startYear} - {era.endYear})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
