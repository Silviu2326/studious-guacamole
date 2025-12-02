import {
  BrainCircuit,
  CalendarRange,
  Clapperboard,
  Globe2,
  Lightbulb,
  Link2,
  Library,
  Megaphone,
  MessageSquareText,
  PenLine,
  Scissors,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users2,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IconKey } from '../types';

export const ICON_MAP: Record<IconKey, LucideIcon> = {
  sparkles: Sparkles,
  calendar: CalendarRange,
  film: Clapperboard,
  scissors: Scissors,
  share: Share2,
  lightbulb: Lightbulb,
  users: Users2,
  library: Library,
  zap: Zap,
  trendingUp: TrendingUp,
  globe: Globe2,
  link: Link2,
  pen: PenLine,
  target: Target,
  megaphone: Megaphone,
  brain: BrainCircuit,
  message: MessageSquareText,
};

