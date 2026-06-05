import React from 'react';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  count: number;
}

export default function StreakDisplay({ count }: StreakDisplayProps) {
  if (count <= 0) {
    return <span className="text-xs text-gray-400 font-mono">-</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 font-mono">
      <Flame className="w-3.5 h-3.5 fill-orange-600" /> {count}
    </span>
  );
}
