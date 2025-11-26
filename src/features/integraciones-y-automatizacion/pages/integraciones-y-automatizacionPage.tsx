import { IntegrationGalleryContainer } from '../components';
import { MetricCards } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Plug, Network, TrendingUp, BookOpen, HelpCircle, Zap } from 'lucide-react';

/**
 * Página principal de Integraciones y Automatización
 * 
 * Esta funcionalidad está diseñada tanto para propietarios de Gimnasios 
 * como para Entrenadores Personales independientes. Permite conectar 
 * herramientas externas para automatizar operaciones, mejorar la comunicación 
 * y centralizar la gestión financiera y de agendamiento.
 * 
 * Ruta: /settings/integrations
 */
export default function IntegracionesYAutomatizacionPage() {
  // Datos mock para las métricas
  const statsData = [
    {
      id: 'integraciones-activas',
      title: 'Integraciones Activas',
      value: '3',
      subtitle: '+1 esta semana',
      trend: { value: 33, direction: 'up' as const, label: 'vs mes pasado' },
      icon: <Plug size={24} />,
      color: 'info' as const,
    },
    {
      id: 'automatizaciones',
      title: 'Automatizaciones',
      value: '12',
      subtitle: '+2 este mes',
      trend: { value: 20, direction: 'up' as const },
      icon: <Zap size={24} />,
      color: 'warning' as const,
    },
    {
      id: 'tiempo-ahorrado',
      title: 'Tiempo Ahorrado',
      value: '24h',
      subtitle: '+8h vs mes pasado',
      trend: { value: 50, direction: 'up' as const },
      icon: <TrendingUp size={24} />,
      color: 'success' as const,
    },
    {
      id: 'conectividades-fallidas',
      title: 'Estado del Sistema',
      value: '99.9%',
      subtitle: 'Uptime mensual',
      trend: { value: 0, direction: 'up' as const },
      icon: <Network size={24} />,
      color: 'success' as const,
    },
  ];

  const handleDocumentation = () => {
    window.open('https://docs.example.com/integrations', '_blank');
  };

  const handleSupport = () => {
    window.open('mailto:soporte@example.com?subject=Ayuda con Integraciones', '_blank');
  };

  const handleViewAutomations = () => {
    // Simular navegación o scroll
    const element = document.getElementById('integrations-gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Navegando a la sección de automatizaciones...');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header with Background Pattern */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 ring-4 ring-blue-50">
                  <Plug size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Integraciones y Automatización
                  </h1>
                  <p className="mt-2 text-lg text-gray-600 max-w-2xl">
                    Conecta tus herramientas favoritas y automatiza flujos de trabajo para escalar tu negocio.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100"
                  onClick={handleDocumentation}
                >
                  <BookOpen size={18} className="mr-2" />
                  Documentación
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100"
                  onClick={handleSupport}
                >
                  <HelpCircle size={18} className="mr-2" />
                  Soporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6">
            <MetricCards data={statsData} />
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-blue-600">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">
                  Potencia tu productividad
                </h3>
                <p className="text-blue-700 mt-1 max-w-3xl">
                  Las integraciones activas están ahorrando un promedio de 8 horas semanales a tu equipo. 
                  Configura nuevas automatizaciones para optimizar aún más tus procesos.
                </p>
              </div>
            </div>
            <Button 
              variant="primary" 
              className="whitespace-nowrap shadow-md"
              onClick={handleViewAutomations}
            >
              Ver Automatizaciones
            </Button>
          </div>

          {/* Integrations Gallery */}
          <div id="integrations-gallery">
            <IntegrationGalleryContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

