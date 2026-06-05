import {
  LayoutDashboard,
  Map,
  Users,
  ClipboardList,
  FlaskConical,
  Hospital,
  CalendarDays,
  ShieldAlert,
  Trophy,
  Bell,
  User,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Live Map', path: '/dashboard/map', icon: Map },
  { label: 'Donors', path: '/dashboard/donors', icon: Users },
  { label: 'Requests', path: '/dashboard/requests', icon: ClipboardList },
  { label: 'Inventory', path: '/dashboard/inventory', icon: FlaskConical },
  { label: 'Hospitals', path: '/dashboard/hospitals', icon: Hospital },
  { label: 'Blood Drives', path: '/dashboard/drives', icon: CalendarDays },
  { label: 'Rare Blood', path: '/dashboard/rare-blood', icon: ShieldAlert },
  { label: 'Leaderboard', path: '/dashboard/leaderboard', icon: Trophy },
  { label: 'Alerts', path: '/dashboard/alerts', icon: Bell },
  { label: 'Profile', path: '/dashboard/profile', icon: User },
] as const;
