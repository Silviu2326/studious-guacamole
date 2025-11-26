import React from 'react';
import { Instagram, Linkedin, Music } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { SocialGrowthMetric } from '../types';

interface SocialGrowthProps {
  networks: SocialGrowthMetric[];
  loading?: boolean;
  className?: string;
}

const iconByNetwork: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-5 h-5" />,
  TikTok: <Music className="w-5 h-5" />,
  LinkedIn: <Linkedin className="w-5 h-5" />,
};

const accentByNetwork: Record<string, string> = {
  Instagram: 'bg-gradient-to-br from-pink-100 to-purple-200 text-pink-600',
  TikTok: 'bg-gradient-to-br from-slate-900 to-gray-700 text-white',
  LinkedIn: 'bg-gradient-to-br from-sky-100 to-blue-200 text-sky-600',
};

export const SocialGrowth: React.FC<SocialGrowthProps> = ({ networks, loading = false, className = '' }) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`social-skeleton-${index}`} className={`${ds.shimmer} h-32`} />
  ));

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Crecimiento redes</h2>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Seguimiento de followers, crecimiento y engagement por canal clave.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && networks.length === 0
          ? placeholders
          : networks.map((network) => {
              const label = network.network;
              const icon = iconByNetwork[label] ?? <Instagram className="w-5 h-5" />;
              const accent = accentByNetwork[label] ?? 'bg-indigo-100 text-indigo-600';

              return (
                <div
                  key={network.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>{icon}</span>
                    <div>
                      <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>{label}</p>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        {network.highlight ?? 'Optimiza microcontenidos'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Seguidores
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {network.followers.toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Crecimiento
                      </p>
                      <p className="text-emerald-500 font-semibold">{network.growthPercentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Engagement
                    </span>
                    <span className={`${ds.typography.caption} font-semibold text-indigo-500`}>
                      {network.engagementRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </Card>
  );
};


