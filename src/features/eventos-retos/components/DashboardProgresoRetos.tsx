// Componente para dashboard de progreso de participantes en retos largos

import React, { useState, useMemo } from 'react';
import { Modal, Card, Button, Badge } from '../../../components/componentsreutilizables';
import { X, Trophy, TrendingUp, BarChart3, MessageSquare, Send, Settings, Award, Target, CheckCircle, Users, Calendar } from 'lucide-react';
import { Evento, ProgresoParticipanteReto, MetricaRetoConfig } from '../api/events';
import {
  obtenerProgresoReto,
  calcularRankingReto,
  obtenerEstadisticasReto,
  enviarMensajeMotivacion,
  configurarMetricasReto,
} from '../services/progresoRetosService';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProgresoRetosProps {
  isOpen: boolean;
  onClose: () => void;
  evento: Evento;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const DashboardProgresoRetos: React.FC<DashboardProgresoRetosProps> = ({
  isOpen,
  onClose,
  evento,
}) => {
  const [mostrarRanking, setMostrarRanking] = useState(true);
  const [mostrarMetricas, setMostrarMetricas] = useState(false);
  const [mostrarEnviarMensaje, setMostrarEnviarMensaje] = useState(false);
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState<string | undefined>(undefined);
  const [tipoMensaje, setTipoMensaje] = useState<'logro' | 'motivacion' | 'recordatorio' | 'apoyo'>('motivacion');
  const [mensajeTexto, setMensajeTexto] = useState('');
  const [canalMensaje, setCanalMensaje] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);

  const progresos = useMemo(() => obtenerProgresoReto(evento), [evento]);
  const ranking = useMemo(() => calcularRankingReto(evento), [evento]);
  const estadisticas = useMemo(() => obtenerEstadisticasReto(evento), [evento]);

  // Datos para gráfico de progreso
  const datosProgreso = useMemo(() => {
    return progresos.map((progreso, index) => {
      const participante = evento.participantesDetalle?.find(p => p.id === progreso.participanteId);
      return {
        nombre: participante?.nombre || `Participante ${index + 1}`,
        progreso: progreso.porcentajeCompletado,
        diasCompletados: progreso.diasCompletados,
        puntos: progreso.puntos || 0,
      };
    });
  }, [progresos, evento]);

  // Datos para gráfico de distribución de progreso
  const datosDistribucion = useMemo(() => {
    const categorias = [
      { name: '0-25%', value: 0, color: '#EF4444' },
      { name: '25-50%', value: 0, color: '#F59E0B' },
      { name: '50-75%', value: 0, color: '#3B82F6' },
      { name: '75-100%', value: 0, color: '#10B981' },
    ];

    progresos.forEach(progreso => {
      if (progreso.porcentajeCompletado <= 25) {
        categorias[0].value++;
      } else if (progreso.porcentajeCompletado <= 50) {
        categorias[1].value++;
      } else if (progreso.porcentajeCompletado <= 75) {
        categorias[2].value++;
      } else {
        categorias[3].value++;
      }
    });

    return categorias.filter(c => c.value > 0);
  }, [progresos]);

  const handleEnviarMensaje = async () => {
    if (!mensajeTexto.trim()) {
      return;
    }

    setEnviandoMensaje(true);
    try {
      await enviarMensajeMotivacion(
        evento,
        mensajeTexto,
        tipoMensaje,
        canalMensaje,
        participanteSeleccionado,
        'entrenador'
      );
      setMensajeTexto('');
      setParticipanteSeleccionado(undefined);
      setMostrarEnviarMensaje(false);
      alert('Mensaje enviado exitosamente');
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setEnviandoMensaje(false);
    }
  };

  const getTipoEventoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      presencial: 'Presencial',
      virtual: 'Virtual',
      reto: 'Reto',
    };
    return labels[tipo] || tipo;
  };

  const participantes = evento.participantesDetalle || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Dashboard de Progreso - {evento.nombre}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Seguimiento del progreso de participantes en reto
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-500">Total Participantes</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.totalParticipantes}</p>
            <p className="text-xs text-gray-500 mt-1">
              {estadisticas.participantesActivos} activos
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-500">Progreso Promedio</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.promedioProgreso}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {estadisticas.promedioDiasCompletados} días promedio
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-500">Completados</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{estadisticas.participantesCompletados}</p>
            <p className="text-xs text-gray-500 mt-1">
              {estadisticas.participantesEnProgreso} en progreso
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-gray-500">Duración</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{evento.duracionDias || 30} días</p>
            <p className="text-xs text-gray-500 mt-1">
              Reto en curso
            </p>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progreso por Participante
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosProgreso}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progreso" fill="#3B82F6" name="Progreso %" />
                <Bar dataKey="diasCompletados" fill="#10B981" name="Días Completados" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución de Progreso
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosDistribucion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosDistribucion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={mostrarRanking ? "primary" : "secondary"}
            onClick={() => setMostrarRanking(!mostrarRanking)}
          >
            <Trophy className="w-4 h-4 mr-2" />
            {mostrarRanking ? 'Ocultar' : 'Mostrar'} Ranking
          </Button>
          <Button
            variant={mostrarMetricas ? "primary" : "secondary"}
            onClick={() => setMostrarMetricas(!mostrarMetricas)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {mostrarMetricas ? 'Ocultar' : 'Mostrar'} Métricas
          </Button>
          <Button
            variant="primary"
            onClick={() => setMostrarEnviarMensaje(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Mensaje
          </Button>
        </div>

        {/* Ranking */}
        {mostrarRanking && evento.rankingRetoHabilitado !== false && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Ranking de Participantes
              </h3>
              <Badge className="bg-yellow-100 text-yellow-800">
                {ranking.length} participantes
              </Badge>
            </div>
            <div className="space-y-3">
              {ranking.slice(0, 10).map((progreso, index) => {
                const participante = participantes.find(p => p.id === progreso.participanteId);
                return (
                  <div
                    key={progreso.participanteId}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index < 3 ? (
                          index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {participante?.nombre || `Participante ${index + 1}`}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {progreso.diasCompletados}/{progreso.diasTotales} días
                          </span>
                          <span className="text-xs text-gray-500">
                            {progreso.puntos || 0} puntos
                          </span>
                          {progreso.logros.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {progreso.logros.length} logros
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {progreso.porcentajeCompletado}%
                        </p>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${progreso.porcentajeCompletado}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Progreso por participante */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progreso Detallado por Participante
          </h3>
          <div className="space-y-4">
            {progresos.map((progreso) => {
              const participante = participantes.find(p => p.id === progreso.participanteId);
              return (
                <div
                  key={progreso.participanteId}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {participante?.nombre || 'Participante'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {progreso.diasCompletados}/{progreso.diasTotales} días completados
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {progreso.porcentajeCompletado}%
                      </p>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-2 bg-green-600 rounded-full"
                          style={{ width: `${progreso.porcentajeCompletado}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Métricas */}
                  {progreso.metricas.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {progreso.metricas.map((metrica) => (
                        <div key={metrica.id} className="p-3 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500 mb-1">{metrica.nombre}</p>
                          <p className="text-sm font-medium text-gray-900">
                            {metrica.tipo === 'boolean' 
                              ? (metrica.valor ? 'Sí' : 'No')
                              : `${metrica.valor}${metrica.unidad || ''}`
                            }
                          </p>
                          {metrica.objetivo && (
                            <p className="text-xs text-gray-500 mt-1">
                              Objetivo: {metrica.objetivo}{metrica.unidad || ''}
                            </p>
                          )}
                          {metrica.cumplido && (
                            <Badge className="bg-green-100 text-green-800 mt-1">
                              Objetivo cumplido
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Logros */}
                  {progreso.logros.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Logros:</p>
                      <div className="flex flex-wrap gap-2">
                        {progreso.logros.map((logro) => (
                          <Badge key={logro.id} className="bg-yellow-100 text-yellow-800">
                            {logro.icono} {logro.nombre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Modal para enviar mensaje */}
        {mostrarEnviarMensaje && (
          <Modal
            isOpen={mostrarEnviarMensaje}
            onClose={() => {
              setMostrarEnviarMensaje(false);
              setMensajeTexto('');
              setParticipanteSeleccionado(undefined);
            }}
            size="medium"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enviar Mensaje de Motivación
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Mensaje
                  </label>
                  <Select
                    value={tipoMensaje}
                    onChange={(e) => setTipoMensaje(e.target.value as any)}
                  >
                    <option value="motivacion">Motivación</option>
                    <option value="logro">Felicitación por Logro</option>
                    <option value="recordatorio">Recordatorio</option>
                    <option value="apoyo">Apoyo</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinatario
                  </label>
                  <Select
                    value={participanteSeleccionado || 'todos'}
                    onChange={(e) => setParticipanteSeleccionado(e.target.value === 'todos' ? undefined : e.target.value)}
                  >
                    <option value="todos">Todos los participantes</option>
                    {participantes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canal
                  </label>
                  <Select
                    value={canalMensaje}
                    onChange={(e) => setCanalMensaje(e.target.value as any)}
                  >
                    <option value="ambos">Email y WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <Textarea
                    value={mensajeTexto}
                    onChange={(e) => setMensajeTexto(e.target.value)}
                    rows={5}
                    placeholder="Escribe tu mensaje de motivación aquí..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMostrarEnviarMensaje(false);
                      setMensajeTexto('');
                      setParticipanteSeleccionado(undefined);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleEnviarMensaje}
                    disabled={!mensajeTexto.trim() || enviandoMensaje}
                  >
                    {enviandoMensaje ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="primary">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

