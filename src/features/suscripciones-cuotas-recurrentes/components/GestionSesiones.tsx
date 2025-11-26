import React, { useState } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Modal, Input, Badge } from '../../../components/componentsreutilizables';
import { modificarSesiones, añadirBonusSesiones } from '../api/suscripciones';
import { Plus, Minus, History, Gift } from 'lucide-react';

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
  const [tipoAjuste, setTipoAjuste] = useState<'añadir' | 'quitar'>('añadir');
  const [cantidadSesiones, setCantidadSesiones] = useState<number>(1);
  const [motivo, setMotivo] = useState<string>('');
  const [aplicarEnProximoCiclo, setAplicarEnProximoCiclo] = useState<boolean>(false);
  
  // Estados para sesiones bonus
  const [cantidadBonusSesiones, setCantidadBonusSesiones] = useState<number>(1);
  const [motivoBonus, setMotivoBonus] = useState<string>('');

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
    </>
  );
};

