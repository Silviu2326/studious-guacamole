import { IntegrationGalleryContainer } from '../components';
import { Card } from '../../../components/componentsreutilizables';
import { MetricCards } from '../../../components/componentsreutilizables';
import { Plug, Network, TrendingUp, AlertCircle } from 'lucide-react';

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
      icon: <Network size={24} />,
      color: 'info' as const,
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
      title: 'Conectividades Fallidas',
      value: '1',
      subtitle: 'Requiere atención',
      trend: { value: 0, direction: 'down' as const },
      icon: <AlertCircle size={24} />,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Plug size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Integraciones y Automatización
                </h1>
                <p className="text-gray-600">
                  Conecta herramientas externas para automatizar tus operaciones y mejorar la experiencia de tus clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <MetricCards data={statsData} />

          {/* Info Card */}
          <Card variant="default" padding="lg" className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Network size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Beneficios de las integraciones
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Las integraciones te permiten automatizar tareas repetitivas, sincronizar datos 
                  entre plataformas y ofrecer una experiencia fluida a tus clientes. Desde pagos 
                  automáticos hasta sincronización de calendarios, optimiza tu flujo de trabajo.
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Reduce la entrada manual de datos</li>
                  <li>Mejora la comunicación con tus clientes</li>
                  <li>Centraliza la gestión financiera</li>
                  <li>Optimiza el agendamiento de clases</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Integrations Gallery */}
          <IntegrationGalleryContainer />
        </div>
      </div>
    </div>
  );
}

