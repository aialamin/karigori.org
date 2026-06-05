import { Wrench, Zap, Sparkles, Home, Paintbrush, Wind, Hammer, Flame } from 'lucide-react';

const iconMap = {
  plumber:     Wrench,
  electrician: Zap,
  cleaner:     Sparkles,
  bua:         Home,
  painter:     Paintbrush,
  ac_repair:   Wind,
  carpenter:   Hammer,
  gas_fitter:  Flame,
};

export function CategoryIcon({ category, size = 20, className = '' }) {
  const Icon = iconMap[category] || Wrench;
  return <Icon size={size} className={className} />;
}
