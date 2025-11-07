import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Table, TableColumn, Modal } from '../../../components/componentsreutilizables';
import { EstrategiaCobro, PagoPendiente, NivelMorosidad } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { Play, Pause, CheckCircle, Clock, Target } from 'lucide-react';

interface EstrategiasCobroProps {
  onRefresh?: () => void;
}

// Estrategias predefinidas
const estrategiasPredefinidas: EstrategiaCobro[] = [
  {
    id: 'estr1',
    nombre: 'Recordatorio Automático (Verde)',
    descripcion: 'Envío automático de recordatorios amigables para pagos con 1-7 días de retraso',
    tipo: 'recordatorio_automatico',
    nivelAplicacion: ['verde'],
    pasos: [
      {
        orden: 1,
        accion: 'Enviar email recordatorio',
        descripcion: 'Email automático amigable recordando el pago pendiente',
        tiempoEstimado: 0
      },
      {
        orden: 2,
        accion: 'Esperar respuesta',
        descripcion: 'Monitorear durante 3 días',
        tiempoEstimado: 3
      },
      {
        orden: 3,
        accion: 'Seguimiento si no hay respuesta',
        descripcion: 'Enviar segundo recordatorio o contactar',
        tiempoEstimado: 4
      }
    ],
    activa: true,
    fechaCreacion: new Date('2024-01-01')
  },
  {
    id: 'estr2',
    nombre: 'Contacto Directo (Amarillo/Naranja)',
    descripcion: 'Contacto telefónico directo para pagos con 8-30 días de retraso',
    tipo: 'contacto_directo',
    nivelAplicacion: ['amarillo', 'naranja'],
    pasos: [
      {
        orden: 1,
        accion: 'Enviar recordatorio firme',
        descripcion: 'Email o SMS con tono más serio',
        tiempoEstimado: 1
      },
      {
        orden: 2,
        accion: 'Llamada telefónica',
        descripcion: 'Contacto directo con el cliente',
        tiempoEstimado: 2
      },
      {
        orden: 3,
        accion: 'Negociación si es necesario',
        descripcion: 'Ofrecer plan de pagos si el cliente lo solicita',
        tiempoEstimado: 5
      }
    ],
    activa: true,
    fechaCreacion: new Date('2024-01-01')
  },
  {
    id: 'estr3',
    nombre: 'Gestión Especial (Rojo)',
    descripcion: 'Estrategia intensiva para pagos con más de 30 días de retraso',
    tipo: 'negociacion',
    nivelAplicacion: ['rojo'],
    pasos: [
      {
        orden: 1,
        accion: 'Reunión o llamada urgente',
        descripcion: 'Contacto inmediato para negociar',
        tiempoEstimado: 1
      },
      {
        orden: 2,
        accion: 'Evaluar situación del cliente',
        descripcion: 'Entender circunstancias y capacidad de pago',
        tiempoEstimado: 2
      },
      {
        orden: 3,
        accion: 'Proponer solución',
        descripcion: 'Plan de pagos o descuento según corresponda',
        tiempoEstimado: 3
      },
      {
        orden: 4,
        accion: 'Seguimiento estricto',
        descripcion: 'Monitoreo cercano del cumplimiento',
        tiempoEstimado: 7
      }
    ],
    activa: true,
    fechaCreacion: new Date('2024-01-01')
  },
  {
    id: 'estr4',
    nombre: 'Gestión Legal (Negro)',
    descripcion: 'Escalado a asesoría legal para casos extremos (+60 días)',
    tipo: 'legal',
    nivelAplicacion: ['negro'],
    pasos: [
      {
        orden: 1,
        accion: 'Notificación formal',
        descripcion: 'Notificación escrita de mora',
        tiempoEstimado: 1
      },
      {
        orden: 2,
        accion: 'Consulta legal',
        descripcion: 'Revisión con asesor legal',
        tiempoEstimado: 3
      },
      {
        orden: 3,
        accion: 'Acción legal si es necesario',
        descripcion: 'Procedimiento legal según recomendación',
        tiempoEstimado: 15
      }
    ],
    activa: true,
    fechaCreacion: new Date('2024-01-01')
  }
];

export const EstrategiasCobro: React.FC<EstrategiasCobroProps> = ({ onRefresh }) => {
  const [estrategias, setEstrategias] = useState<EstrategiaCobro[]>(estrategiasPredefinidas);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState<string | null>(null);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    setLoading(true);
    try {
      const pagosData = await morosidadAPI.obtenerPagosPendientes();
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerPagosPorEstrategia = (estrategia: EstrategiaCobro): PagoPendiente[] => {
    return pagos.filter(pago => 
      estrategia.nivelAplicacion.includes(pago.nivelMorosidad) &&
      estrategia.tipo === pago.estrategiaCobro
    );
  };

  const obtenerBadgeTipo = (tipo: string) => {
    const tipos: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      recordatorio_automatico: { label: 'Recordatorio Automático', variant: 'blue' },
      contacto_directo: { label: 'Contacto Directo', variant: 'yellow' },
      negociacion: { label: 'Negociación', variant: 'yellow' },
      legal: { label: 'Legal', variant: 'red' }
    };
    
    const tipoInfo = tipos[tipo] || tipos.recordatorio_automatico;
    return (
      <Badge variant={tipoInfo.variant} size="sm">
        {tipoInfo.label}
      </Badge>
    );
  };

  const columnas: TableColumn<EstrategiaCobro>[] = [
    {
      key: 'nombre',
      label: 'Estrategia',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.nombre}</div>
          <div className="text-sm text-gray-500">{row.descripcion}</div>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_, row) => obtenerBadgeTipo(row.tipo)
    },
    {
      key: 'nivelAplicacion',
      label: 'Niveles',
      render: (_, row) => (
        <div className="flex gap-1 flex-wrap">
          {row.nivelAplicacion.map(nivel => (
            <Badge key={nivel} variant={nivel === 'negro' || nivel === 'rojo' ? 'red' : nivel === 'naranja' ? 'yellow' : 'green'} size="sm">
              {nivel}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'casos',
      label: 'Casos Activos',
      render: (_, row) => {
        const casos = obtenerPagosPorEstrategia(row);
        return (
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{casos.length}</span>
          </div>
        );
      }
    },
    {
      key: 'activa',
      label: 'Estado',
      render: (_, row) => (
        <Badge variant={row.activa ? 'green' : 'gray'} size="sm">
          {row.activa ? 'Activa' : 'Inactiva'}
        </Badge>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarDetalle(row.id)}
            title="Ver detalles"
          >
            Ver Detalles
          </Button>
        </div>
      )
    }
  ];

  const estrategiaDetalle = estrategias.find(e => e.id === mostrarDetalle);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Estrategias de Cobro
          </h2>
          <p className="text-gray-600">
            Estrategias diferenciadas para gestionar cobros según nivel de morosidad
          </p>
        </div>
        <Badge variant="blue" size="md">
          {estrategias.filter(e => e.activa).length} estrategias activas
        </Badge>
      </div>

      <Table
        data={estrategias}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay estrategias configuradas"
      />

      {estrategiaDetalle && (
        <Modal
          isOpen={!!mostrarDetalle}
          onClose={() => setMostrarDetalle(null)}
          title={estrategiaDetalle.nombre}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                {estrategiaDetalle.descripcion}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Pasos de la Estrategia
              </h4>
              <div className="space-y-3">
                {estrategiaDetalle.pasos.map((paso, idx) => (
                  <Card key={idx} className="bg-white shadow-sm">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {paso.orden}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-base font-semibold text-gray-900 mb-1">
                            {paso.accion}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {paso.descripcion}
                          </p>
                          {paso.tiempoEstimado > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Tiempo estimado: {paso.tiempoEstimado} días</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Casos Aplicando esta Estrategia
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-slate-200">
                <p className="text-sm text-gray-600">
                  {obtenerPagosPorEstrategia(estrategiaDetalle).length} casos activos
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

