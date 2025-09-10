"use client";

import { TimelineItem } from '@/app/data/timeline-data';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type DetailPanelProps = {
  item: TimelineItem | null;
  onOpenChange: (open: boolean) => void;
};

export function DetailPanel({ item, onOpenChange }: DetailPanelProps) {
  const isEra = item && 'startYear' in item;
  const imageId = item && 'imageId' in item ? item.imageId : undefined;
  const placeholderImage = imageId ? PlaceHolderImages.find(img => img.id === imageId) : undefined;

  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-background/90 backdrop-blur-lg overflow-y-auto">
        {item && (
          <>
            <SheetHeader>
              <SheetTitle className="text-primary font-headline text-2xl mb-2">{item.name}</SheetTitle>
              <SheetDescription className="text-lg">
                {isEra ? `${item.startYear} - ${item.endYear}` : item.year}
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              {placeholderImage && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <Image
                    src={placeholderImage.imageUrl}
                    alt={placeholderImage.description}
                    width={600}
                    height={400}
                    className="object-cover w-full"
                    data-ai-hint={placeholderImage.imageHint}
                  />
                </div>
              )}
              <p className="text-foreground/80 leading-relaxed">{item.description}</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
