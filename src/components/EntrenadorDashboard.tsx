import { Users, Calendar, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Layout } from './Layout';

interface EntrenadorDashboardProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function EntrenadorDashboard({ activeView, onViewChange }: EntrenadorDashboardProps) {
  const { user } = useAuth();

  const stats = [
    { label: 'Clientes Activos', value: '24', icon: Users, color: 'bg-blue-500' },
    { label: 'Sesiones Hoy', value: '8', icon: Calendar, color: 'bg-green-500' },
    { label: 'Ingresos Mes', value: '$4,500', icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Horas Totales', value: '156', icon: Clock, color: 'bg-purple-500' }
  ];

  const upcomingSessions = [
    { client: 'María García', time: '09:00', type: 'Entrenamiento Funcional' },
    { client: 'Juan Pérez', time: '10:30', type: 'Pérdida de Peso' },
    { client: 'Ana Martínez', time: '12:00', type: 'Musculación' },
    { client: 'Pedro López', time: '14:00', type: 'CrossFit' }
  ];

  return (
    <Layout activeView={activeView} onViewChange={onViewChange}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido de nuevo, {user?.name}
          </h2>
          <p className="text-gray-600">Aquí está el resumen de tu actividad</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Sesiones de Hoy
            </h3>
            <div className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{session.client}</p>
                      <p className="text-sm text-gray-600">{session.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{session.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Progreso del Mes
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Sesiones Completadas</span>
                  <span className="font-semibold text-gray-900">92/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Nuevos Clientes</span>
                  <span className="font-semibold text-gray-900">5/8</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Ingresos Objetivo</span>
                  <span className="font-semibold text-gray-900">$4,500/$5,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
