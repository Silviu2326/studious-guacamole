import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { getSesionesPorCaducar, obtenerSesionesIncluidas, getSuscripcionById } from '../api/suscripciones';
import { createAlert } from '../../../features/tareas-alertas/api/alerts';
import { SesionPorCaducar, SesionIncluida, Suscripcion } from '../types';
import { AlertTriangle, Clock, Mail, Phone, User, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface AlertasSesionesPorCaducarProps {
  diasAnticipacion?: number;
  onContactarCliente?: (sesion: SesionPorCaducar) => void;
}

export const AlertasSesionesPorCaducar: React.FC<AlertasSesionesPorCaducarProps> = ({
  diasAnticipacion = 7,
  onContactarCliente,
}) => {
  const { user } = useAuth();
  const [sesionesPorCaducar, setSesionesPorCaducar] = useState<SesionPorCaducar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSesionesPorCaducar();
    
    // Verificar cada 5 minutos
    const interval = setInterval(loadSesionesPorCaducar, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [diasAnticipacion, user?.id]);

  const loadSesionesPorCaducar = async () => {
    setLoading(true);
    try {
      // Primero obtener sesiones incluidas con fechaCaducidad próxima
      const hoy = new Date();
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);
      
      // Obtener todas las sesiones incluidas
      const todasLasSesiones = await obtenerSesionesIncluidas({
        incluirCaducadas: false,
      });
      
      // Filtrar por fechaCaducidad
      const sesionesProximasACaducar = todasLasSesiones.filter(sesion => {
        const fechaCad = new Date(sesion.fechaCaducidad);
        return fechaCad >= hoy && fechaCad <= fechaLimite;
      });
      
      // Obtener información de suscripciones y crear alertas
      const alertas: SesionPorCaducar[] = [];
      for (const sesion of sesionesProximasACaducar) {
        try {
          const suscripcion = await getSuscripcionById(sesion.suscripcionId);
          const diasRestantes = Math.ceil((new Date(sesion.fechaCaducidad).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          
          const alerta: SesionPorCaducar = {
            suscripcionId: sesion.suscripcionId,
            clienteId: sesion.clienteId,
            clienteNombre: suscripcion.clienteNombre,
            clienteEmail: suscripcion.clienteEmail,
            clienteTelefono: suscripcion.clienteTelefono,
            sesionesDisponibles: sesion.totalSesiones - sesion.consumidas,
            sesionesIncluidas: sesion.totalSesiones,
            fechaVencimiento: sesion.fechaCaducidad,
            diasRestantes,
            entrenadorId: suscripcion.entrenadorId,
          };
          
          alertas.push(alerta);
          
          // Crear alerta automática
          await createAlert({
            type: 'recordatorio',
            title: `Sesiones por caducar: ${alerta.clienteNombre}`,
            message: `${alerta.clienteNombre} tiene ${alerta.sesionesDisponibles} sesiones disponibles que caducan en ${alerta.diasRestantes} día(s). Contacta al cliente para evitar que pierda sesiones pagadas.`,
            priority: alerta.diasRestantes <= 3 ? 'alta' : 'media',
            role: 'entrenador',
            actionUrl: `/suscripciones-cuotas-recurrentes?tab=alertas-sesiones`,
            relatedEntityId: alerta.suscripcionId,
            relatedEntityType: 'suscripcion',
            userId: user?.id,
          });
        } catch (error) {
          console.error(`Error procesando sesión ${sesion.id}:`, error);
        }
      }
      
      // También usar la función legacy para compatibilidad
      const dataLegacy = await getSesionesPorCaducar(user?.id, diasAnticipacion);
      
      // Combinar y eliminar duplicados
      const todasLasAlertas = [...alertas, ...dataLegacy];
      const alertasUnicas = todasLasAlertas.filter((alerta, index, self) =>
        index === self.findIndex(a => a.suscripcionId === alerta.suscripcionId)
      );
      
      setSesionesPorCaducar(alertasUnicas);
    } catch (error) {
      console.error('Error cargando sesiones por caducar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactarCliente = (sesion: SesionPorCaducar) => {
    if (onContactarCliente) {
      onContactarCliente(sesion);
    } else {
      // Acciones por defecto
      if (sesion.clienteEmail) {
        window.location.href = `mailto:${sesion.clienteEmail}?subject=Sesiones por caducar&body=Hola ${sesion.clienteNombre}, tienes ${sesion.sesionesDisponibles} sesiones disponibles que caducan el ${new Date(sesion.fechaVencimiento).toLocaleDateString('es-ES')}.`;
      }
    }
  };

  const getUrgenciaColor = (diasRestantes: number) => {
    if (diasRestantes <= 1) return 'error';
    if (diasRestantes <= 3) return 'warning';
    return 'info';
  };

  const getUrgenciaText = (diasRestantes: number) => {
    if (diasRestantes === 0) return 'Caduca hoy';
    if (diasRestantes === 1) return 'Caduca mañana';
    if (diasRestantes <= 3) return 'Urgente';
    return 'Próximo a caducar';
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando alertas...</p>
        </div>
      </Card>
    );
  }

  if (sesionesPorCaducar.length === 0) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay sesiones por caducar
          </h3>
          <p className="text-gray-600">
            No hay clientes con sesiones disponibles que caduquen en los próximos {diasAnticipacion} días.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Alertas de Sesiones por Caducar
            </h3>
            <p className="text-sm text-gray-600">
              {sesionesPorCaducar.length} cliente(s) con sesiones próximas a expirar
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={loadSesionesPorCaducar}
        >
          Actualizar
        </Button>
      </div>

      <div className="space-y-4">
        {sesionesPorCaducar.map((sesion) => (
          <div
            key={sesion.suscripcionId}
            className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {sesion.clienteNombre}
                  </h4>
                  <Badge color={getUrgenciaColor(sesion.diasRestantes)}>
                    {getUrgenciaText(sesion.diasRestantes)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      <strong>{sesion.sesionesDisponibles}</strong> de{' '}
                      <strong>{sesion.sesionesIncluidas}</strong> sesiones disponibles
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      Caducan en <strong>{sesion.diasRestantes}</strong> día(s)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Fecha: {new Date(sesion.fechaVencimiento).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {sesion.clienteEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{sesion.clienteEmail}</span>
                    </div>
                  )}
                  {sesion.clienteTelefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{sesion.clienteTelefono}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleContactarCliente(sesion)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contactar
                </Button>
                {sesion.clienteTelefono && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      window.location.href = `tel:${sesion.clienteTelefono}`;
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

