import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { User, Calendar, TrendingUp, FileText, History, CreditCard, Ruler, StickyNote } from 'lucide-react';
import { WorkoutHistoryTab } from './WorkoutHistoryTab';
import { PaymentHistoryTab } from './PaymentHistoryTab';
import { MeasurementsTab } from './MeasurementsTab';
import { NotesTab } from './NotesTab';

interface ClientDataTabsProps {
  clientId: string;
}

export const ClientDataTabs: React.FC<ClientDataTabsProps> = ({ clientId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <User size={18} /> },
    { id: 'workouts', label: 'Entrenamientos', icon: <History size={18} /> },
    { id: 'payments', label: 'Pagos', icon: <CreditCard size={18} /> },
    { id: 'measurements', label: 'Mediciones', icon: <Ruler size={18} /> },
    { id: 'notes', label: 'Notas', icon: <StickyNote size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resumen General</h3>
              <p className="text-gray-600">
                Vista completa de la actividad reciente y estado del cliente
              </p>
            </div>
          </div>
        );
      case 'workouts':
        return <WorkoutHistoryTab clientId={clientId} />;
      case 'payments':
        return <PaymentHistoryTab clientId={clientId} />;
      case 'measurements':
        return <MeasurementsTab clientId={clientId} />;
      case 'notes':
        return <NotesTab clientId={clientId} />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-0 bg-white shadow-sm">
      {/* Sistema de Tabs */}
      <div className="px-4 py-3">
        <div
          role="tablist"
          aria-label="Secciones del cliente"
          className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
        >
          {tabs.map(({ id, label, icon }) => {
            const activo = activeTab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={activo}
                onClick={() => setActiveTab(id)}
                className={[
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                  activo
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                ].join(' ')}
              >
                <span className={activo ? 'opacity-100' : 'opacity-70'}>
                  {icon}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la tab activa */}
      <div className="border-t border-gray-100">
        {renderTabContent()}
      </div>
    </Card>
  );
};

