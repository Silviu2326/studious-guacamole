/**
 * AlertasPagos - Componente para gestión de alertas de pagos pendientes
 * 
 * Este componente se utiliza en el tab "Alertas de Pagos" del panel financiero
 * para mostrar y gestionar alertas de pagos vencidos, por vencer y recordatorios.
 * 
 * Funcionalidades principales:
 * - Visualización de alertas con prioridad visual según nivelRiesgo
 * - Ordenamiento por urgencia (vencidos primero, luego por vencer)
 * - Marcado de alertas como leídas
 * - Espacio preparado para acciones futuras (contactar cliente, etc.)
 * 
 * @remarks
 * Este componente utiliza:
 * - getAlertasPagos() para obtener la lista de alertas desde la API
 * - marcarAlertaComoLeida() para marcar alertas como leídas
 * 
 * La visualización prioriza alertas según:
 * - Nivel de riesgo del cliente/alerta (alto/medio/bajo)
 * - Tipo de alerta (vencido > por_vencer > recordatorio)
 * - Días de retraso o proximidad al vencimiento
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, TableColumn, Badge, Button } from '../../../components/componentsreutilizables';
import { 
  AlertTriangle, 
  Clock, 
  Bell, 
  DollarSign, 
  Check, 
  Eye,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAlertasPagos, marcarAlertaComoLeida, getClientesConPagosPendientes } from '../api/alertas';
import { AlertaPago, ClientePagoPendiente, NivelRiesgoPago, TipoAlertaPago } from '../types';

export const AlertasPagos: React.FC = () => {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState<AlertaPago[]>([]);
  const [pendientes, setPendientes] = useState<ClientePagoPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [marcandoLeida, setMarcandoLeida] = useState<string | null>(null);

  // Cargar alertas y clientes pendientes al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const rol = (user?.role === 'entrenador' || user?.role === 'gimnasio') 
          ? user.role 
          : 'entrenador';
        
        const [alertasData, pendientesData] = await Promise.all([
          getAlertasPagos(),
          getClientesConPagosPendientes(rol)
        ]);
        
        setAlertas(alertasData);
        setPendientes(pendientesData);
      } catch (error) {
        console.error('Error cargando alertas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user?.role]);

  /**
   * Ordena las alertas por urgencia:
   * 1. Vencidas primero (tipo 'vencido')
   * 2. Por vencer (tipo 'por_vencer' o 'porVencer')
   * 3. Recordatorios (tipo 'recordatorio')
   * 
   * Dentro de cada tipo, ordena por prioridad (alta > media > baja)
   */
  const alertasOrdenadas = useMemo(() => {
    const ordenTipo: Record<TipoAlertaPago, number> = {
      vencido: 1,
      por_vencer: 2,
      porVencer: 2,
      recordatorio: 3
    };

    const ordenPrioridad: Record<'alta' | 'media' | 'baja', number> = {
      alta: 3,
      media: 2,
      baja: 1
    };

    return [...alertas].sort((a, b) => {
      // Primero por tipo (vencidos primero)
      const tipoA = ordenTipo[a.tipo] || 99;
      const tipoB = ordenTipo[b.tipo] || 99;
      if (tipoA !== tipoB) {
        return tipoA - tipoB;
      }

      // Luego por prioridad (alta primero)
      const prioridadA = ordenPrioridad[a.prioridad] || 0;
      const prioridadB = ordenPrioridad[b.prioridad] || 0;
      if (prioridadA !== prioridadB) {
        return prioridadB - prioridadA;
      }

      // Finalmente por fecha (más antiguas primero)
      const fechaA = a.fecha || a.fechaCreacion || '';
      const fechaB = b.fecha || b.fechaCreacion || '';
      return fechaA.localeCompare(fechaB);
    });
  }, [alertas]);

  /**
   * Maneja el marcado de una alerta como leída
   */
  const handleMarcarComoLeida = async (alertaId: string) => {
    try {
      setMarcandoLeida(alertaId);
      await marcarAlertaComoLeida(alertaId);
      
      // Actualizar el estado local
      setAlertas(prevAlertas =>
        prevAlertas.map(alerta =>
          alerta.id === alertaId ? { ...alerta, leida: true } : alerta
        )
      );
    } catch (error) {
      console.error('Error marcando alerta como leída:', error);
    } finally {
      setMarcandoLeida(null);
    }
  };

  /**
   * Obtiene el icono según el tipo de alerta
   */
  const getTipoIcon = (tipo: TipoAlertaPago) => {
    switch (tipo) {
      case 'vencido':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'por_vencer':
      case 'porVencer':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'recordatorio':
        return <Bell className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  /**
   * Obtiene el badge de prioridad con color según el nivel
   */
  const getPrioridadBadge = (prioridad: 'alta' | 'media' | 'baja') => {
    const variants = {
      alta: 'red' as const,
      media: 'yellow' as const,
      baja: 'blue' as const
    };
    return (
      <Badge variant={variants[prioridad] || 'gray'}>
        {prioridad.toUpperCase()}
      </Badge>
    );
  };

  /**
   * Obtiene el badge de riesgo con color e icono según el nivel
   * La prioridad visual se basa en el nivelRiesgo del cliente/alerta
   */
  const getRiesgoBadge = (riesgo: NivelRiesgoPago) => {
    const config = {
      alto: { variant: 'red' as const, icon: <AlertTriangle className="w-3 h-3" /> },
      medio: { variant: 'yellow' as const, icon: <Clock className="w-3 h-3" /> },
      bajo: { variant: 'green' as const, icon: <Check className="w-3 h-3" /> }
    };

    const conf = config[riesgo] || config.bajo;
    return (
      <Badge variant={conf.variant} leftIcon={conf.icon}>
        {riesgo.toUpperCase()}
      </Badge>
    );
  };

  /**
   * Extrae el nombre del cliente de la alerta
   * Maneja tanto string como objeto ClientePagoPendiente
   */
  const getNombreCliente = (cliente: AlertaPago['cliente']): string => {
    if (typeof cliente === 'string') {
      return cliente;
    }
    return cliente.nombreCliente || cliente.nombre || 'Cliente desconocido';
  };

  /**
   * Extrae el nivel de riesgo de la alerta
   * Si el cliente es un objeto, usa su nivelRiesgo
   */
  const getNivelRiesgo = (alerta: AlertaPago): NivelRiesgoPago => {
    if (typeof alerta.cliente === 'object' && alerta.cliente.nivelRiesgo) {
      return alerta.cliente.nivelRiesgo;
    }
    // Si no hay nivelRiesgo, inferirlo de la prioridad
    if (alerta.prioridad === 'alta') return 'alto';
    if (alerta.prioridad === 'media') return 'medio';
    return 'bajo';
  };

  /**
   * Extrae el monto de la alerta
   */
  const getMonto = (alerta: AlertaPago): number => {
    if (typeof alerta.cliente === 'object') {
      return alerta.cliente.importePendiente || alerta.cliente.monto || 0;
    }
    return alerta.monto || 0;
  };

  /**
   * Columnas de la tabla de alertas
   */
  const alertasColumns: TableColumn<AlertaPago>[] = [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {getTipoIcon(row.tipo)}
          <span className="capitalize">
            {row.tipo === 'por_vencer' || row.tipo === 'porVencer' 
              ? 'Por Vencer' 
              : row.tipo === 'vencido'
              ? 'Vencido'
              : 'Recordatorio'}
          </span>
        </div>
      )
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (val, row) => {
        const nombre = getNombreCliente(row.cliente);
        const nivelRiesgo = getNivelRiesgo(row);
        
        return (
          <div className="flex items-center gap-2">
            <span>{nombre}</span>
            {getRiesgoBadge(nivelRiesgo)}
          </div>
        );
      }
    },
    {
      key: 'monto',
      label: 'Monto',
      align: 'right',
      render: (val, row) => {
        const monto = getMonto(row);
        return <span className="font-semibold">€{monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>;
      }
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (val, row) => {
        const fecha = row.fecha || row.fechaCreacion || '';
        if (!fecha) return '-';
        return new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (val, row) => getPrioridadBadge(row.prioridad)
    },
    {
      key: 'mensaje',
      label: 'Mensaje',
      render: (val, row) => (
        <span className="text-sm text-gray-600">{row.mensaje || '-'}</span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {!row.leida && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarcarComoLeida(row.id)}
              disabled={marcandoLeida === row.id}
              leftIcon={marcandoLeida === row.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            >
              {marcandoLeida === row.id ? 'Marcando...' : 'Marcar leída'}
            </Button>
          )}
          {row.leida && (
            <Badge variant="green" leftIcon={<Check className="w-3 h-3" />}>
              Leída
            </Badge>
          )}
          {/* Espacio preparado para acciones futuras como "Contactar Cliente" */}
          {/* TODO: Implementar funcionalidad de contacto cuando esté disponible */}
          {/* 
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Phone className="w-4 h-4" />}
            onClick={() => handleContactarCliente(row)}
          >
            Contactar
          </Button>
          */}
        </div>
      )
    }
  ];

  /**
   * Columnas de la tabla de clientes con pagos pendientes
   */
  const pendientesColumns: TableColumn<ClientePagoPendiente>[] = [
    {
      key: 'nombreCliente',
      label: 'Cliente',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span>{row.nombreCliente || row.nombre || '-'}</span>
          {getRiesgoBadge(row.nivelRiesgo)}
        </div>
      )
    },
    {
      key: 'servicio',
      label: 'Servicio',
      render: (val, row) => row.servicio || '-'
    },
    {
      key: 'importePendiente',
      label: 'Monto',
      align: 'right',
      render: (val, row) => {
        const monto = row.importePendiente || row.monto || 0;
        return <span className="font-semibold">€{monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>;
      }
    },
    {
      key: 'diasRetraso',
      label: 'Días',
      align: 'right',
      render: (val, row) => {
        const dias = row.diasRetraso || row.diasVencidos || 0;
        if (dias > 0) {
          return <span className="text-red-600 font-semibold">{dias} días vencidos</span>;
        } else if (dias < 0) {
          return <span className="text-yellow-600 font-semibold">Vence en {Math.abs(dias)} días</span>;
        }
        return <span className="text-gray-600">Vence hoy</span>;
      }
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (val, row) => {
        const fecha = row.fechaVencimiento || row.fecha || '';
        if (!fecha) return '-';
        return new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      key: 'origen',
      label: 'Origen',
      render: (val, row) => {
        const origen = row.origen || 'otro';
        const labels: Record<string, string> = {
          cuota: 'Cuota',
          sesion: 'Sesión',
          bono: 'Bono',
          otro: 'Otro'
        };
        return <Badge variant="blue">{labels[origen] || origen}</Badge>;
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {/* Espacio preparado para acciones futuras como "Contactar Cliente" */}
          {/* TODO: Implementar funcionalidad de contacto cuando esté disponible */}
          {/* 
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Phone className="w-4 h-4" />}
            onClick={() => handleContactarCliente(row.clienteId)}
          >
            Llamar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Mail className="w-4 h-4" />}
            onClick={() => handleEnviarEmail(row.clienteId)}
          >
            Email
          </Button>
          */}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sección de Alertas de Pagos */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Alertas de Pagos
              </h2>
              <p className="text-sm text-gray-600">
                Gestiona las alertas de pagos vencidos, por vencer y recordatorios
              </p>
            </div>
          </div>
          <Table
            data={alertasOrdenadas}
            columns={alertasColumns}
            loading={loading}
            emptyMessage="No hay alertas disponibles"
          />
        </div>
      </Card>

      {/* Sección de Clientes con Pagos Pendientes */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.role === 'entrenador' ? 'Quién No Ha Pagado' : 'Pagos Pendientes'}
              </h2>
              <p className="text-sm text-gray-600">
                Lista de clientes con pagos pendientes ordenados por nivel de riesgo
              </p>
            </div>
          </div>
          <Table
            data={pendientes}
            columns={pendientesColumns}
            loading={loading}
            emptyMessage="No hay pagos pendientes"
          />
        </div>
      </Card>
    </div>
  );
};

