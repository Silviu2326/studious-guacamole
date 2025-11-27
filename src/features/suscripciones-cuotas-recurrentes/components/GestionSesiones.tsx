import React, { useState, useEffect } from 'react';
import { Suscripcion, SesionIncluida } from '../types';
import { Card, Button, Modal, Input, Badge } from '../../../components/componentsreutilizables';
import { 
  modificarSesiones, 
  añadirBonusSesiones,
  obtenerSesionesIncluidas,
  registrarConsumoSesion,
} from '../api/suscripciones';
import { Plus, Minus, History, Gift, CheckCircle, Calendar } from 'lucide-react';

interface GestionSesionesProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

export const GestionSesiones: React.FC<GestionSesionesProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBonusOpen, setModalBonusOpen] = useState(false);
  const [modalConsumoOpen, setModalConsumoOpen] = useState(false);
  const [sesionesIncluidas, setSesionesIncluidas] = useState<SesionIncluida[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipoAjuste, setTipoAjuste] = useState<'añadir' | 'quitar'>('añadir');
  const [cantidadSesiones, setCantidadSesiones] = useState<number>(1);
  const [motivo, setMotivo] = useState<string>('');
  const [aplicarEnProximoCiclo, setAplicarEnProximoCiclo] = useState<boolean>(false);
  
  // Estados para sesiones bonus
  const [cantidadBonusSesiones, setCantidadBonusSesiones] = useState<number>(1);
  const [motivoBonus, setMotivoBonus] = useState<string>('');
  
  // Estados para registro de consumo
  const [sesionSeleccionada, setSesionSeleccionada] = useState<SesionIncluida | null>(null);
  const [cantidadConsumo, setCantidadConsumo] = useState<number>(1);
  
  useEffect(() => {
    loadSesionesIncluidas();
  }, [suscripcion.id]);
  
  const loadSesionesIncluidas = async () => {
    setLoading(true);
    try {
      const sesiones = await obtenerSesionesIncluidas({
        suscripcionId: suscripcion.id,
        incluirCaducadas: true,
      });
      setSesionesIncluidas(sesiones);
    } catch (error) {
      console.error('Error cargando sesiones incluidas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegistrarConsumo = async () => {
    if (!sesionSeleccionada) return;
    
    try {
      await registrarConsumoSesion({
        sesionIncluidaId: sesionSeleccionada.id,
        cantidad: cantidadConsumo,
        fechaConsumo: new Date().toISOString(),
        motivo: motivo || undefined,
      });
      
      setModalConsumoOpen(false);
      setCantidadConsumo(1);
      setSesionSeleccionada(null);
      await loadSesionesIncluidas();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error registrando consumo:', error);
      alert(error.message || 'Error al registrar el consumo');
    }
  };

  const sesionesBase = suscripcion.sesionesIncluidas || 0;
  const ajusteActual = suscripcion.sesionesAjuste || 0;
  const sesionesBonus = suscripcion.sesionesBonus || 0;
  const sesionesTotales = sesionesBase + ajusteActual;
  const sesionesDisponibles = suscripcion.sesionesDisponibles || 0;

  const handleModificarSesiones = async () => {
    try {
      const sesionesAjuste = tipoAjuste === 'añadir' ? cantidadSesiones : -cantidadSesiones;
      
      await modificarSesiones({
        suscripcionId: suscripcion.id,
        sesionesAjuste,
        motivo: motivo || undefined,
        aplicarEnProximoCiclo,
      });
      
      setModalOpen(false);
      setCantidadSesiones(1);
      setMotivo('');
      setAplicarEnProximoCiclo(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error modificando sesiones:', error);
      alert('Error al modificar las sesiones');
    }
  };

  const handleAñadirBonusSesiones = async () => {
    try {
      await añadirBonusSesiones({
        suscripcionId: suscripcion.id,
        cantidadSesiones: cantidadBonusSesiones,
        motivo: motivoBonus || undefined,
      });
      
      setModalBonusOpen(false);
      setCantidadBonusSesiones(1);
      setMotivoBonus('');
      onSuccess?.();
    } catch (error) {
      console.error('Error añadiendo sesiones bonus:', error);
      alert('Error al añadir las sesiones bonus');
    }
  };

  const historialAjustes = suscripcion.historialAjustesSesiones || [];
  const historialBonus = suscripcion.historialBonusSesiones || [];

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestión de Sesiones
              </h3>
              <p className="text-base text-gray-600">
                Añade o quita sesiones del paquete sin cambiar el plan base
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Modificar Sesiones
              </Button>
              <Button
                variant="primary"
                onClick={() => setModalBonusOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Gift className="w-4 h-4 mr-2" />
                Añadir Sesiones Bonus
              </Button>
            </div>
          </div>

          {/* Resumen de sesiones */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Sesiones del Plan Base</p>
              <p className="text-2xl font-semibold text-gray-900">{sesionesBase}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ajuste Actual</p>
              <p className={`text-2xl font-semibold ${ajusteActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ajusteActual > 0 ? '+' : ''}{ajusteActual}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                <Gift className="w-4 h-4" />
                Sesiones Bonus
              </p>
              <p className="text-2xl font-semibold text-purple-600">+{sesionesBonus}</p>
              <p className="text-xs text-purple-600 mt-1">Gratuitas</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Sesiones</p>
              <p className="text-2xl font-semibold text-gray-900">{sesionesTotales + sesionesBonus}</p>
              <p className="text-sm text-gray-500 mt-1">
                {sesionesDisponibles} disponibles
              </p>
            </div>
          </div>

          {/* Sesiones Incluidas vs Consumidas */}
          {sesionesIncluidas.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Sesiones Incluidas por Período</h4>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const sesionActiva = sesionesIncluidas.find(s => {
                      const fechaCad = new Date(s.fechaCaducidad);
                      return fechaCad >= new Date();
                    });
                    if (sesionActiva) {
                      setSesionSeleccionada(sesionActiva);
                      setModalConsumoOpen(true);
                    }
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Registrar Consumo
                </Button>
              </div>
              <div className="space-y-3">
                {sesionesIncluidas.map((sesion) => {
                  const disponible = sesion.totalSesiones - sesion.consumidas;
                  const porcentaje = sesion.totalSesiones > 0 
                    ? Math.round((sesion.consumidas / sesion.totalSesiones) * 100)
                    : 0;
                  const fechaCad = new Date(sesion.fechaCaducidad);
                  const hoy = new Date();
                  const diasRestantes = Math.ceil((fechaCad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                  const estaCaducada = fechaCad < hoy;
                  
                  return (
                    <Card key={sesion.id} className={`p-4 border ${estaCaducada ? 'border-gray-300 bg-gray-50' : 'border-blue-200 bg-blue-50'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-gray-900">
                              Período: {sesion.periodo || 'N/A'}
                            </h5>
                            <Badge color={sesion.tipoSesion === 'bonus' ? 'success' : sesion.tipoSesion === 'transferida' ? 'info' : 'primary'}>
                              {sesion.tipoSesion}
                            </Badge>
                            {estaCaducada && (
                              <Badge color="error">Caducada</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Total Incluidas</p>
                              <p className="text-lg font-semibold text-gray-900">{sesion.totalSesiones}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Consumidas</p>
                              <p className="text-lg font-semibold text-blue-600">{sesion.consumidas}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Disponibles</p>
                              <p className="text-lg font-semibold text-green-600">{disponible}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Caducidad
                              </p>
                              <p className={`text-sm font-semibold ${estaCaducada ? 'text-red-600' : diasRestantes <= 7 ? 'text-orange-600' : 'text-gray-900'}`}>
                                {diasRestantes < 0 ? `Hace ${Math.abs(diasRestantes)} días` : diasRestantes === 0 ? 'Hoy' : `${diasRestantes} días`}
                              </p>
                            </div>
                          </div>
                          
                          {/* Barra de progreso */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Progreso de uso</span>
                              <span className="text-xs font-semibold text-gray-900">{porcentaje}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  porcentaje >= 80 ? 'bg-green-500' : 
                                  porcentaje >= 50 ? 'bg-yellow-500' : 
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(100, porcentaje)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {!estaCaducada && disponible > 0 && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSesionSeleccionada(sesion);
                              setCantidadConsumo(1);
                              setModalConsumoOpen(true);
                            }}
                          >
                            Registrar
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historial de sesiones bonus */}
          {historialBonus.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-purple-600" />
                <h4 className="text-lg font-semibold text-gray-900">Historial de Sesiones Bonus</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sesiones Bonus
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Antes
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Después
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historialBonus.map((bonus) => (
                      <tr key={bonus.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(bonus.fechaAñadido).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="font-semibold text-purple-600">
                            +{bonus.cantidadSesiones}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {bonus.sesionesAntes}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {bonus.sesionesDespues}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {bonus.motivo || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Historial de ajustes */}
          {historialAjustes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-900">Historial de Ajustes</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ajuste
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Antes
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Después
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historialAjustes.map((ajuste) => (
                      <tr key={ajuste.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(ajuste.fechaAjuste).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`font-semibold ${ajuste.sesionesAjuste >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {ajuste.sesionesAjuste > 0 ? '+' : ''}{ajuste.sesionesAjuste}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {ajuste.sesionesAntes}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {ajuste.sesionesDespues}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge color={ajuste.aplicado ? 'success' : 'warning'}>
                            {ajuste.aplicado ? 'Aplicado' : 'Pendiente'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {ajuste.motivo || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modificar Sesiones del Paquete"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ajuste
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setTipoAjuste('añadir')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  tipoAjuste === 'añadir'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="w-5 h-5 mx-auto mb-1" />
                <span className="font-medium">Añadir Sesiones</span>
              </button>
              <button
                type="button"
                onClick={() => setTipoAjuste('quitar')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  tipoAjuste === 'quitar'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Minus className="w-5 h-5 mx-auto mb-1" />
                <span className="font-medium">Quitar Sesiones</span>
              </button>
            </div>
          </div>

          <Input
            label="Cantidad de Sesiones"
            type="number"
            min="1"
            max={tipoAjuste === 'quitar' ? sesionesDisponibles : undefined}
            value={cantidadSesiones.toString()}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              if (tipoAjuste === 'quitar') {
                setCantidadSesiones(Math.min(value, sesionesDisponibles));
              } else {
                setCantidadSesiones(value);
              }
            }}
          />

          {tipoAjuste === 'quitar' && cantidadSesiones > sesionesDisponibles && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                No puedes quitar más sesiones de las disponibles ({sesionesDisponibles})
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              Sesiones actuales: <span className="font-semibold">{sesionesTotales}</span>
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Ajuste: <span className={`font-semibold ${tipoAjuste === 'añadir' ? 'text-green-600' : 'text-red-600'}`}>
                {tipoAjuste === 'añadir' ? '+' : '-'}{cantidadSesiones}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              Nuevo total: {sesionesTotales + (tipoAjuste === 'añadir' ? cantidadSesiones : -cantidadSesiones)} sesiones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aplicarProximoCiclo"
              checked={aplicarEnProximoCiclo}
              onChange={(e) => setAplicarEnProximoCiclo(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="aplicarProximoCiclo" className="text-sm text-gray-700">
              Aplicar en el próximo ciclo de renovación
            </label>
          </div>

          <Input
            label="Motivo (opcional)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Cliente necesita más sesiones este mes"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleModificarSesiones}
              disabled={cantidadSesiones < 1 || (tipoAjuste === 'quitar' && cantidadSesiones > sesionesDisponibles)}
            >
              {tipoAjuste === 'añadir' ? 'Añadir' : 'Quitar'} Sesiones
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para añadir sesiones bonus */}
      <Modal
        isOpen={modalBonusOpen}
        onClose={() => setModalBonusOpen(false)}
        title="Añadir Sesiones Bonus Gratuitas"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-2">
              <Gift className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-900 mb-1">
                  Sesiones Bonus Gratuitas
                </p>
                <p className="text-sm text-purple-700">
                  Añade sesiones bonus gratuitas para recompensar fidelidad o compensar inconvenientes.
                  Estas sesiones se suman a las sesiones disponibles del cliente.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Cantidad de Sesiones Bonus"
            type="number"
            min="1"
            value={cantidadBonusSesiones.toString()}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setCantidadBonusSesiones(Math.max(1, value));
            }}
          />

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              Sesiones bonus actuales: <span className="font-semibold">{sesionesBonus}</span>
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Añadiendo: <span className="font-semibold text-purple-600">+{cantidadBonusSesiones}</span>
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              Nuevo total bonus: {sesionesBonus + cantidadBonusSesiones} sesiones
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Sesiones disponibles totales: {sesionesDisponibles + cantidadBonusSesiones}
            </p>
          </div>

          <Input
            label="Motivo (opcional)"
            value={motivoBonus}
            onChange={(e) => setMotivoBonus(e.target.value)}
            placeholder="Ej: Recompensa por fidelidad, Compensación por inconveniente, etc."
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModalBonusOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAñadirBonusSesiones}
              disabled={cantidadBonusSesiones < 1}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Gift className="w-4 h-4 mr-2" />
              Añadir Sesiones Bonus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para registrar consumo */}
      <Modal
        isOpen={modalConsumoOpen}
        onClose={() => {
          setModalConsumoOpen(false);
          setSesionSeleccionada(null);
          setCantidadConsumo(1);
        }}
        title="Registrar Consumo de Sesiones"
        size="md"
      >
        {sesionSeleccionada && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Período:</strong> {sesionSeleccionada.periodo || 'N/A'}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Sesiones disponibles:</strong> {sesionSeleccionada.totalSesiones - sesionSeleccionada.consumidas} de {sesionSeleccionada.totalSesiones}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Caducidad:</strong> {new Date(sesionSeleccionada.fechaCaducidad).toLocaleDateString('es-ES')}
              </p>
            </div>

            <Input
              label="Cantidad de sesiones a consumir"
              type="number"
              min={1}
              max={sesionSeleccionada.totalSesiones - sesionSeleccionada.consumidas}
              value={cantidadConsumo.toString()}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                const max = sesionSeleccionada.totalSesiones - sesionSeleccionada.consumidas;
                setCantidadConsumo(Math.min(Math.max(1, value), max));
              }}
              helperText={`Máximo: ${sesionSeleccionada.totalSesiones - sesionSeleccionada.consumidas} sesiones`}
            />

            <Input
              label="Motivo (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Sesión realizada, Compensación, etc."
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalConsumoOpen(false);
                  setSesionSeleccionada(null);
                  setCantidadConsumo(1);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleRegistrarConsumo}
                disabled={cantidadConsumo < 1 || cantidadConsumo > (sesionSeleccionada.totalSesiones - sesionSeleccionada.consumidas)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Registrar Consumo
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

