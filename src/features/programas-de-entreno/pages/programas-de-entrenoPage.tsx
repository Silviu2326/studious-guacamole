import { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables/Card';
import { MetricCards } from '../../../components/componentsreutilizables/MetricCards';
import {
  List,
  User,
  Users,
  Layout,
  FileEdit,
  TrendingUp,
  Copy,
  FolderTree,
  Dumbbell,
} from 'lucide-react';
import {
  ProgramasList,
  AsignacionCliente,
  ProgramasGrupo,
  PlanSala,
  EditorPrograma,
  SeguimientoPrograma,
  DuplicadorPrograma,
  CategorizadorProgramas,
} from '../components';

export default function ProgramasDeEntrenoPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('lista');

  // Configuración de pestañas según el rol
  const tabs = useMemo(() => {
    if (isEntrenador) {
      return [
        {
          id: 'lista',
          label: 'Mis Programas',
          icon: <List size={18} />,
        },
        {
          id: 'asignar',
          label: 'Asignar a Cliente',
          icon: <User size={18} />,
        },
        {
          id: 'editor',
          label: 'Editor',
          icon: <FileEdit size={18} />,
        },
        {
          id: 'seguimiento',
          label: 'Seguimiento',
          icon: <TrendingUp size={18} />,
        },
        {
          id: 'duplicar',
          label: 'Duplicar',
          icon: <Copy size={18} />,
        },
        {
          id: 'categorias',
          label: 'Categorías',
          icon: <FolderTree size={18} />,
        },
      ];
    } else {
      return [
        {
          id: 'lista',
          label: 'Programas',
          icon: <List size={18} />,
        },
        {
          id: 'grupos',
          label: 'Programas Grupales',
          icon: <Users size={18} />,
        },
        {
          id: 'planes-sala',
          label: 'Planes de Sala',
          icon: <Layout size={18} />,
        },
        {
          id: 'editor',
          label: 'Editor',
          icon: <FileEdit size={18} />,
        },
        {
          id: 'seguimiento',
          label: 'Seguimiento',
          icon: <TrendingUp size={18} />,
        },
        {
          id: 'duplicar',
          label: 'Duplicar',
          icon: <Copy size={18} />,
        },
        {
          id: 'categorias',
          label: 'Categorías',
          icon: <FolderTree size={18} />,
        },
      ];
    }
  }, [isEntrenador]);

  const metricas = useMemo(
    () => [
      {
        title: 'Programas Activos',
        value: '0',
        icon: <List className="w-5 h-5" />,
        trend: 'up' as const,
        trendValue: '+0%',
        color: 'blue' as const,
      },
      {
        title: isEntrenador ? 'Asignados a Clientes' : 'Asignaciones Grupales',
        value: '0',
        icon: isEntrenador ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />,
        trend: 'neutral' as const,
        trendValue: '0%',
        color: 'green' as const,
      },
      {
        title: 'En Seguimiento',
        value: '0',
        icon: <TrendingUp className="w-5 h-5" />,
        trend: 'up' as const,
        trendValue: '+0%',
        color: 'purple' as const,
      },
      {
        title: 'Categorías',
        value: '0',
        icon: <FolderTree className="w-5 h-5" />,
        trend: 'neutral' as const,
        trendValue: '0%',
        color: 'orange' as const,
      },
    ],
    [isEntrenador]
  );

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'lista':
        return <ProgramasList />;
      case 'asignar':
        return isEntrenador ? <AsignacionCliente /> : <ProgramasGrupo />;
      case 'grupos':
        return !isEntrenador ? <ProgramasGrupo /> : null;
      case 'planes-sala':
        return !isEntrenador ? <PlanSala /> : null;
      case 'editor':
        return <EditorPrograma />;
      case 'seguimiento':
        return <SeguimientoPrograma />;
      case 'duplicar':
        return <DuplicadorPrograma />;
      case 'categorias':
        return <CategorizadorProgramas />;
      default:
        return <ProgramasList />;
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
                <Dumbbell size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Programas de Entrenamiento
                </h1>
                <p className="text-gray-600">
                  {isEntrenador
                    ? 'Gestiona programas personalizados para tus clientes. Crea rutinas específicas como "Rutina de fuerza para Carla" o "Rehab rodilla Miguel".'
                    : 'Gestiona programas generales, clases estructuradas del box y planes de sala accesibles para socios.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas principales */}
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
                      aria-selected={isActive}
                      role="tab"
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

          {/* Contenido de la pestaña activa */}
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

