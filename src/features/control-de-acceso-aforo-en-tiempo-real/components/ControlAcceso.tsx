import React, { useState, useEffect } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import {
  obtenerEstadoAcceso,
  registrarEntradaSalida,
  validarCredencial,
  obtenerHistorialAcceso,
  activarModoEmergencia,
  desactivarModoEmergencia,
  cambiarEstadoTorniquete,
  type AccesoRegistro,
  type EstadoAcceso,
  type ValidacionCredencial,
} from '../api';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Wrench, 
  AlertCircle as AlertCircleIcon,
  ArrowRightLeft,
  RefreshCw 
} from 'lucide-react';

export const ControlAcceso: React.FC = () => {
  const [estadoAcceso, setEstadoAcceso] = useState<EstadoAcceso | null>(null);
  const [historial, setHistorial] = useState<AccesoRegistro[]>([]);
  const [credencial, setCredencial] = useState('');
  const [tipoCredencial, setTipoCredencial] = useState<'RFID' | 'NFC' | 'codigo_barras' | 'QR'>('RFID');
  const [validacion, setValidacion] = useState<ValidacionCredencial | null>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    cargarEstado();
    cargarHistorial();
    const interval = setInterval(cargarEstado, 5000);
    return () => clearInterval(interval);
  }, []);

  const cargarEstado = async () => {
    try {
      const estado = await obtenerEstadoAcceso();
      setEstadoAcceso(estado);
    } catch (error) {
      console.error('Error al cargar estado:', error);
    }
  };

  const cargarHistorial = async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const historialData = await obtenerHistorialAcceso(hoy);
      setHistorial(historialData.slice(0, 50));
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleValidarCredencial = async () => {
    if (!credencial.trim()) return;
    
    setLoading(true);
    setValidacion(null);
    
    try {
      const resultado = await validarCredencial(credencial, tipoCredencial);
      setValidacion(resultado);
      
      if (resultado.valida && resultado.clienteId) {
        const registro: Omit<AccesoRegistro, 'id' | 'createdAt' | 'updatedAt'> = {
          clienteId: resultado.clienteId,
          tipoCredencial,
          tipoMovimiento: 'entrada',
          estadoMembresia: resultado.membresia?.estado || 'vencida',
          resultado: resultado.membresia?.estado === 'activa' ? 'permitido' : 'denegado',
          mensaje: resultado.mensaje,
          fechaHora: new Date().toISOString(),
        };
        
        await registrarEntradaSalida(registro);
        await cargarHistorial();
      }
    } catch (error) {
      console.error('Error al validar credencial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModoEmergencia = async (activar: boolean) => {
    setLoading(true);
    try {
      if (activar) {
        await activarModoEmergencia();
      } else {
        await desactivarModoEmergencia();
      }
      await cargarEstado();
    } catch (error) {
      console.error('Error al cambiar modo emergencia:', error);
    } finally {
      setLoading(false);
    }
  };

  const columnasHistorial = [
    {
      key: 'fechaHora',
      label: 'Fecha y Hora',
      render: (value: string) => new Date(value).toLocaleString('es-ES'),
    },
    {
      key: 'tipoMovimiento',
      label: 'Movimiento',
      render: (value: string) => (
        <span className={`font-semibold ${value === 'entrada' ? 'text-green-600' : 'text-blue-600'}`}>
          {value === 'entrada' ? 'Entrada' : 'Salida'}
        </span>
      ),
    },
    {
      key: 'tipoCredencial',
      label: 'Tipo',
      render: (value: string) => value.toUpperCase(),
    },
    {
      key: 'resultado',
      label: 'Resultado',
      render: (value: string, row: AccesoRegistro) => {
        const iconos = {
          permitido: <CheckCircle className="w-5 h-5 text-green-500" />,
          denegado: <XCircle className="w-5 h-5 text-red-500" />,
          aforo_completo: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        };
        return (
          <div className="flex items-center gap-2">
            {iconos[value as keyof typeof iconos]}
            <span className="capitalize">{value.replace('_', ' ')}</span>
          </div>
        );
      },
    },
    {
      key: 'mensaje',
      label: 'Mensaje',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Estado del Sistema */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Estado del Sistema
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={cargarEstado}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>

          {estadoAcceso && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Torniquetes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadoAcceso.torniquetesActivos} / {estadoAcceso.torniquetesTotal}
                    </p>
                  </div>
                  <ArrowRightLeft className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Lectores
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadoAcceso.lectoresActivos} / {estadoAcceso.lectoresTotal}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className={`bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm ${estadoAcceso.modoEmergencia ? 'bg-red-50 ring-red-200' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Modo Emergencia
                    </p>
                    <p className={`text-2xl font-bold ${estadoAcceso.modoEmergencia ? 'text-red-600' : 'text-gray-900'}`}>
                      {estadoAcceso.modoEmergencia ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  <AlertCircleIcon className={`w-8 h-8 ${estadoAcceso.modoEmergencia ? 'text-red-600' : 'text-gray-400'}`} />
                </div>
              </div>

              <div className={`bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm ${estadoAcceso.modoMantenimiento ? 'bg-yellow-50 ring-yellow-200' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Mantenimiento
                    </p>
                    <p className={`text-2xl font-bold ${estadoAcceso.modoMantenimiento ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {estadoAcceso.modoMantenimiento ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  <Wrench className={`w-8 h-8 ${estadoAcceso.modoMantenimiento ? 'text-yellow-600' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="mt-6 flex gap-4">
            <Button
              variant="destructive"
              onClick={() => handleModoEmergencia(true)}
              disabled={loading || estadoAcceso?.modoEmergencia}
            >
              Activar Modo Emergencia
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleModoEmergencia(false)}
              disabled={loading || !estadoAcceso?.modoEmergencia}
            >
              Desactivar Modo Emergencia
            </Button>
          </div>
        </div>
      </Card>

      {/* Validación de Credencial */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Validar Credencial
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={tipoCredencial}
              onChange={(e) => setTipoCredencial(e.target.value as any)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              <option value="RFID">RFID</option>
              <option value="NFC">NFC</option>
              <option value="codigo_barras">Código de Barras</option>
              <option value="QR">QR</option>
            </select>

            <input
              type="text"
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
              placeholder="Ingrese credencial"
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleValidarCredencial()}
            />

            <Button
              onClick={handleValidarCredencial}
              disabled={loading || !credencial.trim()}
              fullWidth
            >
              {loading ? 'Validando...' : 'Validar'}
            </Button>
          </div>

          {validacion && (
            <div className={`bg-white rounded-xl ring-1 ring-slate-200 p-4 mt-4 shadow-sm ${validacion.valida ? 'bg-green-50 ring-green-200' : 'bg-red-50 ring-red-200'}`}>
              <div className="flex items-center gap-2">
                {validacion.valida ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className={`font-semibold text-sm ${validacion.valida ? 'text-green-800' : 'text-red-800'}`}>
                    {validacion.valida ? 'Credencial Válida' : 'Credencial Inválida'}
                  </p>
                  {validacion.nombre && (
                    <p className="text-sm text-gray-700 mt-1">{validacion.nombre}</p>
                  )}
                  {validacion.mensaje && (
                    <p className="text-xs text-gray-600 mt-1">{validacion.mensaje}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Historial */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Historial de Accesos
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
            >
              {mostrarHistorial ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>

          {mostrarHistorial && (
            <Table
              data={historial}
              columns={columnasHistorial}
              loading={loading}
              emptyMessage="No hay registros de acceso"
            />
          )}
        </div>
      </Card>
    </div>
  );
};

