"use client";

import React, { useMemo } from 'react';

type TimelineRulerProps = {
  minYear: number;
  maxYear: number;
  totalYears: number;
  zoom: number;
};

const calculateStep = (rangePerView: number) => {
  if (rangePerView > 5000) return 1000;
  if (rangePerView > 2000) return 500;
  if (rangePerView > 1000) return 200;
  if (rangePerView > 500) return 100;
  if (rangePerView > 200) return 50;
  if (rangePerView > 100) return 20;
  if (rangePerView > 50) return 10;
  if (rangePerView > 20) return 5;
  if (rangePerView > 10) return 2;
  return 1;
};


export function TimelineRuler({ minYear, maxYear, totalYears, zoom }: TimelineRulerProps) {
  const markers = useMemo(() => {
    const yearsPerView = totalYears / zoom;
    const step = calculateStep(yearsPerView);
    const newMarkers = [];

    const start = Math.ceil(minYear / step) * step;

    for (let year = start; year <= maxYear; year += step) {
      const left = ((year - minYear) / totalYears) * 100;
      if (left >= 0 && left <= 100) {
        newMarkers.push({ year, left });
      }
    }
    return newMarkers;
  }, [minYear, maxYear, totalYears, zoom]);

  return (
    <div className="absolute top-1/2 left-0 w-full h-px z-0">
      {/* Main timeline axis */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-primary" />

      {markers.map(({ year, left }) => (
        <div
          key={year}
          className="absolute -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${left}%` }}
        >
            <div className="w-3 h-3 rounded-full bg-background border-2 border-primary" />
          <span className="absolute top-5 text-xs text-muted-foreground whitespace-nowrap">
             {Math.abs(year)} {year < 0 ? 'BE' : 'AE'}
          </span>
        </div>
      ))}
    </div>
  );
}
