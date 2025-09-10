export type Era = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  color: string;
};

export type Event = {
  id: string;
  name: string;
  year: number;
  description: string;
  imageId?: string;
};

export type TimelineItem = Era | Event;

export const eras: Era[] = [
  {
    id: 'era-1',
    name: 'Antiquity',
    startYear: -753,
    endYear: 476,
    description: 'The era of classical civilizations, such as Ancient Greece and the Roman Empire, which laid the foundations of Western culture.',
    color: 'bg-red-500/20 border-red-500',
  },
  {
    id: 'era-2',
    name: 'Middle Ages',
    startYear: 476,
    endYear: 1492,
    description: 'Also known as the medieval period, it spanned from the fall of the Western Roman Empire to the beginning of the Renaissance and the Age of Discovery.',
    color: 'bg-yellow-500/20 border-yellow-500',
  },
  {
    id: 'era-3',
    name: 'Early Modern',
    startYear: 1400,
    endYear: 1800,
    description: 'Characterized by the Renaissance, the Age of Discovery, and the Protestant Reformation. It was a time of great scientific and artistic achievement.',
    color: 'bg-green-500/20 border-green-500',
  },
    {
    id: 'era-4',
    name: 'Modern Era',
    startYear: 1800,
    endYear: 2024,
    description: 'An era of industrialization, global conflicts, technological revolution, and the rise of a globalized world.',
    color: 'bg-blue-500/20 border-blue-500',
  },
];

export const events: Event[] = [
  {
    id: 'event-1',
    name: 'Founding of Rome',
    year: -753,
    description: 'Traditional date for the founding of Rome by Romulus and Remus, marking the beginning of Roman civilization.',
    imageId: 'event-1',
  },
  {
    id: 'event-2',
    name: 'Fall of Western Roman Empire',
    year: 476,
    description: 'The deposition of the last Western Roman Emperor, Romulus Augustulus, by the Germanic chieftain Odoacer. This event is traditionally seen as the end of Antiquity and the beginning of the Middle Ages.',
    imageId: 'event-2',
  },
  {
    id: 'event-3',
    name: 'Columbus reaches the Americas',
    year: 1492,
    description: 'Christopher Columbus\'s first voyage across the Atlantic Ocean, initiating the Columbian Exchange and the European colonization of the Americas.',
    imageId: 'event-3',
  },
  {
    id: 'event-4',
    name: 'The Renaissance Begins',
    year: 1400,
    description: 'A period of intense artistic, cultural, and intellectual revival that began in Italy and spread across Europe, marking a transition from the Middle Ages to modernity.',
    imageId: 'event-4',
  },
  {
    id: 'event-5',
    name: 'Start of World War I',
    year: 1914,
    description: 'The beginning of a global conflict that reshaped the political map of the world and introduced new, devastating methods of warfare.',
    imageId: 'event-5',
  },
  {
    id: 'event-6',
    name: 'Moon Landing',
    year: 1969,
    description: 'Apollo 11 mission successfully lands the first humans on the Moon, a pivotal moment in the Space Race and human exploration.',
    imageId: 'event-6'
  },
  {
    id: 'event-7',
    name: 'The Information Age',
    year: 1975,
    description: 'The beginning of the mass-market personal computer era, leading to the digital revolution and the internet.',
    imageId: 'event-7'
  }
];
