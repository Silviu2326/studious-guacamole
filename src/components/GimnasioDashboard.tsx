import { Users, Calendar, TrendingUp, DollarSign, MapPin, UserCheck, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Layout } from './Layout';

interface GimnasioDashboardProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function GimnasioDashboard({ activeView, onViewChange }: GimnasioDashboardProps) {
  const { user } = useAuth();

  const stats = [
    { label: 'Entrenadores Activos', value: '12', icon: UserCheck, color: 'bg-blue-500' },
    { label: 'Miembros Totales', value: '340', icon: Users, color: 'bg-green-500' },
    { label: 'Ingresos Mes', value: '$28,500', icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Ocupación Hoy', value: '78%', icon: Activity, color: 'bg-purple-500' }
  ];

  const entrenadores = [
    { name: 'Carlos Rodríguez', clients: 24, rating: 4.8, specialty: 'Funcional' },
    { name: 'Laura Martínez', clients: 18, rating: 4.9, specialty: 'Yoga' },
    { name: 'Miguel Sánchez', clients: 21, rating: 4.7, specialty: 'CrossFit' },
    { name: 'Sofia Torres', clients: 16, rating: 4.9, specialty: 'Pilates' }
  ];

  return (
    <Layout activeView={activeView} onViewChange={onViewChange}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-gray-600">Resumen general del gimnasio</p>
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
              <UserCheck className="w-5 h-5 text-purple-600" />
              Entrenadores del Gimnasio
            </h3>
            <div className="space-y-3">
              {entrenadores.map((trainer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{trainer.name}</p>
                      <p className="text-sm text-gray-600">{trainer.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{trainer.clients} clientes</p>
                    <p className="text-sm text-yellow-600">★ {trainer.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Métricas del Mes
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Retención de Miembros</span>
                  <span className="font-semibold text-gray-900">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Capacidad Promedio</span>
                  <span className="font-semibold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Objetivo de Ingresos</span>
                  <span className="font-semibold text-gray-900">$28,500/$30,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Satisfacción General</span>
                  <span className="font-semibold text-gray-900">4.7/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
