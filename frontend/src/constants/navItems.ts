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
  { label: 'Dashboard',   path: '/dashboard',               icon: LayoutDashboard },
  { label: 'Live Map',    path: '/inventory',               icon: Map },
  { label: 'Donors',      path: '/emergency',               icon: Users },
  { label: 'Requests',    path: '/emergency',               icon: ClipboardList },
  { label: 'Inventory',   path: '/inventory',               icon: FlaskConical },
  { label: 'Hospitals',   path: '/emergency',               icon: Hospital },
  { label: 'Blood Drives',path: '/leaderboard',             icon: CalendarDays },
  { label: 'Rare Blood',  path: '/rare-blood',              icon: ShieldAlert },
  { label: 'Leaderboard', path: '/leaderboard',             icon: Trophy },
  { label: 'Alerts',      path: '/dashboard/admin/alerts',  icon: Bell },
  { label: 'Profile',     path: '/dashboard/settings',      icon: User },
] as const;
