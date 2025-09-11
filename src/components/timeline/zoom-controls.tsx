"use client";

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Sparkles, Loader } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ZoomControlsProps = {
  zoom: number;
  setZoom: (zoom: number) => void;
  onIntelligentZoom: () => void;
  isAiLoading: boolean;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 100;

export function ZoomControls({ zoom, setZoom, onIntelligentZoom, isAiLoading }: ZoomControlsProps) {
  
  const handleZoomIn = () => setZoom(Math.min(MAX_ZOOM, zoom * 1.5));
  const handleZoomOut = () => setZoom(Math.max(MIN_ZOOM, zoom / 1.5));

  return (
    <div className="absolute bottom-4 right-4 z-10 p-2 bg-background/50 backdrop-blur-md rounded-lg border border-cyan-400/20 shadow-2xl shadow-cyan-500/10 flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/20">
        <ZoomOut className="h-5 w-5" />
      </Button>
      <Slider
        value={[zoom]}
        onValueChange={(value) => setZoom(value[0])}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.1}
        className="w-48"
      />
      <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/20">
        <ZoomIn className="h-5 w-5" />
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onIntelligentZoom} disabled={isAiLoading} className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/20">
              {isAiLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-primary" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Intelligent Zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
