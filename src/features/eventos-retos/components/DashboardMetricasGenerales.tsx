// Componente para dashboard de métricas generales de eventos

import React, { useState, useMemo } from 'react';
import { Modal, Card, Button, Badge } from '../../../components/componentsreutilizables';
import { X, TrendingUp, TrendingDown, BarChart3, DollarSign, Users, Calendar, Target, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import {
  obtenerMetricasGeneralesEventos,
  MetricasGeneralesEventos,
} from '../services/metricasEventosService';
import { Select } from '../../../components/componentsreutilizables/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardMetricasGeneralesProps {
  isOpen: boolean;
  onClose: () => void;
  entrenadorId?: string;
  onVerEvento?: (eventoId: string) => void; // Callback para ver evento específico
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

export const DashboardMetricasGenerales: React.FC<DashboardMetricasGeneralesProps> = ({
  isOpen,
  onClose,
  entrenadorId,
  onVerEvento,
}) => {
  const [periodoMeses, setPeriodoMeses] = useState<number>(12);
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'presencial' | 'virtual' | 'reto'>('todos');

  // Cargar eventos para calcular métricas adicionales
  const eventos = useMemo(() => {
    const { cargarEventos } = require('../api/events');
    let eventos = cargarEventos();
    
    if (entrenadorId) {
      eventos = eventos.filter(e => e.creadoPor === entrenadorId);
    }
    
    // Filtrar por periodo
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - periodoMeses);
    eventos = eventos.filter(e => e.fechaInicio >= fechaLimite);
    
    return eventos;
  }, [entrenadorId, periodoMeses]);

  const metricas = useMemo(() => {
    // Obtener métricas base
    let metricasBase = obtenerMetricasGeneralesEventos(entrenadorId, periodoMeses);
    
    // Aplicar filtro de tipo si está seleccionado
    let eventosFiltrados = eventos;
    if (tipoFiltro !== 'todos') {
      eventosFiltrados = eventos.filter(e => e.tipo === tipoFiltro);
      
      // Recalcular métricas con filtro aplicado
      const totalEventos = eventosFiltrados.length;
      const eventosProgramados = eventosFiltrados.filter(e => e.estado === 'programado').length;
      const eventosEnCurso = eventosFiltrados.filter(e => e.estado === 'en-curso').length;
      const eventosFinalizados = eventosFiltrados.filter(e => e.estado === 'finalizado').length;
      
      let totalParticipantes = 0;
      let totalAsistentes = 0;
      let totalIngresos = 0;
      
      eventosFiltrados.forEach(evento => {
        const participantes = evento.participantesDetalle || [];
        const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
        totalParticipantes += participantesActivos.length;
        totalAsistentes += participantesActivos.filter(p => p.asistencia).length;
        
        if (evento.precio && !evento.esGratuito) {
          totalIngresos += participantesActivos.length * evento.precio;
        }
      });
      
      metricasBase = {
        ...metricasBase,
        totalEventos,
        eventosProgramados,
        eventosEnCurso,
        eventosFinalizados,
        totalParticipantes,
        promedioAsistencia: totalParticipantes > 0 
          ? Math.round((totalAsistentes / totalParticipantes) * 100 * 10) / 10 
          : 0,
        totalIngresos: Math.round(totalIngresos * 100) / 100,
      };
    }
    
    // Calcular eventos gratuitos vs de pago
    const eventosGratuitos = eventosFiltrados.filter(e => e.esGratuito).length;
    const eventosDePago = eventosFiltrados.filter(e => !e.esGratuito && e.precio && e.precio > 0).length;
    
    return {
      ...metricasBase,
      eventosGratuitos,
      eventosDePago,
    };
  }, [entrenadorId, periodoMeses, tipoFiltro, eventos]);

  const getTipoEventoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      presencial: 'Presencial',
      virtual: 'Virtual',
      reto: 'Reto',
    };
    return labels[tipo] || tipo;
  };

  const getTipoEventoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      presencial: 'bg-blue-100 text-blue-800',
      virtual: 'bg-purple-100 text-purple-800',
      reto: 'bg-orange-100 text-orange-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const renderTendencia = (valor: number) => {
    if (valor > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{Math.abs(valor)}%</span>
        </div>
      );
    } else if (valor < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDown className="w-4 h-4" />
          <span className="text-sm font-medium">{valor}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-600">
          <Minus className="w-4 h-4" />
          <span className="text-sm font-medium">0%</span>
        </div>
      );
    }
  };

  const renderTendenciaTexto = (tendencia: 'aumentando' | 'disminuyendo' | 'estable') => {
    if (tendencia === 'aumentando') {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">Aumentando</span>
        </div>
      );
    } else if (tendencia === 'disminuyendo') {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm">Disminuyendo</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-600">
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm">Estable</span>
        </div>
      );
    }
  };

  // Datos para gráfico de tendencia mensual
  const datosTendenciaMensual = useMemo(() => {
    return metricas.tendenciaMensual.map(t => ({
      mes: t.mes.split(' ')[0], // Solo el nombre del mes
      eventos: t.totalEventos,
      participantes: t.totalParticipantes,
      asistentes: t.totalAsistentes,
      ingresos: t.totalIngresos,
      tasaAsistencia: t.tasaAsistencia,
    }));
  }, [metricas.tendenciaMensual]);

  // Datos para gráfico de eventos por tipo
  const datosEventosPorTipo = useMemo(() => {
    return [
      { name: 'Presencial', value: metricas.eventosPorTipo.presencial },
      { name: 'Virtual', value: metricas.eventosPorTipo.virtual },
      { name: 'Reto', value: metricas.eventosPorTipo.reto },
    ].filter(d => d.value > 0);
  }, [metricas.eventosPorTipo]);

  // Datos para gráfico de ingresos por tipo
  const datosIngresosPorTipo = useMemo(() => {
    return [
      { name: 'Presencial', ingresos: metricas.ingresosPorTipo.presencial },
      { name: 'Virtual', ingresos: metricas.ingresosPorTipo.virtual },
      { name: 'Reto', ingresos: metricas.ingresosPorTipo.reto },
    ].filter(d => d.ingresos > 0);
  }, [metricas.ingresosPorTipo]);

  // Datos para gráfico de ingresos por mes
  const datosIngresosPorMes = useMemo(() => {
    return metricas.ingresosPorMes.map(i => ({
      mes: i.mes.split(' ')[0],
      ingresos: i.ingresos,
      eventos: i.eventos,
    }));
  }, [metricas.ingresosPorMes]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      {/* NOTA: Primera capa de responsive - Grids se adaptan a una columna en pantallas pequeñas,
           sin scroll horizontal. Se puede mejorar más adelante con mejor UX móvil. */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Métricas Generales de Eventos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Dashboard con KPIs principales y análisis de rendimiento
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value as any)}
              className="w-full sm:w-40"
            >
              <option value="todos">Todos los tipos</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="reto">Reto</option>
            </Select>
            <Select
              value={periodoMeses.toString()}
              onChange={(e) => setPeriodoMeses(Number(e.target.value))}
              className="w-full sm:w-32"
            >
              <option value="6">6 meses</option>
              <option value="12">12 meses</option>
              <option value="24">24 meses</option>
            </Select>
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* KPIs principales - Responsive: una columna en móvil, 4 columnas en pantallas grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metricas.eventosProgramados !== undefined && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <p className="text-sm text-gray-500">Eventos Programados</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metricas.eventosProgramados}</p>
              <p className="text-xs text-gray-500 mt-1">
                {metricas.eventosEnCurso || 0} en curso
              </p>
            </Card>
          )}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-500">Total Eventos</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metricas.totalEventos}</p>
            <div className="flex items-center gap-2 mt-2">
              {renderTendencia(metricas.comparativaPeriodo.variacion.totalEventos)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metricas.eventosFinalizados} finalizados
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-500">Total Participantes</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metricas.totalParticipantes}</p>
            <div className="flex items-center gap-2 mt-2">
              {renderTendencia(metricas.comparativaPeriodo.variacion.totalParticipantes)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metricas.promedioParticipantesPorEvento} por evento
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-500">Promedio Asistencia</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metricas.promedioAsistencia}%</p>
            <div className="flex items-center gap-2 mt-2">
              {renderTendenciaTexto(metricas.comparativaPeriodo.tendencia.promedioAsistencia)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tasa de asistencia promedio
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-gray-500">Total Ingresos</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${metricas.totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {renderTendencia(metricas.comparativaPeriodo.variacion.totalIngresos)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ${metricas.promedioIngresosPorEvento.toLocaleString('es-ES')} por evento
            </p>
          </Card>
        </div>

        {/* Comparativa con periodo anterior - Responsive: una columna en móvil */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparativa con Periodo Anterior
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Total Eventos</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  {metricas.comparativaPeriodo.periodoActual.totalEventos}
                </p>
                {renderTendencia(metricas.comparativaPeriodo.variacion.totalEventos)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Anterior: {metricas.comparativaPeriodo.periodoAnterior.totalEventos}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Participantes</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  {metricas.comparativaPeriodo.periodoActual.totalParticipantes}
                </p>
                {renderTendencia(metricas.comparativaPeriodo.variacion.totalParticipantes)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Anterior: {metricas.comparativaPeriodo.periodoAnterior.totalParticipantes}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Asistencia</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  {metricas.comparativaPeriodo.periodoActual.promedioAsistencia}%
                </p>
                {renderTendenciaTexto(metricas.comparativaPeriodo.tendencia.promedioAsistencia)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Anterior: {metricas.comparativaPeriodo.periodoAnterior.promedioAsistencia}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Ingresos</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  ${metricas.comparativaPeriodo.periodoActual.totalIngresos.toLocaleString('es-ES')}
                </p>
                {renderTendencia(metricas.comparativaPeriodo.variacion.totalIngresos)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Anterior: ${metricas.comparativaPeriodo.periodoAnterior.totalIngresos.toLocaleString('es-ES')}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Finalizados</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  {metricas.comparativaPeriodo.periodoActual.eventosFinalizados}
                </p>
                {renderTendencia(metricas.comparativaPeriodo.variacion.eventosFinalizados)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Anterior: {metricas.comparativaPeriodo.periodoAnterior.eventosFinalizados}
              </p>
            </div>
          </div>
        </Card>

        {/* Gráficos - Responsive: una columna en móvil, 2 columnas en pantallas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tendencia Mensual - Eventos y Participantes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosTendenciaMensual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="eventos" fill="#3B82F6" name="Eventos" />
                <Bar dataKey="participantes" fill="#10B981" name="Participantes" />
                <Bar dataKey="asistentes" fill="#F59E0B" name="Asistentes" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Eventos por Tipo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosEventosPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosEventosPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Tipo más popular:</p>
              <Badge className={getTipoEventoColor(metricas.tipoEventoMasPopular)}>
                {getTipoEventoLabel(metricas.tipoEventoMasPopular)}
              </Badge>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ingresos por Tipo de Evento
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosIngresosPorTipo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-ES')}`} />
                <Legend />
                <Bar dataKey="ingresos" fill="#10B981" name="Ingresos" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ingresos por Mes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosIngresosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-ES')}`} />
                <Legend />
                <Bar dataKey="ingresos" fill="#F59E0B" name="Ingresos" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Comparación eventos gratuitos vs de pago - Responsive: una columna en móvil */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Eventos Gratuitos vs de Pago
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Eventos Gratuitos</p>
                <Badge className="bg-green-100 text-green-800">
                  {metricas.eventosGratuitos || 0}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {metricas.eventosGratuitos || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {metricas.totalEventos > 0 
                  ? Math.round(((metricas.eventosGratuitos || 0) / metricas.totalEventos) * 100) 
                  : 0}% del total
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Eventos de Pago</p>
                <Badge className="bg-blue-100 text-blue-800">
                  {metricas.eventosDePago || 0}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {metricas.eventosDePago || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {metricas.totalEventos > 0 
                  ? Math.round(((metricas.eventosDePago || 0) / metricas.totalEventos) * 100) 
                  : 0}% del total
              </p>
            </div>
          </div>
          {metricas.eventosGratuitos !== undefined && metricas.eventosDePago !== undefined && (
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Gratuitos', value: metricas.eventosGratuitos },
                      { name: 'De Pago', value: metricas.eventosDePago },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#3B82F6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Resumen por tipo de evento - Responsive: una columna en móvil, 3 columnas en pantallas grandes */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen por Tipo de Evento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['presencial', 'virtual', 'reto'] as const).map((tipo) => (
              <div key={tipo} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getTipoEventoColor(tipo)}>
                    {getTipoEventoLabel(tipo)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Eventos:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {metricas.eventosPorTipo[tipo]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Participantes:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {metricas.participantesPorTipo[tipo]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ingresos:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${metricas.ingresosPorTipo[tipo].toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Eventos recientes - Responsive: layout adaptativo en móvil */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Eventos Recientes
          </h3>
          <div className="space-y-3">
            {metricas.eventosRecientes.slice(0, 10).map((evento) => (
              <div
                key={evento.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{evento.nombre}</p>
                    <Badge className={getTipoEventoColor(evento.tipo)}>
                      {getTipoEventoLabel(evento.tipo)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(evento.fechaInicio).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                  <div className="text-left sm:text-center">
                    <p className="text-xs text-gray-500">Participantes</p>
                    <p className="text-sm font-medium text-gray-900">
                      {evento.participantes}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Asistentes</p>
                    <p className="text-sm font-medium text-gray-900">
                      {evento.asistentes}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Ingresos</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${evento.ingresos.toLocaleString('es-ES')}
                    </p>
                  </div>
                  {onVerEvento && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onVerEvento(evento.id);
                        onClose();
                      }}
                      className="ml-4"
                    >
                      Ver evento
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="primary">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

