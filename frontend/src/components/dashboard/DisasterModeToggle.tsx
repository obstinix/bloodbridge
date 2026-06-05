import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useAlertStore } from '@/stores/alertStore';
import { ShieldAlert } from 'lucide-react';

export default function DisasterModeToggle() {
  const { disasterMode, toggleDisasterMode } = useAlertStore();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-amber-950/20 border border-orange-200 dark:border-amber-900/30 rounded-[6px] text-xs font-semibold text-orange-700 dark:text-orange-300">
      <ShieldAlert className="w-4 h-4 text-orange-600 dark:text-orange-400" />
      <span>Disaster Mode</span>
      <Switch 
        checked={disasterMode} 
        onCheckedChange={toggleDisasterMode} 
      />
    </div>
  );
}
