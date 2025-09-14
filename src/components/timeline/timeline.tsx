"use client";

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Era, Event, TimelineItem } from '@/app/data/timeline-data';
import { ZoomControls } from './zoom-controls';
import { DetailPanel } from './detail-panel';
import { motion } from 'framer-motion';
import { EraItem as EraItemComponent } from './era-item';
import { EventItem as EventItemComponent } from './event-item';
import { useToast } from "@/hooks/use-toast";
import { intelligentZoom, IntelligentZoomInput } from '@/ai/flows/intelligent-zoom';
import { TimelineRuler } from './timeline-ruler';

type TimelineProps = {
  eras: Era[];
  events: Event[];
};

const ITEM_WIDTH = 192; // 12rem
const ITEM_GAP = 16; // 1rem

function getVerticalLevels<T extends { startYear: number; endYear: number } | { year: number }>(items: T[], minYear: number, totalYears: number, zoom: number, containerWidth: number | null): Map<string, number> {
  const levels = new Map<string, number>();
  if (!containerWidth) return levels;

  const timelineWidth = containerWidth * zoom;
  const pixelsPerYear = timelineWidth / totalYears;

  const sortedItems = [...items].sort((a, b) => {
    const yearA = 'year' in a ? a.year : a.startYear;
    const yearB = 'year' in b ? b.year : b.endYear;
    return yearA - yearB;
  });

  const levelEndPositions: number[] = [];

  for (const item of sortedItems) {
    const id = 'id' in item ? (item as any).id : String(Math.random());
    const startPixel = ('year' in item 
      ? item.year * pixelsPerYear 
      : item.startYear * pixelsPerYear) - (minYear * pixelsPerYear);
    
    const itemWidth = 'year' in item
      ? ITEM_WIDTH 
      : (item.endYear - item.startYear) * pixelsPerYear;

    let placed = false;
    for (let i = 0; i < levelEndPositions.length; i++) {
      if (levelEndPositions[i] + ITEM_GAP < startPixel) {
        levels.set(id, i);
        levelEndPositions[i] = startPixel + itemWidth;
        placed = true;
        break;
      }
    }

    if (!placed) {
      levels.set(id, levelEndPositions.length);
      levelEndPositions.push(startPixel + itemWidth);
    }
  }

  return levels;
}


export function Timeline({ eras, events }: TimelineProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);


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

  const measuredRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setContainerWidth(node.getBoundingClientRect().width);
      scrollContainerRef.current = node;
    }
  }, []);
  
  const eraLevels = useMemo(() => getVerticalLevels(eras, minYear, totalYears, zoom, containerWidth), [eras, minYear, totalYears, zoom, containerWidth]);
  const eventLevels = useMemo(() => getVerticalLevels(events, minYear, totalYears, zoom, containerWidth), [events, minYear, totalYears, zoom, containerWidth]);

  const handleSelectItem = (item: TimelineItem) => {
    setSelectedItem(item);
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if(scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if(scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // The multiplier allows for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
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
    <div className="w-full h-full flex flex-col">
      <div 
        ref={measuredRef} 
        className="flex-grow w-full overflow-x-auto relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <motion.div 
          className="relative h-full"
          style={{ width: `${zoom * 100}%` }}
          animate={{ width: `${zoom * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          
          <TimelineRuler minYear={minYear} maxYear={maxYear} zoom={zoom} totalYears={totalYears} />

          {/* Eras */}
          <div className="absolute top-0 left-0 w-full h-1/2 -translate-y-full -top-8">
            {eras.map(era => 
              <EraItemComponent 
                key={era.id} 
                era={era} 
                minYear={minYear} 
                totalYears={totalYears} 
                onClick={() => handleSelectItem(era)} 
                level={eraLevels.get(era.id) || 0}
              />
            )}
          </div>
          
          {/* Events */}
          <div className="absolute top-1/2 left-0 w-full h-auto">
            {events.map(event => 
              <EventItemComponent
                key={event.id}
                event={event}
                minYear={minYear}
                totalYears={totalYears}
                onClick={() => handleSelectItem(event)}
                level={eventLevels.get(event.id) || 0}
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
