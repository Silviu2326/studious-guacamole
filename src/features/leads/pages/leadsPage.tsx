import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { LeadsManager } from '../components';
import { 
  Users, 
  TrendingUp, 
  Target, 
  MessageSquare,
  UserPlus,
  BarChart3
} from 'lucide-react';

/**
 * Página principal de Leads y Pipeline
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Leads 1 a 1 desde redes sociales (Instagram, WhatsApp, Referidos)
 * - Gimnasios: Pipeline comercial clásico con campañas, visitas al centro, eventos
 */
export default function LeadsPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const businessType = esEntrenador ? 'entrenador' : 'gimnasio';

  // Métricas adaptadas por rol
  const metrics = esEntrenador
    ? [
        {
          id: 'total',
          title: 'Mis Leads',
          value: 24,
          subtitle: 'Leads activos',
          icon: <Users className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'calientes',
          title: 'Leads Calientes',
          value: 8,
          subtitle: 'Score > 70',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'warning' as const,
        },
        {
          id: 'pendientes',
          title: 'Pendientes',
          value: 5,
          subtitle: 'Requieren seguimiento',
          icon: <MessageSquare className="w-5 h-5" />,
          color: 'info' as const,
        },
        {
          id: 'conversion',
          title: 'Tasa Conversión',
          value: '28%',
          subtitle: 'Últimos 30 días',
          icon: <Target className="w-5 h-5" />,
          color: 'success' as const,
          trend: {
            value: 3.2,
            direction: 'up' as const,
            label: 'vs mes anterior',
          },
        },
      ]
    : [
        {
          id: 'total',
          title: 'Total Leads',
          value: 156,
          subtitle: 'En pipeline',
          icon: <Users className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'nuevos',
          title: 'Nuevos',
          value: 42,
          subtitle: 'Últimos 7 días',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'info' as const,
          trend: {
            value: 12,
            direction: 'up' as const,
            label: 'vs semana anterior',
          },
        },
        {
          id: 'convertidos',
          title: 'Convertidos',
          value: 28,
          subtitle: 'Este mes',
          icon: <Target className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'conversion',
          title: 'Tasa Conversión',
          value: '18%',
          subtitle: 'Promedio mensual',
          icon: <BarChart3 className="w-5 h-5" />,
          color: 'warning' as const,
          trend: {
            value: 2.5,
            direction: 'up' as const,
            label: 'vs mes anterior',
          },
        },
      ];

  return (
    <div className="p-6 space-y-6">
      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            {esEntrenador ? 'Gestión de Leads' : 'Pipeline Comercial'}
          </h1>
          <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} max-w-2xl`}>
            {esEntrenador
              ? 'Gestiona tus leads personales desde redes sociales, WhatsApp y referidos. Enfoque 1 a 1 para conversiones personalizadas.'
              : 'Sistema completo de gestión de pipeline comercial. Captura leads desde múltiples canales, gestiona visitas al centro y coordina tu equipo de ventas.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md">
            <UserPlus className="w-4 h-4 mr-2" />
            {esEntrenador ? 'Nuevo Lead' : 'Capturar Lead'}
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metrics} columns={4} />

      {/* Gestor principal de leads */}
      <LeadsManager businessType={businessType} />
    </div>
  );
}

