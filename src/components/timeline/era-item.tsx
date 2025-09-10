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
};

export function EraItem({ era, minYear, totalYears, onClick }: EraItemProps) {
  const left = ((era.startYear - minYear) / totalYears) * 100;
  const width = ((era.endYear - era.startYear) / totalYears) * 100;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            onClick={onClick}
            className={cn(
              'absolute bottom-[calc(50%+1rem)] h-8 rounded-md border text-xs flex items-center justify-center px-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02]',
              era.color
            )}
            style={{
              left: `${left}%`,
              width: `${width}%`,
              minWidth: 'max-content',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -2 }}
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
