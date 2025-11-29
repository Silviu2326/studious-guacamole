import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, MetricCards } from '../../../components/componentsreutilizables';
import { 
  TurnosStaff, 
  CuadrantesPersonal, 
  GestorVacaciones, 
  AsignacionTurnos, 
  ControlHorarios 
} from '../components';
import { 
  Clock, 
  Users, 
  Calendar, 
  Plane, 
  UserCheck,
  AlertTriangle,
  Package
} from 'lucide-react';

export default function TurnosHorariosDelStaffPage() {
  const { user } = useAuth();
  const [tabActiva, setTabActiva] = useState<string>('turnos');

  // Verificar que solo gimnasios pueden acceder
  if (user?.role === 'entrenador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600">Este módulo está disponible solo para gimnasios.</p>
          </Card>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'turnos',
      label: 'Turnos',
      icon: <Clock size={18} className="opacity-70" />,
    },
    {
      id: 'cuadrantes',
      label: 'Cuadrantes',
      icon: <Calendar size={18} className="opacity-70" />,
    },
    {
      id: 'vacaciones',
      label: 'Vacaciones',
      icon: <Plane size={18} className="opacity-70" />,
    },
    {
      id: 'asignacion',
      label: 'Asignación',
      icon: <UserCheck size={18} className="opacity-70" />,
    },
    {
      id: 'control',
      label: 'Control Horarios',
      icon: <Clock size={18} className="opacity-70" />,
    },
  ];

  const metricas = [
    {
      id: 'total-personal',
      title: 'Personal Activo',
      value: '12',
      subtitle: 'Miembros del equipo',
      icon: <Users size={20} />,
      color: 'primary' as const,
    },
    {
      id: 'turnos-hoy',
      title: 'Turnos Hoy',
      value: '8',
      subtitle: 'Turnos asignados',
      icon: <Clock size={20} />,
      color: 'info' as const,
    },
    {
      id: 'vacaciones-pendientes',
      title: 'Vacaciones Pendientes',
      value: '3',
      subtitle: 'Solicitudes por revisar',
      icon: <Plane size={20} />,
      color: 'warning' as const,
    },
    {
      id: 'incidencias-hoy',
      title: 'Incidencias Hoy',
      value: '2',
      subtitle: 'Requieren atención',
      icon: <AlertTriangle size={20} />,
      color: 'danger' as const,
    },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'turnos':
        return <TurnosStaff />;
      case 'cuadrantes':
        return <CuadrantesPersonal />;
      case 'vacaciones':
        return <GestorVacaciones />;
      case 'asignacion':
        return <AsignacionTurnos />;
      case 'control':
        return <ControlHorarios />;
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
                  Turnos & Horarios del Staff
                </h1>
                <p className="text-gray-600">
                  Gestiona los turnos, horarios, cuadrantes, vacaciones y control de horarios del personal del gimnasio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          <MetricCards data={metricas} columns={4} />

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
                    {React.cloneElement(tab.icon, {
                      className: tabActiva === tab.id ? 'opacity-100' : 'opacity-70'
                    })}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 px-4 pb-4">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


