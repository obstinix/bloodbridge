export const BADGE_DEFINITIONS = [
  { id: 'bronze',    name: 'Lifesaver Bronze',     icon: '🥉', threshold: 5,  tier: 'Bronze' },
  { id: 'silver',    name: 'Lifesaver Silver',     icon: '🥈', threshold: 15, tier: 'Silver' },
  { id: 'gold',      name: 'Lifesaver Gold',       icon: '🥇', threshold: 30, tier: 'Gold' },
  { id: 'platinum',  name: 'Platinum Hero',        icon: '💎', threshold: 50, tier: 'Platinum' },
  { id: 'emergency', name: 'Emergency Responder',  icon: '🚨', threshold: 1,  tier: 'Gold',
    condition: 'Responded to SOS alert' },
  { id: 'rare',      name: 'Rare Blood Guardian',  icon: '🩸', threshold: 1,  tier: 'Platinum',
    condition: 'Rare blood group donor' },
  { id: 'streak7',   name: '7-Day Streak',         icon: '🔥', threshold: 7,  tier: 'Silver',
    condition: '7 consecutive eligible donations' },
] as const;
