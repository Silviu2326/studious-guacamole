import React, { useState } from 'react';
import { Card, Button, Badge, Table } from '../../../components/componentsreutilizables';
import { Sparkles, Download, Target, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Zap } from 'lucide-react';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

export const OptimizadorAdherencia: React.FC<Props> = ({ modo }) => {
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(true);

  const recomendaciones =
    modo === 'entrenador'
      ? [
          {
            id: 1,
            categoria: 'Ajuste de Volumen',
            titulo: 'Reducir intensidad para Luis García',
            descripcion: 'Baja adherencia (42%) sugiere sobrecarga. Reducir de 8 a 6 sesiones semanales.',
            impacto: 'alto',
            esfuerzo: 'bajo',
            estado: 'pendiente'
          },
          {
            id: 2,
            categoria: 'Recordatorios',
            titulo: 'Activar recordatorios automáticos',
            descripcion: 'Clientes con <60% adherencia. Configurar notificaciones 2h antes de sesión.',
            impacto: 'medio',
            esfuerzo: 'bajo',
            estado: 'pendiente'
          },
          {
            id: 3,
            categoria: 'Programación',
            titulo: 'Flexibilizar horarios',
            descripcion: 'Ana Martínez: 3 cancelaciones consecutivas. Ofrecer horarios mañana vs tarde.',
            impacto: 'alto',
            esfuerzo: 'medio',
            estado: 'pendiente'
          },
          {
            id: 4,
            categoria: 'Motivación',
            titulo: 'Implementar sistema de logros',
            descripcion: 'El 68% de clientes responden bien a gamificación. Badges y rachas.',
            impacto: 'medio',
            esfuerzo: 'medio',
            estado: 'activa'
          },
          {
            id: 5,
            categoria: 'Comunicación',
            titulo: 'Check-in semanal personalizado',
            descripcion: 'Cliente en riesgo (Elena S.): Mensaje motivacional semanal personalizado.',
            impacto: 'alto',
            esfuerzo: 'alto',
            estado: 'activa'
          },
          {
            id: 6,
            categoria: 'Objetivos',
            titulo: 'Revisar y ajustar metas',
            descripcion: 'Sofia López al 45% objetivo. Meta muy ambiciosa. Reducir en 20%.',
            impacto: 'alto',
            esfuerzo: 'bajo',
            estado: 'pendiente'
          },
        ]
      : [
          {
            id: 1,
            categoria: 'Horarios',
            titulo: 'Cambiar horario Pilates Jueves',
            descripcion: '40% ocupación a las 20:00. Mover a 19:00 (pico alto).',
            impacto: 'alto',
            esfuerzo: 'bajo',
            estado: 'pendiente'
          },
          {
            id: 2,
            categoria: 'Duplicar Clase',
            titulo: 'Duplicar Yoga Martes 19:00',
            descripcion: '96% ocupación sostenida. Abrir nueva franja 19:30 del mismo día.',
            impacto: 'alto',
            esfuerzo: 'medio',
            estado: 'pendiente'
          },
          {
            id: 3,
            categoria: 'Promoción',
            titulo: 'Promo especial HIIT Lunes',
            descripcion: '100% saturado. Crear paquete mensual específico con descuento.',
            impacto: 'medio',
            esfuerzo: 'bajo',
            estado: 'pendiente'
          },
          {
            id: 4,
            categoria: 'Nuevas Clases',
            titulo: 'Añadir Pilates Avanzado',
            descripcion: 'Demanda alta Pilates básico. Nivel avanzado viernes 18:00.',
            impacto: 'medio',
            esfuerzo: 'alto',
            estado: 'activa'
          },
          {
            id: 5,
            categoria: 'Cancelaciones',
            titulo: 'Política no-show mejorada',
            descripcion: '23 cancelaciones/sem. Implementar penalización tras 3 faltas.',
            impacto: 'alto',
            esfuerzo: 'medio',
            estado: 'activa'
          },
          {
            id: 6,
            categoria: 'Equipamiento',
            titulo: 'Ampliar capacidad TRX',
            descripcion: '100% ocupación. Añadir 4 plazas más (equipos adicionales).',
            impacto: 'alto',
            esfuerzo: 'alto',
            estado: 'pendiente'
          },
        ];

  const columnas = [
    { key: 'categoria', label: 'Categoría' },
    { key: 'titulo', label: 'Recomendación' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'impacto', label: 'Impacto' },
    { key: 'esfuerzo', label: 'Esfuerzo' },
    { key: 'estado', label: 'Estado' },
  ];

  const getImpactoBadge = (impacto: string) => {
    if (impacto === 'alto') {
      return <Badge variant="red"><AlertCircle size={14} className="mr-1" />Alto</Badge>;
    }
    if (impacto === 'medio') {
      return <Badge variant="yellow"><Target size={14} className="mr-1" />Medio</Badge>;
    }
    return <Badge variant="blue"><TrendingUp size={14} className="mr-1" />Bajo</Badge>;
  };

  const getEsfuerzoBadge = (esfuerzo: string) => {
    if (esfuerzo === 'alto') {
      return <Badge variant="orange">Alto</Badge>;
    }
    if (esfuerzo === 'medio') {
      return <Badge variant="yellow">Medio</Badge>;
    }
    return <Badge variant="green">Bajo</Badge>;
  };

  const dataFormateada = recomendaciones.map(rec => ({
    ...rec,
    impacto: getImpactoBadge(rec.impacto),
    esfuerzo: getEsfuerzoBadge(rec.esfuerzo),
    estado: rec.estado === 'pendiente' 
      ? <Badge variant="gray">Pendiente</Badge>
      : <Badge variant="green"><CheckCircle size={14} className="mr-1" />Activa</Badge>
  }));

  const resumen = {
    total: recomendaciones.length,
    activas: recomendaciones.filter(r => r.estado === 'activa').length,
    pendientes: recomendaciones.filter(r => r.estado === 'pendiente').length,
    altoImpacto: recomendaciones.filter(r => r.impacto === 'alto').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Optimizador de Adherencia</h3>
        <p className="text-sm text-gray-600 mt-2">
          {modo === 'entrenador'
            ? 'Recomendaciones inteligentes para mejorar adherencia individual basadas en datos'
            : 'Recomendaciones estratégicas para optimizar ocupación y satisfacción'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{resumen.total}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Activas</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{resumen.activas}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-gray-500">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Pendientes</span>
          </div>
          <div className="text-2xl font-bold text-gray-600">{resumen.pendientes}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Alto Impacto</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{resumen.altoImpacto}</div>
        </Card>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="primary"
              onClick={() => setMostrarRecomendaciones(!mostrarRecomendaciones)}
            >
              <Sparkles size={20} className="mr-2" />
              {mostrarRecomendaciones ? 'Ocultar' : 'Mostrar'} Recomendaciones
            </Button>
            <Button variant="secondary">
              <Download size={20} className="mr-2" />
              Exportar
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {resumen.activas} de {resumen.total} recomendaciones activas
          </div>
        </div>

        {mostrarRecomendaciones && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {recomendaciones
                .filter(r => r.impacto === 'alto')
                .slice(0, 2)
                .map(rec => (
                  <div
                    key={rec.id}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Lightbulb className="text-yellow-700" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="yellow">{rec.categoria}</Badge>
                          {getImpactoBadge(rec.impacto)}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{rec.titulo}</h4>
                        <p className="text-sm text-gray-700">{rec.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <Table columns={columnas} data={dataFormateada} />
          </>
        )}

        {!mostrarRecomendaciones && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">
              Haz clic en "Mostrar Recomendaciones" para ver el análisis completo
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};


