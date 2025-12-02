import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import { ActiveClientsList } from './ActiveClientsList';
import { RiskClientsPanel } from './RiskClientsPanel';
import { LostClientsManager } from './LostClientsManager';
import { Client360ProfileComponent } from './Client360Profile';
import { Client } from '../types';
import { Users, AlertTriangle, UserX } from 'lucide-react';

type TabId = 'active' | 'risk' | 'lost';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

interface ClientsManagerProps {
  role: 'entrenador' | 'gimnasio';
  onClientSelected?: (clientId: string | null) => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({ role, onClientSelected }) => {
  const [activeTab, setActiveTab] = useState<TabId>('active');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const tabItems: TabItem[] = [
    {
      id: 'active',
      label: role === 'entrenador' ? 'Mis Clientes' : 'Socios Activos',
      icon: Users,
    },
    {
      id: 'risk',
      label: 'En Riesgo',
      icon: AlertTriangle,
    },
    {
      id: 'lost',
      label: 'Perdidos',
      icon: UserX,
    },
  ];

  const handleClientClick = (client: Client) => {
    setSelectedClientId(client.id);
    onClientSelected?.(client.id);
  };

  const handleCloseProfile = () => {
    setSelectedClientId(null);
    onClientSelected?.(null);
  };

  if (selectedClientId) {
    return (
      <Client360ProfileComponent
        clientId={selectedClientId}
        onClose={handleCloseProfile}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones de clientes"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabItems.map(({ id, label, icon: Icon }) => {
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
                  <Icon
                    size={18}
                    className={activo ? 'opacity-100' : 'opacity-70'}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="mt-6">
        {activeTab === 'active' && (
          <ActiveClientsList onClientClick={handleClientClick} />
        )}
        {activeTab === 'risk' && (
          <RiskClientsPanel onClientClick={handleClientClick} />
        )}
        {activeTab === 'lost' && (
          <LostClientsManager onClientClick={handleClientClick} />
        )}
      </div>
    </div>
  );
};

