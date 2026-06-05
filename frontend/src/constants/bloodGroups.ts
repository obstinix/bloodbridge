export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export type BloodGroup = typeof BLOOD_GROUPS[number];

export const BLOOD_GROUP_COLORS: Record<BloodGroup, { bg: string; text: string; dark: string }> = {
  'A+':  { bg: '#FEE2E2', text: '#A4161A', dark: '#DC2626' },
  'A-':  { bg: '#FEE2E2', text: '#7F1D1D', dark: '#EF4444' },
  'B+':  { bg: '#FFF7ED', text: '#9A3412', dark: '#F97316' },
  'B-':  { bg: '#FFF7ED', text: '#7C2D12', dark: '#EA580C' },
  'AB+': { bg: '#F5F3FF', text: '#5B21B6', dark: '#8B5CF6' },
  'AB-': { bg: '#EDE9FE', text: '#4C1D95', dark: '#7C3AED' },
  'O+':  { bg: '#FEF3C7', text: '#92400E', dark: '#F59E0B' },
  'O-':  { bg: '#ECFDF5', text: '#065F46', dark: '#10B981' },
};
