import React from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  BoltIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowRightIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

export const icons = {
  chart: ChartBarIcon,
  users: UsersIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  check: CheckCircleIcon,
  clipboard: ClipboardDocumentListIcon,
  clock: ClockIcon,
  bolt: BoltIcon,
  lightbulb: LightBulbIcon,
  wrench: WrenchScrewdriverIcon,
  trendUp: ArrowTrendingUpIcon,
  trendDown: ArrowTrendingDownIcon,
  trendFlat: ArrowRightIcon,
  megaphone: MegaphoneIcon,
};

export const Icon = ({ name, className }: { name: keyof typeof icons; className?: string }) => {
  const Comp = icons[name];
  return <Comp className={className ?? 'w-6 h-6'} />;
};

export const iconForCategoria = (categoria: string) => {
  switch (categoria) {
    case 'comunicacion':
      return <Icon name="megaphone" className="w-6 h-6 text-slate-600" />;
    case 'motivacion':
      return <Icon name="bolt" className="w-6 h-6 text-amber-600" />;
    case 'entrenamiento':
      return <Icon name="clipboard" className="w-6 h-6 text-indigo-600" />;
    case 'nutricion':
      return <Icon name="lightbulb" className="w-6 h-6 text-emerald-600" />;
    case 'operativo':
      return <Icon name="wrench" className="w-6 h-6 text-slate-600" />;
    default:
      return <Icon name="info" className="w-6 h-6 text-slate-600" />;
  }
};

export const iconForTendencia = (t: string) => {
  switch (t) {
    case 'mejorando':
      return <Icon name="trendUp" className="w-6 h-6 text-emerald-600" />;
    case 'empeorando':
      return <Icon name="trendDown" className="w-6 h-6 text-red-600" />;
    default:
      return <Icon name="trendFlat" className="w-6 h-6 text-slate-600" />;
  }
};