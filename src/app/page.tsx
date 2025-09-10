import { eras, events } from '@/app/data/timeline-data';
import { Timeline } from '@/components/timeline/timeline';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="p-4 border-b border-border flex items-center justify-between z-20 shadow-md bg-background/80 backdrop-blur-sm">
        <h1 className="text-2xl font-headline font-bold text-primary">ChronoFlow</h1>
      </header>
      <main className="flex-grow overflow-hidden relative">
        <Timeline eras={eras} events={events} />
      </main>
    </div>
  );
}
