import React, { useState } from 'react';
import { Card, Tabs } from '../../../components/componentsreutilizables';
import {
  ControlAcceso,
  AforoTiempoReal,
  Torniquetes,
  ContadorPersonas,
  AlertasAforo,
} from '../components';
import { Shield, Users, ArrowRightLeft, UserCheck, Bell } from 'lucide-react';

/**
 * Página principal de Control de Acceso & Aforo en Tiempo Real
 * 
 * Sistema completo de control de acceso y gestión de aforo para gimnasios.
 * Funcionalidades principales:
 * - Control de acceso por tarjeta y credenciales
 * - Gestión de torniquetes físicos
 * - Conteo de personas en tiempo real
 * - Gestión de aforo con alertas
 * - Sistema de emergencias
 * 
 * Nota: Este módulo está exclusivamente dirigido a gimnasios y centros fitness 
 * con sistemas de control de acceso físicos.
 */
export const ControlAccesoAforoTiempoRealPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('aforo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Shield size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Control de Acceso & Aforo
                </h1>
                <p className="text-gray-600">
                  Sistema completo de control de acceso y gestión de aforo en tiempo real para gimnasios. 
                  Controle el acceso por tarjeta, gestione torniquetes físicos, monitoree el aforo 
                  y reciba alertas automáticas cuando se alcancen los límites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              <button
                onClick={() => setTabActiva('aforo')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'aforo'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Users size={18} className={tabActiva === 'aforo' ? 'opacity-100' : 'opacity-70'} />
                <span>Aforo en Tiempo Real</span>
              </button>
              
              <button
                onClick={() => setTabActiva('acceso')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'acceso'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Shield size={18} className={tabActiva === 'acceso' ? 'opacity-100' : 'opacity-70'} />
                <span>Control de Acceso</span>
              </button>
              
              <button
                onClick={() => setTabActiva('torniquetes')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'torniquetes'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <ArrowRightLeft size={18} className={tabActiva === 'torniquetes' ? 'opacity-100' : 'opacity-70'} />
                <span>Torniquetes</span>
              </button>
              
              <button
                onClick={() => setTabActiva('contador')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'contador'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <UserCheck size={18} className={tabActiva === 'contador' ? 'opacity-100' : 'opacity-70'} />
                <span>Contador de Personas</span>
              </button>
              
              <button
                onClick={() => setTabActiva('alertas')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === 'alertas'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Bell size={18} className={tabActiva === 'alertas' ? 'opacity-100' : 'opacity-70'} />
                <span>Alertas</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Contenido de la sección activa */}
        <div className="mt-6">
          {tabActiva === 'aforo' && <AforoTiempoReal />}
          {tabActiva === 'acceso' && <ControlAcceso />}
          {tabActiva === 'torniquetes' && <Torniquetes />}
          {tabActiva === 'contador' && <ContadorPersonas />}
          {tabActiva === 'alertas' && <AlertasAforo />}
        </div>
      </div>
    </div>
  );
};

export default ControlAccesoAforoTiempoRealPage;

