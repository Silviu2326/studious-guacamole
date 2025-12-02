import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Client360Profile } from '../types';
import { getClientById } from '../api/clients';
import { ClientEventHistory } from '../../eventos-retos/components/ClientEventHistory';
import { HistorialPagosCliente } from '../../facturacin-cobros/components/HistorialPagosCliente';
import { HabitsPanel } from './HabitsPanel';
import { SessionSuggestions } from './SessionSuggestions';
import { HealthIntegrationsPanel } from './HealthIntegrationsPanel';
import { ChatPanel } from './ChatPanel';
import { TimelinePanel } from './TimelinePanel';
import { ReferralLinksPanel } from './ReferralLinksPanel';
import { NutritionSharingPanel } from './NutritionSharingPanel';
import { useAuth } from '../../../context/AuthContext';
import { 
  User, Calendar, FileText, TrendingUp, DollarSign, Clock, Mail, Phone, 
  Loader2, AlertCircle, Target, MessageSquare, Camera, MapPin, 
  Birthday, Activity, BarChart3, Zap, Award, Heart, Scale, 
  ArrowUpRight, ArrowDownRight, Edit, Plus, Send, Download, Dumbbell,
  CreditCard, CheckCircle, XCircle, Image as ImageIcon, Bell, TrendingDown,
  Trophy, Lightbulb, Smartphone, Clock as ClockIcon, Link2, Share2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

type TabId = 'overview' | 'workouts' | 'history' | 'payments' | 'metrics' | 'communication' | 'goals' | 'photos' | 'documents' | 'events' | 'habits' | 'suggestions' | 'health' | 'chat' | 'timeline' | 'referrals' | 'nutrition-sharing';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

interface Client360ProfileProps {
  clientId: string;
  onClose?: () => void;
}

// Datos mock para visualizaciones
const adherenceData = [
  { month: 'Ene', value: 78 },
  { month: 'Feb', value: 82 },
  { month: 'Mar', value: 85 },
  { month: 'Abr', value: 88 },
  { month: 'May', value: 85 },
  { month: 'Jun', value: 90 },
];

const workoutFrequencyData = [
  { week: 'Sem 1', sesiones: 4 },
  { week: 'Sem 2', sesiones: 5 },
  { week: 'Sem 3', sesiones: 3 },
  { week: 'Sem 4', sesiones: 6 },
];

const paymentData = [
  { month: 'Ene', pagos: 1800 },
  { month: 'Feb', pagos: 1800 },
  { month: 'Mar', pagos: 1800 },
  { month: 'Abr', pagos: 1800 },
  { month: 'May', pagos: 1800 },
  { month: 'Jun', pagos: 1800 },
];

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

export const Client360ProfileComponent: React.FC<Client360ProfileProps> = ({ clientId, onClose }) => {
  const { user } = useAuth();
  const [client, setClient] = useState<Client360Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const loadClient = async () => {
    setLoading(true);
    try {
      const data = await getClientById(clientId);
      setClient(data);
    } catch (error) {
      console.error('Error cargando perfil del cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !client) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando perfil...</p>
      </Card>
    );
  }

  const tabItems: TabItem[] = [
    { id: 'overview', label: 'Resumen', icon: User },
    { id: 'workouts', label: 'Entrenamientos', icon: Dumbbell },
    { id: 'habits', label: 'Hábitos', icon: Trophy },
    { id: 'suggestions', label: 'Sugerencias', icon: Lightbulb },
    { id: 'health', label: 'Salud', icon: Smartphone },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'history', label: 'Historial', icon: Calendar },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'metrics', label: 'Métricas', icon: TrendingUp },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'timeline', label: 'Línea de Tiempo', icon: ClockIcon },
    { id: 'communication', label: 'Comunicación', icon: MessageSquare },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'photos', label: 'Fotos', icon: Camera },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'referrals', label: 'Referidos', icon: Link2 },
    { id: 'nutrition-sharing', label: 'Nutrición Compartida', icon: Share2 },
  ];

  const getStatusBadge = () => {
    if (client.status === 'activo') return <Badge variant="green">Activo</Badge>;
    if (client.status === 'en-riesgo') return <Badge variant="yellow">En Riesgo</Badge>;
    return <Badge variant="red">Perdido</Badge>;
  };

  // Datos mock para el perfil extendido
  const mockWorkouts = [
    { id: '1', date: '2024-10-28', duration: 60, type: 'Fuerza', exercises: ['Press banca', 'Sentadillas', 'Remo'], notes: 'Excelente sesión' },
    { id: '2', date: '2024-10-25', duration: 45, type: 'Cardio', exercises: ['Correr', 'Bicicleta'], notes: 'Buena intensidad' },
    { id: '3', date: '2024-10-22', duration: 55, type: 'Fuerza', exercises: ['Press militar', 'Peso muerto'], notes: null },
  ];

  const mockPayments = [
    { id: '1', date: '2024-10-01', amount: 1800, method: 'Tarjeta', status: 'paid', invoice: 'INV-2024-001' },
    { id: '2', date: '2024-09-01', amount: 1800, method: 'Transferencia', status: 'paid', invoice: 'INV-2024-002' },
    { id: '3', date: '2024-08-01', amount: 1800, method: 'Tarjeta', status: 'paid', invoice: 'INV-2024-003' },
  ];

  const mockGoals = [
    { id: '1', title: 'Perder 5kg', target: '70kg', current: '73kg', deadline: '2024-12-31', progress: 60, status: 'on-track' },
    { id: '2', title: 'Aumentar fuerza en press banca', target: '80kg', current: '75kg', deadline: '2024-11-30', progress: 75, status: 'on-track' },
    { id: '3', title: 'Asistir 4 veces por semana', target: '4 sesiones/sem', current: '4 sesiones/sem', deadline: 'Continuo', progress: 100, status: 'achieved' },
  ];

  const mockCommunication = [
    { id: '1', date: '2024-10-28', type: 'whatsapp', message: 'Recordatorio de sesión mañana', direction: 'outbound', status: 'sent' },
    { id: '2', date: '2024-10-27', type: 'email', message: 'Resumen semanal de progreso', direction: 'outbound', status: 'sent' },
    { id: '3', date: '2024-10-26', type: 'whatsapp', message: '¿Podemos cambiar la hora?', direction: 'inbound', status: 'read' },
  ];

  const mockPhotos = [
    { id: '1', date: '2024-10-01', type: 'progress', description: 'Progreso mensual' },
    { id: '2', date: '2024-09-01', type: 'progress', description: 'Comparación inicio mes' },
    { id: '3', date: '2024-08-01', type: 'progress', description: 'Foto inicial' },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  {client.name}
                </h2>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {client.email}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Miembro desde {new Date(client.registrationDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                </span>
                {client.riskScore && (
                  <span className={`flex items-center gap-1 ${client.riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>
                    <AlertCircle className="w-3 h-3" />
                    Riesgo: {client.riskScore}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-3 -mx-6 -mb-6 bg-slate-50">
          <div
            role="tablist"
            aria-label="Secciones del perfil"
            className="flex items-center gap-2 overflow-x-auto rounded-2xl bg-slate-100 p-1"
          >
            {tabItems.map(({ id, label, icon: Icon }) => {
              const activo = activeTab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setActiveTab(id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap',
                    activo
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  ].join(' ')}
                >
                  <Icon
                    size={18}
                    className={activo ? 'opacity-100' : 'opacity-70'}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="hover" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Sesiones Totales</p>
                    <p className="text-xl font-bold text-gray-900">{client.metrics.totalSessions}</p>
                  </div>
                </div>
              </Card>
              <Card variant="hover" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Adherencia</p>
                    <p className="text-xl font-bold text-gray-900">{client.metrics.adherenceRate}%</p>
                  </div>
                </div>
              </Card>
              <Card variant="hover" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Ingresos Totales</p>
                    <p className="text-xl font-bold text-gray-900">€{client.metrics.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card variant="hover" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Check-ins</p>
                    <p className="text-xl font-bold text-gray-900">{client.metrics.totalCheckIns}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Información detallada */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Información Personal */}
              <Card variant="hover" className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Registrado: {new Date(client.registrationDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {client.lastCheckIn && (
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Último check-in: {new Date(client.lastCheckIn).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Plan y Membresía */}
              <Card variant="hover" className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Plan Activo
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900 mb-1">
                      {client.planName || 'Sin plan asignado'}
                    </p>
                    <Badge variant={client.membershipStatus === 'activa' ? 'green' : 'yellow'} className="text-xs">
                      {client.membershipStatus || 'activo'}
                    </Badge>
                  </div>
                  {client.metrics.lastPaymentDate && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Último pago: {new Date(client.metrics.lastPaymentDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                  {client.metrics.nextPaymentDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Próximo pago: {new Date(client.metrics.nextPaymentDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Estadísticas Rápidas */}
              <Card variant="hover" className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Estadísticas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sesiones este mes</span>
                    <span className="text-sm font-semibold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duración promedio</span>
                    <span className="text-sm font-semibold text-gray-900">{client.metrics.averageSessionDuration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Días desde última visita</span>
                    <span className="text-sm font-semibold text-gray-900">{client.daysSinceLastVisit || 0} días</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Estado de pago</span>
                    <Badge variant={client.paymentStatus === 'al-dia' ? 'green' : 'red'}>
                      {client.paymentStatus || 'al-dia'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Próximas sesiones */}
            <Card variant="hover" className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Próximas Sesiones
                </h3>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Agendar
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Sesión de Fuerza</p>
                    <p className="text-xs text-gray-600">Mañana, 29 Oct - 10:00 AM</p>
                  </div>
                  <Badge variant="blue">Confirmada</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Sesión de Cardio</p>
                    <p className="text-xs text-gray-600">2 Nov - 18:00 PM</p>
                  </div>
                  <Badge variant="gray">Pendiente</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB: WORKOUTS */}
        {activeTab === 'workouts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Historial de Entrenamientos</h3>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Entrenamiento
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card variant="hover" className="p-4">
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Total Sesiones</p>
                    <p className="text-lg font-bold">{mockWorkouts.length}</p>
                  </div>
                </div>
              </Card>
              <Card variant="hover" className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Tiempo Total</p>
                    <p className="text-lg font-bold">{mockWorkouts.reduce((acc, w) => acc + w.duration, 0)} min</p>
                  </div>
                </div>
              </Card>
              <Card variant="hover" className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Promedio Semanal</p>
                    <p className="text-lg font-bold">4.2 sesiones</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              {mockWorkouts.map((workout) => (
                <Card key={workout.id} variant="hover" className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="blue">{workout.type}</Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(workout.date).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-sm text-gray-500">• {workout.duration} min</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {workout.exercises.map((ex, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {ex}
                          </span>
                        ))}
                      </div>
                      {workout.notes && (
                        <p className="text-sm text-gray-600 italic">"{workout.notes}"</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB: HABITS - Panel de Hábitos con Puntos y Badges */}
        {activeTab === 'habits' && (
          <HabitsPanel clienteId={clientId} />
        )}

        {/* TAB: SUGGESTIONS - Sugerencias Automáticas de Sesiones */}
        {activeTab === 'suggestions' && (
          <SessionSuggestions 
            clienteId={clientId}
            onSuggestionAccepted={(suggestion) => {
              console.log('Sugerencia aceptada:', suggestion);
              // Aquí se podría crear la sesión automáticamente o redirigir al editor
            }}
          />
        )}

        {/* TAB: HEALTH - Integraciones de Salud */}
        {activeTab === 'health' && (
          <HealthIntegrationsPanel clientId={clientId} />
        )}

        {/* TAB: PAYMENTS */}
        {activeTab === 'payments' && (
          <HistorialPagosCliente clienteId={clientId} />
        )}

        {/* TAB: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Historial Completo</h3>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
            {client.history.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">No hay historial disponible</p>
              </div>
            ) : (
              <div className="space-y-3">
                {client.history.map((item, idx) => (
                  <Card key={item.id} variant="hover" className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {item.type === 'check-in' && <Activity className="w-5 h-5 text-blue-600" />}
                        {item.type === 'session' && <Dumbbell className="w-5 h-5 text-green-600" />}
                        {item.type === 'payment' && <CreditCard className="w-5 h-5 text-purple-600" />}
                        {item.type === 'plan-change' && <TrendingUp className="w-5 h-5 text-orange-600" />}
                        {item.type === 'note' && <FileText className="w-5 h-5 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.date).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge variant="blue">{item.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: EVENTS - Historial de Eventos del Cliente (User Story 1) */}
        {activeTab === 'events' && (
          <ClientEventHistory clientId={clientId} />
        )}

        {/* TAB: METRICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Métricas Detalladas</h3>

            {/* Gráfico de Adherencia */}
            <Card variant="hover" className="p-5">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Evolución de Adherencia</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Frecuencia de Entrenamientos */}
            <Card variant="hover" className="p-5">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Frecuencia Semanal de Entrenamientos</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workoutFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="sesiones" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Métricas de Rendimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="hover" className="p-5">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Métricas de Rendimiento</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-900">Adherencia</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.metrics.adherenceRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${client.metrics.adherenceRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-900">Sesiones Completadas</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.metrics.totalSessions}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-900">Duración Promedio</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.metrics.averageSessionDuration} min
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-900">Tasa de Éxito</span>
                      <span className="text-sm font-semibold text-green-600">92%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="hover" className="p-5">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Distribución por Tipo</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Fuerza', value: 60 },
                        { name: 'Cardio', value: 30 },
                        { name: 'Flexibilidad', value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Fuerza', value: 60 },
                        { name: 'Cardio', value: 30 },
                        { name: 'Flexibilidad', value: 10 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: CHAT - Sistema de chat con historial y archivos adjuntos */}
        {activeTab === 'chat' && (
          <ChatPanel
            clienteId={clientId}
            clienteName={client.name}
            trainerId={user?.id || 'trainer_1'}
            trainerName={user?.name || 'Entrenador'}
          />
        )}

        {/* TAB: TIMELINE - Línea de tiempo visual con fotos y mediciones */}
        {activeTab === 'timeline' && (
          <TimelinePanel clienteId={clientId} />
        )}

        {/* TAB: COMMUNICATION */}
        {activeTab === 'communication' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Comunicación</h3>
              <Button variant="primary" size="sm">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </div>

            <div className="space-y-3">
              {mockCommunication.map((comm) => (
                <Card key={comm.id} variant="hover" className="p-4">
                  <div className={`flex items-start gap-4 ${comm.direction === 'inbound' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      comm.direction === 'inbound' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {comm.type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-green-600" />}
                      {comm.type === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
                      {comm.type === 'sms' && <MessageSquare className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className={`flex-1 ${comm.direction === 'inbound' ? 'text-right' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          {new Date(comm.date).toLocaleDateString('es-ES')}
                        </span>
                        <Badge variant={comm.direction === 'inbound' ? 'blue' : 'gray'}>
                          {comm.direction === 'inbound' ? 'Recibido' : 'Enviado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-900">{comm.message}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GOALS */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Objetivos del Cliente</h3>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Objetivo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockGoals.map((goal) => (
                <Card key={goal.id} variant="hover" className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900">{goal.title}</h4>
                    {goal.status === 'achieved' && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actual:</span>
                      <span className="font-semibold text-gray-900">{goal.current}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Objetivo:</span>
                      <span className="font-semibold text-blue-600">{goal.target}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fecha límite:</span>
                      <span className="text-gray-900">{goal.deadline}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-semibold text-gray-900">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          goal.status === 'achieved' ? 'bg-green-600' :
                          goal.progress >= 50 ? 'bg-blue-600' : 'bg-yellow-600'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PHOTOS */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Fotos de Progreso</h3>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Subir Foto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPhotos.map((photo) => (
                <Card key={photo.id} variant="hover" className="p-4">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{photo.description}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(photo.date).toLocaleDateString('es-ES')}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Documentos</h3>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Subir Documento
              </Button>
            </div>
            {client.documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">No hay documentos disponibles</p>
                <Button variant="secondary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Subir Primer Documento
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.documents.map((doc) => (
                  <Card key={doc.id} variant="hover" className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {doc.type} • {new Date(doc.uploadDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: REFERRALS - Enlaces de Referido */}
        {activeTab === 'referrals' && (
          <ReferralLinksPanel
            clienteId={clientId}
            clienteName={client.name}
            onLinkCreated={(link) => {
              console.log('Enlace de referido creado:', link);
              // Aquí se podría actualizar el estado o mostrar una notificación
            }}
          />
        )}

        {/* TAB: NUTRITION-SHARING - Compartir Planes Nutricionales */}
        {activeTab === 'nutrition-sharing' && (
          <NutritionSharingPanel
            clienteId={clientId}
            clienteName={client.name}
          />
        )}
      </div>
    </Card>
  );
};
