import React, { useState } from 'react';
import { Card, Tabs } from '../../components/componentsreutilizables';
import { ds } from '../adherencia/ui/ds';
import { CajaManager, ConciliacionBancaria } from './components';

export const CajaBancosPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('caja');

  const tabs = [
    {
      id: 'caja',
      label: 'Gestión de Caja',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'bancos',
      label: 'Conciliación Bancaria',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="text-center">
        <h1 className={`${ds.typography.displayLarge} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Caja & Bancos
        </h1>
        <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} max-w-2xl mx-auto`}>
          Sistema completo de gestión de caja física y bancos para gimnasios. 
          Controle el efectivo, realice arqueos, concilie movimientos bancarios y mantenga la transparencia financiera.
        </p>
      </div>

      {/* Navegación principal */}
      <Card>
        <div className="p-6">
          <Tabs
            items={tabs}
            activeTab={tabActiva}
            onTabChange={setTabActiva}
          />
          
          <div className="mt-6">
            {tabActiva === 'caja' && <CajaManager />}
            {tabActiva === 'bancos' && <ConciliacionBancaria />}
          </div>
        </div>
      </Card>
    </div>
  );
};