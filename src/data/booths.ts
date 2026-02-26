export type BoothSize = '6x6' | '10x10' | '15x15' | '20x20';

export interface Startup {
  name: string;
  description: string;
  website: string;
  slideDeck?: string;
  representatives: string[];
}

export interface Booth {
  id: number;
  size: BoothSize;
  location: 'main-tent' | 'outside-bottom' | 'outside-right';
  row: number;
  startup?: Startup;
}

// Booth layout data matching the tent diagram
export const booths: Booth[] = [
  // Main tent - Row 1 (top)
  { id: 1, size: '15x15', location: 'main-tent', row: 1 },
  { id: 2, size: '10x10', location: 'main-tent', row: 1 },
  { id: 3, size: '10x10', location: 'main-tent', row: 1 },
  { id: 4, size: '10x10', location: 'main-tent', row: 1 },
  { id: 5, size: '10x10', location: 'main-tent', row: 1 },
  { id: 6, size: '10x10', location: 'main-tent', row: 1 },
  { id: 7, size: '15x15', location: 'main-tent', row: 1 },

  // Main tent - Row 2 (6x6 booths)
  { id: 8, size: '6x6', location: 'main-tent', row: 2 },
  { id: 9, size: '6x6', location: 'main-tent', row: 2 },
  { id: 10, size: '6x6', location: 'main-tent', row: 2 },
  { id: 11, size: '6x6', location: 'main-tent', row: 2 },
  { id: 12, size: '6x6', location: 'main-tent', row: 2 },
  { id: 13, size: '6x6', location: 'main-tent', row: 2 },
  { id: 14, size: '6x6', location: 'main-tent', row: 2 },
  { id: 15, size: '6x6', location: 'main-tent', row: 2 },

  // Main tent - Row 3 (middle)
  { id: 16, size: '15x15', location: 'main-tent', row: 3 },
  { id: 17, size: '10x10', location: 'main-tent', row: 3 },
  { id: 18, size: '10x10', location: 'main-tent', row: 3 },
  { id: 19, size: '10x10', location: 'main-tent', row: 3 },
  { id: 20, size: '10x10', location: 'main-tent', row: 3 },
  { id: 21, size: '10x10', location: 'main-tent', row: 3 },
  { id: 22, size: '15x15', location: 'main-tent', row: 3 },

  // Main tent - Row 4 (6x6 booths)
  { id: 23, size: '6x6', location: 'main-tent', row: 4 },
  { id: 24, size: '6x6', location: 'main-tent', row: 4 },
  { id: 25, size: '6x6', location: 'main-tent', row: 4 },
  { id: 26, size: '6x6', location: 'main-tent', row: 4 },
  { id: 27, size: '6x6', location: 'main-tent', row: 4 },
  { id: 28, size: '6x6', location: 'main-tent', row: 4 },
  { id: 29, size: '6x6', location: 'main-tent', row: 4 },
  { id: 30, size: '6x6', location: 'main-tent', row: 4 },

  // Main tent - Row 5 (bottom)
  { id: 31, size: '15x15', location: 'main-tent', row: 5 },
  { id: 32, size: '10x10', location: 'main-tent', row: 5 },
  { id: 33, size: '10x10', location: 'main-tent', row: 5 },
  { id: 34, size: '10x10', location: 'main-tent', row: 5 },
  { id: 35, size: '10x10', location: 'main-tent', row: 5 },
  { id: 36, size: '10x10', location: 'main-tent', row: 5 },
  { id: 37, size: '15x15', location: 'main-tent', row: 5 },

  // Outside tents - Bottom row
  { id: 38, size: '20x20', location: 'outside-bottom', row: 6 },
  { id: 39, size: '20x20', location: 'outside-bottom', row: 6 },
  { id: 40, size: '20x20', location: 'outside-bottom', row: 6 },
  { id: 41, size: '20x20', location: 'outside-bottom', row: 6 },

  // Outside tents - Right side
  { id: 42, size: '20x20', location: 'outside-right', row: 7 },
  { id: 43, size: '20x20', location: 'outside-right', row: 7 },
];

// Sample startup data (to be replaced with real data later)
export const sampleStartups: Record<number, Startup> = {
  1: {
    name: 'TechVenture AI',
    description: 'AI-powered analytics platform for enterprise businesses.',
    website: 'https://example.com/techventure',
    slideDeck: 'https://example.com/slides/techventure.pdf',
    representatives: ['John Smith', 'Jane Doe'],
  },
  2: {
    name: 'GreenEnergy Solutions',
    description: 'Sustainable energy management for smart buildings.',
    website: 'https://example.com/greenenergy',
    representatives: ['Mike Johnson'],
  },
  // Add more sample data as needed
};

export function getBoothWithStartup(boothId: number): Booth | undefined {
  const booth = booths.find(b => b.id === boothId);
  if (booth && sampleStartups[boothId]) {
    return { ...booth, startup: sampleStartups[boothId] };
  }
  return booth;
}
