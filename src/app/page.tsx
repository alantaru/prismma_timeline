import { eras, events } from '@/app/data/timeline-data';
import { Timeline } from '@/components/timeline/timeline';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="p-4 border-b border-cyan-400/20 flex items-center justify-center z-20 shadow-lg shadow-cyan-400/10 bg-transparent backdrop-blur-sm">
        <div className='text-center'>
            <h1 className="text-4xl font-headline font-bold text-cyan-300 tracking-[0.2em]">CHRONOS</h1>
            <p className="text-sm text-cyan-400/80 tracking-[0.4em]">HISTORY TIMELINE</p>
        </div>
      </header>
      <main className="flex-grow overflow-hidden relative">
        <Timeline eras={eras} events={events} />
      </main>
    </div>
  );
}
