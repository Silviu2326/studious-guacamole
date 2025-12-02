import React, { useState } from 'react';
import { Card, Tabs } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { CajaManager, ConciliacionBancaria } from '../components';
import { Wallet, ArrowLeftRight } from 'lucide-react';

/**
 * Página principal de Caja & Bancos
 * 
 * Sistema completo de gestión de caja física y bancos para gimnasios.
 * Funcionalidades principales:
 * - Arqueo de caja física
 * - Conciliación bancaria
 * - Control de TPV
 * - Gestión de movimientos
 * - Reportes y auditoría
 */
export const CajaBancosPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('caja');

  const tabs = [
    {
      id: 'caja',
      label: 'Gestión de Caja',
      icon: <Wallet className="w-4 h-4" />
    },
    {
      id: 'bancos',
      label: 'Conciliación Bancaria',
      icon: <ArrowLeftRight className="w-4 h-4" />
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

export default CajaBancosPage;

