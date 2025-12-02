import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  PortalCliente,
  Autoservicio,
  GestorPerfil,
  HistorialPagos,
  CambioTarjeta,
  PausarCuota,
  DescargarFacturas
} from '../components';
import { User, CreditCard, History, Pause, Download, Settings } from 'lucide-react';

/**
 * Página principal del Portal del Cliente / Autoservicio
 * 
 * Sistema universal de autoservicio para clientes de entrenadores y gimnasios.
 * Funcionalidades principales:
 * - Gestión de perfil personal
 * - Historial completo de pagos
 * - Cambio de tarjeta de pago
 * - Pausar cuota temporalmente
 * - Descarga de facturas
 */
export default function PortalDelClienteAutoservicioPage() {
  const [vistaActual, setVistaActual] = useState<string>('dashboard');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string | null>(null);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: User
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: Settings
    },
    {
      id: 'historial',
      label: 'Historial de Pagos',
      icon: History
    },
    {
      id: 'tarjeta',
      label: 'Tarjeta',
      icon: CreditCard
    },
    {
      id: 'pausar',
      label: 'Pausar Cuota',
      icon: Pause
    },
    {
      id: 'facturas',
      label: 'Facturas',
      icon: Download
    }
  ];

  const handleSeleccionarServicio = (servicio: string) => {
    setServicioSeleccionado(servicio);
    setVistaActual(servicio);
  };

  const renderContenido = () => {
    switch (vistaActual) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <PortalCliente onSeleccionarServicio={handleSeleccionarServicio} />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Servicios Disponibles
              </h3>
              <Autoservicio onSeleccionarServicio={handleSeleccionarServicio} />
            </div>
          </div>
        );
      case 'perfil':
        return <GestorPerfil />;
      case 'historial':
        return <HistorialPagos />;
      case 'tarjeta':
        return <CambioTarjeta />;
      case 'pausar':
        return <PausarCuota />;
      case 'facturas':
        return <DescargarFacturas />;
      default:
        return (
          <div className="space-y-6">
            <PortalCliente onSeleccionarServicio={handleSeleccionarServicio} />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Servicios Disponibles
              </h3>
              <Autoservicio onSeleccionarServicio={handleSeleccionarServicio} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <User size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Portal del Cliente / Autoservicio
                </h1>
                <p className="text-gray-600">
                  Gestiona tu cuenta de forma autónoma. Cambia tu tarjeta, descarga facturas, pausa tu cuota y actualiza tu perfil personal.
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
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = vistaActual === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setVistaActual(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la sección activa */}
        <div className="mt-6">
          {renderContenido()}
        </div>
      </div>
    </div>
  );
}

