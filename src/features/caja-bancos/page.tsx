import React, { useState } from 'react';
import { Card } from '../../components/componentsreutilizables';
import { Wallet, ArrowLeftRight } from 'lucide-react';
import { CajaManager, ConciliacionBancaria } from './components';

export const CajaBancosPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('caja');

  const tabs = [
    {
      id: 'caja',
      label: 'Gestión de Caja',
      icon: <Wallet size={18} />
    },
    {
      id: 'bancos',
      label: 'Conciliación Bancaria',
      icon: <ArrowLeftRight size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Wallet size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Caja & Bancos
                </h1>
                <p className="text-gray-600">
                  Sistema completo de gestión de caja física y bancos para gimnasios
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    tabActiva === tab.id
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  {tab.icon && (
                    <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 px-4 pb-4">
            {tabActiva === 'caja' && <CajaManager />}
            {tabActiva === 'bancos' && <ConciliacionBancaria />}
          </div>
        </Card>
      </div>
    </div>
  );
};