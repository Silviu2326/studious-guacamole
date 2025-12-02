import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { TurnosStaff } from '../components/TurnosStaff';
import { GestorPersonal } from '../components/GestorPersonal';
import { Cuadrantes } from '../components/Cuadrantes';
import { Vacaciones } from '../components/Vacaciones';
import { Disponibilidad } from '../components/Disponibilidad';
import { 
  Clock, 
  Users, 
  Calendar, 
  Plane, 
  CheckCircle,
  UserCheck
} from 'lucide-react';

export default function DisponibilidadTurnosStaffPage() {
  const { user } = useAuth();
  const [tabActiva, setTabActiva] = useState<string>('turnos');

  // Verificar que solo gimnasios pueden acceder
  if (user?.role === 'entrenador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <p className="text-gray-600">
              Este módulo está disponible solo para gimnasios.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'turnos',
      label: 'Turnos',
      icon: <Clock size={18} />,
    },
    {
      id: 'personal',
      label: 'Personal',
      icon: <Users size={18} />,
    },
    {
      id: 'cuadrantes',
      label: 'Cuadrantes',
      icon: <Calendar size={18} />,
    },
    {
      id: 'vacaciones',
      label: 'Vacaciones',
      icon: <Plane size={18} />,
    },
    {
      id: 'disponibilidad',
      label: 'Disponibilidad',
      icon: <CheckCircle size={18} />,
    },
  ];

  const metricas = [
    {
      id: 'total-personal',
      title: 'Personal Activo',
      value: '12',
      color: 'info' as const,
    },
    {
      id: 'turnos-hoy',
      title: 'Turnos Hoy',
      value: '8',
      color: 'info' as const,
    },
    {
      id: 'vacaciones-pendientes',
      title: 'Vacaciones Pendientes',
      value: '3',
      color: 'warning' as const,
    },
    {
      id: 'personal-disponible',
      title: 'Personal Disponible',
      value: '9',
      color: 'success' as const,
    },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'turnos':
        return <TurnosStaff />;
      case 'personal':
        return <GestorPersonal />;
      case 'cuadrantes':
        return <Cuadrantes />;
      case 'vacaciones':
        return <Vacaciones />;
      case 'disponibilidad':
        return <Disponibilidad />;
      default:
        return null;
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
                <Clock size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Disponibilidad y Turnos del Personal
                </h1>
                <p className="text-gray-600">
                  Gestiona los turnos, disponibilidad y cuadrantes del personal del gimnasio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* KPIs/Métricas */}
          <MetricCards data={metricas} />

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      <span className={isActive ? 'opacity-100' : 'opacity-70'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Contenido de la Tab Activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

