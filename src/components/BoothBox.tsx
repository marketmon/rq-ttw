'use client';

import { Booth } from '@/data/booths';

interface BoothBoxProps {
  booth: Booth;
  isSelected: boolean;
  onClick: (booth: Booth) => void;
}

export default function BoothBox({ booth, isSelected, onClick }: BoothBoxProps) {
  const sizeClass = `size-${booth.size}`;
  const hasStartup = booth.startup !== undefined;

  return (
    <div
      className={`booth ${sizeClass} ${hasStartup ? 'has-startup' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(booth)}
      title={booth.startup?.name || `Booth ${booth.id}`}
    >
      {booth.id}
    </div>
  );
}
