"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Era, Event, TimelineItem } from '@/app/data/timeline-data';
import { ZoomControls } from './zoom-controls';
import { DetailPanel } from './detail-panel';
import { motion } from 'framer-motion';
import { EraItem as EraItemComponent } from './era-item';
import { EventItem as EventItemComponent } from './event-item';
import { useToast } from "@/hooks/use-toast";
import { intelligentZoom, IntelligentZoomInput } from '@/ai/flows/intelligent-zoom';

type TimelineProps = {
  eras: Era[];
  events: Event[];
};

export function Timeline({ eras, events }: TimelineProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { minYear, maxYear, totalYears } = useMemo(() => {
    const allYears = [
      ...eras.map(e => e.startYear),
      ...eras.map(e => e.endYear),
      ...events.map(e => e.year),
    ];
    const min = Math.min(...allYears);
    const max = Math.max(...allYears);
    return { minYear: min, maxYear: max, totalYears: max - min };
  }, [eras, events]);

  const handleSelectItem = (item: TimelineItem) => {
    setSelectedItem(item);
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
  };

  const handleIntelligentZoom = useCallback(async () => {
    if (!scrollContainerRef.current) return;
    setIsAiLoading(true);

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    const viewStartRatio = scrollLeft / scrollWidth;
    const viewEndRatio = (scrollLeft + clientWidth) / scrollWidth;

    const currentStartYear = minYear + viewStartRatio * totalYears * zoom;
    const currentEndYear = minYear + viewEndRatio * totalYears * zoom;

    const visibleEvents = events.filter(e => e.year >= currentStartYear && e.year <= currentEndYear);
    const visibleEras = eras.filter(e => e.startYear <= currentEndYear && e.endYear >= currentStartYear);

    const input: IntelligentZoomInput = {
      currentStart: new Date(String(Math.floor(currentStartYear)), 1, 1).getTime(),
      currentEnd: new Date(String(Math.floor(currentEndYear)), 1, 1).getTime(),
      totalEvents: visibleEvents.length,
      totalEras: visibleEras.length,
    };

    try {
      const result = await intelligentZoom(input);
      const newZoom = Math.max(1, Math.min(result.suggestedZoom, 100)); // clamp zoom
      setZoom(newZoom);
      toast({
        title: "Intelligent Zoom Applied",
        description: result.reason,
      });
    } catch (error) {
      console.error("AI Zoom Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get AI suggestion.",
      });
    } finally {
        setIsAiLoading(false);
    }
  }, [minYear, totalYears, zoom, events, eras, toast]);
  

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div 
        ref={scrollContainerRef} 
        className="flex-grow w-full overflow-x-auto relative cursor-grab active:cursor-grabbing"
      >
        <motion.div 
          className="relative h-full"
          style={{ width: `${zoom * 100}%` }}
          animate={{ width: `${zoom * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Main Timeline Axis */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400/20 z-0" />
          
          {/* Eras */}
          <div className="absolute top-0 left-0 w-full h-1/2 p-4">
            {eras.map(era => 
              <EraItemComponent 
                key={era.id} 
                era={era} 
                minYear={minYear} 
                totalYears={totalYears} 
                onClick={() => handleSelectItem(era)} 
              />
            )}
          </div>
          
          {/* Events */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 p-4">
            {events.map(event => 
              <EventItemComponent
                key={event.id}
                event={event}
                minYear={minYear}
                totalYears={totalYears}
                onClick={() => handleSelectItem(event)}
              />
            )}
          </div>
        </motion.div>
      </div>

      <ZoomControls 
        zoom={zoom} 
        setZoom={setZoom}
        onIntelligentZoom={handleIntelligentZoom}
        isAiLoading={isAiLoading}
      />
      
      <DetailPanel 
        item={selectedItem}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClosePanel();
        }}
      />
    </div>
  );
}
