import React, { useMemo } from 'react';
import { Suscripcion } from '../types';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Phone, 
  Mail, 
  MessageCircle,
  Calendar,
  Activity
} from 'lucide-react';

interface VisualizacionUsoSesionesProps {
  suscripciones: Suscripcion[];
  onContactar?: (suscripcion: Suscripcion) => void;
}

interface ClienteUsoSesiones {
  suscripcion: Suscripcion;
  porcentajeUso: number;
  sesionesRestantes: number;
  diasRestantes: number;
  necesitaAtencion: boolean;
  nivelAlerta: 'bajo' | 'medio' | 'alto';
}

export const VisualizacionUsoSesiones: React.FC<VisualizacionUsoSesionesProps> = ({
  suscripciones,
  onContactar,
}) => {
  // Filtrar solo suscripciones PT activas
  const suscripcionesPT = suscripciones.filter(
    s => s.tipo === 'pt-mensual' && s.estado === 'activa' && s.sesionesIncluidas
  );

  // Calcular métricas de uso para cada cliente
  const clientesConUso = useMemo<ClienteUsoSesiones[]>(() => {
    const hoy = new Date();
    
    return suscripcionesPT.map(suscripcion => {
      const sesionesIncluidas = suscripcion.sesionesIncluidas || 0;
      const sesionesUsadas = suscripcion.sesionesUsadas || 0;
      const sesionesDisponibles = suscripcion.sesionesDisponibles || 0;
      
      // Calcular porcentaje de uso
      const porcentajeUso = sesionesIncluidas > 0 
        ? Math.round((sesionesUsadas / sesionesIncluidas) * 100)
        : 0;
      
      // Calcular días restantes hasta la próxima renovación
      const fechaVencimiento = new Date(suscripcion.fechaVencimiento || suscripcion.proximaRenovacion || '');
      const diasRestantes = Math.max(0, Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)));
      
      // Determinar si necesita atención
      // Alta prioridad: menos del 30% usado y quedan menos de 7 días
      // Media prioridad: menos del 50% usado y quedan menos de 14 días
      // Baja prioridad: menos del 70% usado
      let necesitaAtencion = false;
      let nivelAlerta: 'bajo' | 'medio' | 'alto' = 'bajo';
      
      if (porcentajeUso < 30 && diasRestantes < 7) {
        necesitaAtencion = true;
        nivelAlerta = 'alto';
      } else if (porcentajeUso < 50 && diasRestantes < 14) {
        necesitaAtencion = true;
        nivelAlerta = 'medio';
      } else if (porcentajeUso < 70) {
        necesitaAtencion = true;
        nivelAlerta = 'bajo';
      }
      
      return {
        suscripcion,
        porcentajeUso,
        sesionesRestantes: sesionesDisponibles,
        diasRestantes,
        necesitaAtencion,
        nivelAlerta,
      };
    });
  }, [suscripcionesPT]);

  // Ordenar por prioridad (necesita atención primero, luego por porcentaje de uso)
  const clientesOrdenados = useMemo(() => {
    return [...clientesConUso].sort((a, b) => {
      // Primero los que necesitan atención
      if (a.necesitaAtencion && !b.necesitaAtencion) return -1;
      if (!a.necesitaAtencion && b.necesitaAtencion) return 1;
      
      // Dentro de los que necesitan atención, ordenar por nivel de alerta
      if (a.necesitaAtencion && b.necesitaAtencion) {
        const nivelOrden = { alto: 3, medio: 2, bajo: 1 };
        if (nivelOrden[a.nivelAlerta] !== nivelOrden[b.nivelAlerta]) {
          return nivelOrden[b.nivelAlerta] - nivelOrden[a.nivelAlerta];
        }
      }
      
      // Luego por porcentaje de uso (menor primero)
      return a.porcentajeUso - b.porcentajeUso;
    });
  }, [clientesConUso]);

  // Estadísticas generales
  const estadisticas = useMemo(() => {
    const total = clientesConUso.length;
    const conBajoUso = clientesConUso.filter(c => c.porcentajeUso < 50).length;
    const necesitanAtencion = clientesConUso.filter(c => c.necesitaAtencion).length;
    const promedioUso = total > 0
      ? Math.round(clientesConUso.reduce((sum, c) => sum + c.porcentajeUso, 0) / total)
      : 0;
    
    return { total, conBajoUso, necesitanAtencion, promedioUso };
  }, [clientesConUso]);

  const getColorPorcentaje = (porcentaje: number) => {
    if (porcentaje >= 80) return 'text-green-600';
    if (porcentaje >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBgColorPorcentaje = (porcentaje: number) => {
    if (porcentaje >= 80) return 'bg-green-100';
    if (porcentaje >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getColorAlerta = (nivel: 'bajo' | 'medio' | 'alto') => {
    switch (nivel) {
      case 'alto': return 'error';
      case 'medio': return 'warning';
      case 'bajo': return 'info';
    }
  };

  const handleContactar = (suscripcion: Suscripcion, metodo: 'telefono' | 'email' | 'whatsapp') => {
    if (onContactar) {
      onContactar(suscripcion);
    } else {
      // Acciones por defecto
      switch (metodo) {
        case 'telefono':
          if (suscripcion.clienteTelefono) {
            window.location.href = `tel:${suscripcion.clienteTelefono}`;
          }
          break;
        case 'email':
          window.location.href = `mailto:${suscripcion.clienteEmail}`;
          break;
        case 'whatsapp':
          if (suscripcion.clienteTelefono) {
            window.open(`https://wa.me/${suscripcion.clienteTelefono.replace(/[^0-9]/g, '')}`, '_blank');
          }
          break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Promedio de Uso</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.promedioUso}%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Con Bajo Uso</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.conBajoUso}</p>
              <p className="text-xs text-gray-500">&lt; 50% usado</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Necesitan Atención</p>
              <p className="text-2xl font-bold text-orange-600">{estadisticas.necesitanAtencion}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Lista de clientes con visualización de uso */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Uso de Sesiones por Cliente
            </h3>
            <p className="text-sm text-gray-600">
              Visualiza el uso de sesiones de cada cliente y contacta proactivamente a quienes no están aprovechando su paquete
            </p>
          </div>
        </div>

        {clientesOrdenados.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay suscripciones PT activas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientesOrdenados.map((cliente) => {
              const { suscripcion, porcentajeUso, sesionesRestantes, diasRestantes, necesitaAtencion, nivelAlerta } = cliente;
              const sesionesIncluidas = suscripcion.sesionesIncluidas || 0;
              const sesionesUsadas = suscripcion.sesionesUsadas || 0;

              return (
                <div
                  key={suscripcion.id}
                  className={`border rounded-lg p-4 transition-all ${
                    necesitaAtencion
                      ? nivelAlerta === 'alto'
                        ? 'border-red-300 bg-red-50/50'
                        : nivelAlerta === 'medio'
                        ? 'border-orange-300 bg-orange-50/50'
                        : 'border-yellow-300 bg-yellow-50/50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {suscripcion.clienteNombre}
                        </h4>
                        {necesitaAtencion && (
                          <Badge color={getColorAlerta(nivelAlerta)}>
                            {nivelAlerta === 'alto' ? 'Alta Prioridad' : nivelAlerta === 'medio' ? 'Atención' : 'Revisar'}
                          </Badge>
                        )}
                        {!necesitaAtencion && porcentajeUso >= 80 && (
                          <Badge color="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Buen uso
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{suscripcion.planNombre}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {diasRestantes} días restantes
                        </span>
                      </div>
                    </div>
                    
                    {/* Botones de contacto */}
                    <div className="flex items-center gap-2">
                      {suscripcion.clienteTelefono && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleContactar(suscripcion, 'telefono')}
                          title="Llamar"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleContactar(suscripcion, 'email')}
                        title="Enviar email"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      {suscripcion.clienteTelefono && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleContactar(suscripcion, 'whatsapp')}
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Barra de progreso visual */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                          Sesiones usadas: <span className="font-bold">{sesionesUsadas}</span> / {sesionesIncluidas}
                        </span>
                        <span className={`text-sm font-semibold ${getColorPorcentaje(porcentajeUso)}`}>
                          {porcentajeUso}%
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {sesionesRestantes} disponibles
                      </span>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${getBgColorPorcentaje(porcentajeUso)}`}
                        style={{ width: `${Math.min(100, porcentajeUso)}%` }}
                      >
                        <div className="h-full flex items-center justify-end pr-2">
                          {porcentajeUso > 15 && (
                            <span className="text-xs font-semibold text-gray-700">
                              {porcentajeUso}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de alerta si necesita atención */}
                  {necesitaAtencion && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      nivelAlerta === 'alto'
                        ? 'bg-red-100 border border-red-200'
                        : nivelAlerta === 'medio'
                        ? 'bg-orange-100 border border-orange-200'
                        : 'bg-yellow-100 border border-yellow-200'
                    }`}>
                      <p className="text-sm font-medium text-gray-800">
                        {nivelAlerta === 'alto' && '⚠️ Alta prioridad: '}
                        {nivelAlerta === 'medio' && '⚠️ Atención: '}
                        {nivelAlerta === 'bajo' && '💡 Revisar: '}
                        {porcentajeUso < 30 && diasRestantes < 7
                          ? `Solo ha usado el ${porcentajeUso}% de sus sesiones y quedan ${diasRestantes} días. Contacta urgentemente.`
                          : porcentajeUso < 50 && diasRestantes < 14
                          ? `Ha usado solo el ${porcentajeUso}% de sus sesiones. Quedan ${diasRestantes} días.`
                          : `Ha usado solo el ${porcentajeUso}% de sus sesiones. Considera contactar para motivar el uso.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

