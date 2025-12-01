/**
 * ClasificadorRiesgo.tsx
 * 
 * Componente para visualizar y ajustar la clasificación de riesgo de clientes morosos.
 * 
 * Este componente se puede abrir desde MorosidadList.tsx como un panel o modal para
 * gestionar la clasificación de riesgo de un cliente específico.
 * 
 * Funcionalidades:
 * - Muestra datos de morosidad del cliente (importe, días, nivelRiesgo actual)
 * - Calcula y muestra el nivel de riesgo automático usando calcularNivelRiesgo
 * - Permite reclasificación manual seleccionando un nuevo NivelRiesgo
 * - Muestra historial de cambios de riesgo si existe
 * - Usa indicadores visuales claros (badges con colores) para cada nivel de riesgo
 */

import React, { useState } from 'react';
import { Card, Badge, Button, Select, Modal } from '../../../components/componentsreutilizables';
import { ClienteMoroso, NivelRiesgo, HistorialMorosidad } from '../types';
import { clientesMorososAPI, calcularNivelRiesgo } from '../api/morosidad';
import { 
  Shield, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  History,
  Check,
  X
} from 'lucide-react';

interface ClasificadorRiesgoProps {
  /**
   * Cliente moroso para clasificar
   */
  cliente: ClienteMoroso;
  
  /**
   * Callback cuando se actualiza el nivel de riesgo
   */
  onRiesgoActualizado?: (cliente: ClienteMoroso) => void;
  
  /**
   * Callback para cerrar el componente (si se usa como modal)
   */
  onClose?: () => void;
  
  /**
   * Si es true, muestra el componente como modal
   */
  isModal?: boolean;
}

export const ClasificadorRiesgo: React.FC<ClasificadorRiesgoProps> = ({
  cliente: clienteInicial,
  onRiesgoActualizado,
  onClose,
  isModal = false
}) => {
  const [cliente, setCliente] = useState<ClienteMoroso>(clienteInicial);
  const [nivelRiesgoSeleccionado, setNivelRiesgoSeleccionado] = useState<NivelRiesgo>(cliente.nivelRiesgo);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  // Calcular nivel de riesgo automático
  const nivelRiesgoAutomatico = calcularNivelRiesgo(
    cliente.importeTotalAdeudado,
    cliente.diasMaximoRetraso
  );

  // Filtrar historial solo de cambios de nivel de riesgo
  const historialCambiosRiesgo = cliente.historialMorosidad?.filter(
    (historial) => historial.tipoCambio === 'nivel_riesgo'
  ) || [];

  // Verificar si el nivel actual difiere del automático
  const nivelDifiere = cliente.nivelRiesgo !== nivelRiesgoAutomatico;

  // Formatear moneda
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Obtener badge de nivel de riesgo con colores
  const obtenerBadgeNivelRiesgo = (nivel: NivelRiesgo, size: 'sm' | 'md' = 'md') => {
    const configs: Record<NivelRiesgo, { label: string; variant: 'blue' | 'yellow' | 'orange' | 'red' }> = {
      bajo: { label: 'Bajo', variant: 'blue' },
      medio: { label: 'Medio', variant: 'yellow' },
      alto: { label: 'Alto', variant: 'orange' },
      critico: { label: 'Crítico', variant: 'red' }
    };
    
    const config = configs[nivel];
    return <Badge variant={config.variant} size={size}>{config.label}</Badge>;
  };

  // Obtener icono y color para nivel de riesgo
  const obtenerIconoRiesgo = (nivel: NivelRiesgo) => {
    switch (nivel) {
      case 'bajo':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'medio':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'alto':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'critico':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  // Manejar actualización de nivel de riesgo
  const handleActualizarRiesgo = async () => {
    if (nivelRiesgoSeleccionado === cliente.nivelRiesgo) {
      return; // No hay cambios
    }

    setGuardando(true);
    setError(null);
    setExito(false);

    try {
      const clienteActualizado = await clientesMorososAPI.actualizarNivelRiesgo(
        cliente.idCliente,
        nivelRiesgoSeleccionado
      );
      
      setCliente(clienteActualizado);
      setExito(true);
      
      // Llamar callback si existe
      onRiesgoActualizado?.(clienteActualizado);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      console.error('Error al actualizar nivel de riesgo:', err);
      setError('Error al actualizar el nivel de riesgo. Por favor, intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  // Aplicar nivel automático
  const handleAplicarAutomatico = async () => {
    if (nivelRiesgoAutomatico === cliente.nivelRiesgo) {
      return; // Ya está en el nivel automático
    }

    setNivelRiesgoSeleccionado(nivelRiesgoAutomatico);
    setGuardando(true);
    setError(null);
    setExito(false);

    try {
      const clienteActualizado = await clientesMorososAPI.actualizarNivelRiesgo(
        cliente.idCliente,
        nivelRiesgoAutomatico
      );
      
      setCliente(clienteActualizado);
      setExito(true);
      
      onRiesgoActualizado?.(clienteActualizado);
      
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      console.error('Error al aplicar nivel automático:', err);
      setError('Error al aplicar el nivel automático. Por favor, intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  // Opciones para el selector de nivel de riesgo
  const opcionesNivelRiesgo = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
    { value: 'critico', label: 'Crítico' }
  ];

  const contenido = (
    <div className="space-y-6">
      {/* Información del cliente */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{cliente.nombreCliente}</h3>
              <p className="text-sm text-gray-600 mt-1">{cliente.email}</p>
              {cliente.telefono && (
                <p className="text-sm text-gray-500 mt-1">{cliente.telefono}</p>
              )}
            </div>
            {obtenerBadgeNivelRiesgo(cliente.nivelRiesgo)}
          </div>

          {/* Datos de morosidad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Importe Total Adeudado</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatearMoneda(cliente.importeTotalAdeudado)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Vencido: {formatearMoneda(cliente.importeVencido)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Días de Retraso</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {cliente.diasMaximoRetraso} días
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {cliente.numeroFacturasVencidas} factura{cliente.numeroFacturasVencidas !== 1 ? 's' : ''} vencida{cliente.numeroFacturasVencidas !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                {obtenerIconoRiesgo(cliente.nivelRiesgo)}
              </div>
              <div>
                <p className="text-sm text-gray-600">Nivel de Riesgo Actual</p>
                <div className="mt-1">
                  {obtenerBadgeNivelRiesgo(cliente.nivelRiesgo)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Clasificación de riesgo */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Clasificación de Riesgo</h3>
            {nivelDifiere && (
              <Badge variant="yellow" size="sm">
                Diferencia detectada
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            {/* Nivel automático */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Nivel Calculado Automáticamente</span>
                </div>
                {obtenerBadgeNivelRiesgo(nivelRiesgoAutomatico)}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Basado en importe de {formatearMoneda(cliente.importeTotalAdeudado)} y {cliente.diasMaximoRetraso} días de retraso
              </p>
              {nivelDifiere && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAplicarAutomatico}
                  disabled={guardando}
                  className="mt-3"
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Aplicar Nivel Automático
                </Button>
              )}
            </div>

            {/* Reclasificación manual */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reclasificación Manual
              </label>
              <div className="flex items-center gap-4">
                <Select
                  value={nivelRiesgoSeleccionado}
                  onChange={(e) => setNivelRiesgoSeleccionado(e.target.value as NivelRiesgo)}
                  options={opcionesNivelRiesgo}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  onClick={handleActualizarRiesgo}
                  disabled={guardando || nivelRiesgoSeleccionado === cliente.nivelRiesgo}
                  leftIcon={guardando ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                >
                  {guardando ? 'Guardando...' : 'Aplicar Cambio'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selecciona un nuevo nivel de riesgo y haz clic en "Aplicar Cambio" para actualizar manualmente
              </p>
            </div>

            {/* Mensajes de estado */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {exito && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-700">Nivel de riesgo actualizado correctamente</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Historial de cambios de riesgo */}
      {historialCambiosRiesgo.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Historial de Cambios de Riesgo</h3>
            </div>

            <div className="space-y-3">
              {historialCambiosRiesgo
                .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
                .slice(0, 10) // Mostrar solo los últimos 10 cambios
                .map((registro) => (
                  <div
                    key={registro.id}
                    className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">
                          {registro.fecha.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {registro.usuario && (
                          <span className="text-xs text-gray-400">por {registro.usuario}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {registro.valorAnterior && (
                        <>
                          <span className="text-sm text-gray-600">De:</span>
                          {obtenerBadgeNivelRiesgo(registro.valorAnterior as NivelRiesgo, 'sm')}
                          <TrendingDown className="w-4 h-4 text-gray-400" />
                        </>
                      )}
                      <span className="text-sm text-gray-600">A:</span>
                      {obtenerBadgeNivelRiesgo(registro.valorNuevo as NivelRiesgo, 'sm')}
                    </div>
                    {registro.notas && (
                      <p className="text-xs text-gray-500 mt-2 italic">{registro.notas}</p>
                    )}
                  </div>
                ))}
            </div>

            {historialCambiosRiesgo.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay historial de cambios de riesgo registrado
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );

  // Si es modal, envolver en Modal
  if (isModal) {
    return (
      <Modal
        isOpen={true}
        onClose={onClose || (() => {})}
        title="Clasificación de Riesgo"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        }
      >
        {contenido}
      </Modal>
    );
  }

  // Si no es modal, retornar contenido directo
  return contenido;
};
