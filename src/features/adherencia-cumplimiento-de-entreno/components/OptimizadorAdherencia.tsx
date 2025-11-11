import React, { useState } from 'react';
import { Card, Button, Badge, Table, Modal } from '../../../components/componentsreutilizables';
import { Sparkles, Download, Target, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Zap, Play, Loader2 } from 'lucide-react';
import { aplicarRecomendacion } from '../api/recomendaciones';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

export const OptimizadorAdherencia: React.FC<Props> = ({ modo }) => {
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(true);
  const [recomendacionAplicando, setRecomendacionAplicando] = useState<number | null>(null);
  const [modalAplicar, setModalAplicar] = useState<{ isOpen: boolean; recomendacionId: number | null }>({
    isOpen: false,
    recomendacionId: null,
  });
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const [recomendacionesState, setRecomendacionesState] = useState(
    modo === 'entrenador'
      ? [
          {
            id: 1,
            categoria: 'Ajuste de Volumen',
            titulo: 'Reducir intensidad para Luis García',
            descripcion: 'Baja adherencia (42%) sugiere sobrecarga. Reducir de 8 a 6 sesiones semanales.',
            impacto: 'alto' as const,
            esfuerzo: 'bajo' as const,
            estado: 'pendiente' as const,
            clienteId: 'luis',
            clienteNombre: 'Luis García',
            tipoAccion: 'ajustar-volumen' as const,
            datosAccion: { sesionesSemanales: 6 },
          },
          {
            id: 2,
            categoria: 'Recordatorios',
            titulo: 'Activar recordatorios automáticos',
            descripcion: 'Clientes con <60% adherencia. Configurar notificaciones 2h antes de sesión.',
            impacto: 'medio' as const,
            esfuerzo: 'bajo' as const,
            estado: 'pendiente' as const,
            tipoAccion: 'otro' as const,
          },
          {
            id: 3,
            categoria: 'Programación',
            titulo: 'Flexibilizar horarios',
            descripcion: 'Ana Martínez: 3 cancelaciones consecutivas. Ofrecer horarios mañana vs tarde.',
            impacto: 'alto' as const,
            esfuerzo: 'medio' as const,
            estado: 'pendiente' as const,
            clienteId: 'ana',
            clienteNombre: 'Ana Martínez',
            tipoAccion: 'flexibilizar-horarios' as const,
            datosAccion: { horariosAlternativos: ['09:00', '18:00'] },
          },
          {
            id: 4,
            categoria: 'Motivación',
            titulo: 'Implementar sistema de logros',
            descripcion: 'El 68% de clientes responden bien a gamificación. Badges y rachas.',
            impacto: 'medio' as const,
            esfuerzo: 'medio' as const,
            estado: 'activa' as const,
            tipoAccion: 'otro' as const,
          },
          {
            id: 5,
            categoria: 'Comunicación',
            titulo: 'Check-in semanal personalizado',
            descripcion: 'Cliente en riesgo (Elena S.): Mensaje motivacional semanal personalizado.',
            impacto: 'alto' as const,
            esfuerzo: 'alto' as const,
            estado: 'activa' as const,
            tipoAccion: 'otro' as const,
          },
          {
            id: 6,
            categoria: 'Objetivos',
            titulo: 'Revisar y ajustar metas',
            descripcion: 'Sofia López al 45% objetivo. Meta muy ambiciosa. Reducir en 20%.',
            impacto: 'alto' as const,
            esfuerzo: 'bajo' as const,
            estado: 'pendiente' as const,
            clienteId: 'sofia',
            clienteNombre: 'Sofia López',
            tipoAccion: 'cambiar-objetivos' as const,
            datosAccion: { nuevoObjetivo: 80 },
          },
        ]
      : [
          {
            id: 1,
            categoria: 'Horarios',
            titulo: 'Cambiar horario Pilates Jueves',
            descripcion: '40% ocupación a las 20:00. Mover a 19:00 (pico alto).',
            impacto: 'alto' as const,
            esfuerzo: 'bajo' as const,
            estado: 'pendiente' as const,
            tipoAccion: 'reprogramar-sesiones' as const,
          },
          {
            id: 2,
            categoria: 'Duplicar Clase',
            titulo: 'Duplicar Yoga Martes 19:00',
            descripcion: '96% ocupación sostenida. Abrir nueva franja 19:30 del mismo día.',
            impacto: 'alto' as const,
            esfuerzo: 'medio' as const,
            estado: 'pendiente' as const,
            tipoAccion: 'otro' as const,
          },
          {
            id: 3,
            categoria: 'Promoción',
            titulo: 'Promo especial HIIT Lunes',
            descripcion: '100% saturado. Crear paquete mensual específico con descuento.',
            impacto: 'medio' as const,
            esfuerzo: 'bajo' as const,
            estado: 'pendiente' as const,
            tipoAccion: 'otro' as const,
          },
          {
            id: 4,
            categoria: 'Nuevas Clases',
            titulo: 'Añadir Pilates Avanzado',
            descripcion: 'Demanda alta Pilates básico. Nivel avanzado viernes 18:00.',
            impacto: 'medio' as const,
            esfuerzo: 'alto' as const,
            estado: 'activa' as const,
            tipoAccion: 'otro' as const,
          },
          {
            id: 5,
            categoria: 'Cancelaciones',
            titulo: 'Política no-show mejorada',
            descripcion: '23 cancelaciones/sem. Implementar penalización tras 3 faltas.',
            impacto: 'alto' as const,
            esfuerzo: 'medio' as const,
            estado: 'activa' as const,
            tipoAccion: 'otro' as const,
          },
          {
            id: 6,
            categoria: 'Equipamiento',
            titulo: 'Ampliar capacidad TRX',
            descripcion: '100% ocupación. Añadir 4 plazas más (equipos adicionales).',
            impacto: 'alto' as const,
            esfuerzo: 'alto' as const,
            estado: 'pendiente' as const,
            tipoAccion: 'otro' as const,
          },
        ]
  );

  const recomendaciones = recomendacionesState;

  const handleAplicarRecomendacion = async (recomendacionId: number) => {
    setRecomendacionAplicando(recomendacionId);
    setMensajeExito(null);

    try {
      const resultado = await aplicarRecomendacion({
        recomendacionId,
        confirmacion: true,
      });

      if (resultado.exito) {
        // Actualizar el estado de la recomendación
        setRecomendacionesState(prev =>
          prev.map(rec =>
            rec.id === recomendacionId
              ? { ...rec, estado: 'aplicada' as const }
              : rec
          )
        );
        setMensajeExito(resultado.mensaje);
        setModalAplicar({ isOpen: false, recomendacionId: null });
        
        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => setMensajeExito(null), 5000);
      } else {
        alert(`Error: ${resultado.mensaje}`);
      }
    } catch (error) {
      alert('Error al aplicar la recomendación. Por favor, inténtalo de nuevo.');
    } finally {
      setRecomendacionAplicando(null);
    }
  };

  const puedeAplicar = (rec: typeof recomendaciones[0]) => {
    // Solo se pueden aplicar recomendaciones pendientes que tengan tipoAccion definido
    // y que sean aplicables (no todas las categorías son aplicables automáticamente)
    return (
      rec.estado === 'pendiente' &&
      rec.tipoAccion &&
      ['ajustar-volumen', 'reprogramar-sesiones', 'cambiar-objetivos', 'flexibilizar-horarios'].includes(rec.tipoAccion)
    );
  };

  const columnas = [
    { key: 'categoria', label: 'Categoría' },
    { key: 'titulo', label: 'Recomendación' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'impacto', label: 'Impacto' },
    { key: 'esfuerzo', label: 'Esfuerzo' },
    { key: 'estado', label: 'Estado' },
    { key: 'acciones', label: 'Acciones' },
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
      : rec.estado === 'aplicada'
      ? <Badge variant="blue"><CheckCircle size={14} className="mr-1" />Aplicada</Badge>
      : <Badge variant="green"><CheckCircle size={14} className="mr-1" />Activa</Badge>,
    acciones: puedeAplicar(rec) ? (
      <Button
        variant="primary"
        size="sm"
        onClick={() => setModalAplicar({ isOpen: true, recomendacionId: rec.id })}
        disabled={recomendacionAplicando === rec.id}
      >
        {recomendacionAplicando === rec.id ? (
          <>
            <Loader2 size={14} className="mr-1 animate-spin" />
            Aplicando...
          </>
        ) : (
          <>
            <Play size={14} className="mr-1" />
            Aplicar
          </>
        )}
      </Button>
    ) : null,
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

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle size={20} />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Modal de confirmación para aplicar recomendación */}
      <Modal
        isOpen={modalAplicar.isOpen}
        onClose={() => setModalAplicar({ isOpen: false, recomendacionId: null })}
        title="Aplicar Recomendación"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setModalAplicar({ isOpen: false, recomendacionId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (modalAplicar.recomendacionId) {
                  handleAplicarRecomendacion(modalAplicar.recomendacionId);
                }
              }}
              disabled={recomendacionAplicando !== null}
            >
              {recomendacionAplicando ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Aplicando...
                </>
              ) : (
                'Confirmar y Aplicar'
              )}
            </Button>
          </div>
        }
      >
        {modalAplicar.recomendacionId && (() => {
          const rec = recomendaciones.find(r => r.id === modalAplicar.recomendacionId);
          if (!rec) return null;
          
          return (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{rec.titulo}</h4>
                <p className="text-sm text-gray-600 mb-4">{rec.descripcion}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  Esta acción aplicará los siguientes cambios:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  {rec.tipoAccion === 'ajustar-volumen' && rec.datosAccion?.sesionesSemanales && (
                    <li>Reducir sesiones semanales a {rec.datosAccion.sesionesSemanales}</li>
                  )}
                  {rec.tipoAccion === 'cambiar-objetivos' && rec.datosAccion?.nuevoObjetivo && (
                    <li>Ajustar objetivo a {rec.datosAccion.nuevoObjetivo}%</li>
                  )}
                  {rec.tipoAccion === 'flexibilizar-horarios' && (
                    <li>Ofrecer horarios alternativos para mejorar disponibilidad</li>
                  )}
                  {rec.tipoAccion === 'reprogramar-sesiones' && (
                    <li>Reprogramar sesiones según la recomendación</li>
                  )}
                </ul>
              </div>
              
              <p className="text-sm text-gray-600">
                Los cambios se reflejarán inmediatamente en el plan de entrenamiento del cliente.
              </p>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};


