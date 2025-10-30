import React, { useState } from 'react';
import { Modal, Button, Select, Input, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { useCajaBancos } from '../hooks/useCajaBancos';
import { CuentaBancaria } from '../types';

interface NuevaConciliacionModalProps {
  onClose: () => void;
  cuentasBancarias: CuentaBancaria[];
  onConciliacionCreada: () => void;
}

export const NuevaConciliacionModal: React.FC<NuevaConciliacionModalProps> = ({
  onClose,
  cuentasBancarias,
  onConciliacionCreada
}) => {
  const { crearConciliacion } = useCajaBancos();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cuentaId: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cuentaId) {
      newErrors.cuentaId = 'Debe seleccionar una cuenta bancaria';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida';
    }

    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      
      if (inicio >= fin) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }

      // No permitir fechas futuras
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      
      if (fin > hoy) {
        newErrors.fechaFin = 'No se pueden conciliar fechas futuras';
      }

      // Validar que el período no sea mayor a 3 meses
      const tresMeses = 90 * 24 * 60 * 60 * 1000; // 90 días en milisegundos
      if (fin.getTime() - inicio.getTime() > tresMeses) {
        newErrors.fechaFin = 'El período no puede ser mayor a 3 meses';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const cuentaSeleccionada = cuentasBancarias.find(c => c.id === formData.cuentaId);
      if (!cuentaSeleccionada) {
        throw new Error('Cuenta no encontrada');
      }

      await crearConciliacion({
        banco: cuentaSeleccionada.banco,
        cuenta: cuentaSeleccionada.numeroCuenta,
        fechaInicio: new Date(formData.fechaInicio),
        fechaFin: new Date(formData.fechaFin)
      });

      onConciliacionCreada();
      onClose();
    } catch (error) {
      console.error('Error al crear conciliación:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  const calcularDiasPeriodo = () => {
    if (!formData.fechaInicio || !formData.fechaFin) return 0;
    
    const inicio = new Date(formData.fechaInicio);
    const fin = new Date(formData.fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  const obtenerFechasSugeridas = () => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    
    return {
      mesActual: {
        inicio: inicioMes.toISOString().split('T')[0],
        fin: hoy.toISOString().split('T')[0]
      },
      mesAnterior: {
        inicio: inicioMesAnterior.toISOString().split('T')[0],
        fin: finMesAnterior.toISOString().split('T')[0]
      }
    };
  };

  const fechasSugeridas = obtenerFechasSugeridas();
  const diasPeriodo = calcularDiasPeriodo();
  const cuentaSeleccionada = cuentasBancarias.find(c => c.id === formData.cuentaId);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Nueva Conciliación Bancaria"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error general */}
        {errors.general && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 dark:text-red-300">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Selección de cuenta */}
        <div>
          <Select
            label="Cuenta Bancaria"
            value={formData.cuentaId}
            onChange={(value) => setFormData(prev => ({ ...prev, cuentaId: value }))}
            options={[
              { value: '', label: 'Seleccionar cuenta...' },
              ...cuentasBancarias
                .filter(cuenta => cuenta.activa)
                .map(cuenta => ({
                  value: cuenta.id,
                  label: `${cuenta.banco} - ${cuenta.numeroCuenta} (${cuenta.tipoCuenta})`
                }))
            ]}
            error={errors.cuentaId}
            required
          />
          
          {cuentaSeleccionada && (
            <Card className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`${ds.typography.body} font-semibold`}>
                    {cuentaSeleccionada.banco}
                  </div>
                  <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {cuentaSeleccionada.numeroCuenta} • {cuentaSeleccionada.tipoCuenta}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Saldo actual
                  </div>
                  <div className={`${ds.typography.body} font-semibold text-blue-600`}>
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(cuentaSeleccionada.saldoActual)}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Períodos sugeridos */}
        <div>
          <label className={`block ${ds.typography.body} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Períodos sugeridos:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                fechaInicio: fechasSugeridas.mesActual.inicio,
                fechaFin: fechasSugeridas.mesActual.fin
              }))}
              className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                formData.fechaInicio === fechasSugeridas.mesActual.inicio &&
                formData.fechaFin === fechasSugeridas.mesActual.fin
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className={`${ds.typography.body} font-semibold mb-1`}>
                Mes Actual
              </div>
              <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {new Date(fechasSugeridas.mesActual.inicio).toLocaleDateString('es-CO')} - {new Date(fechasSugeridas.mesActual.fin).toLocaleDateString('es-CO')}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                fechaInicio: fechasSugeridas.mesAnterior.inicio,
                fechaFin: fechasSugeridas.mesAnterior.fin
              }))}
              className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                formData.fechaInicio === fechasSugeridas.mesAnterior.inicio &&
                formData.fechaFin === fechasSugeridas.mesAnterior.fin
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className={`${ds.typography.body} font-semibold mb-1`}>
                Mes Anterior
              </div>
              <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {new Date(fechasSugeridas.mesAnterior.inicio).toLocaleDateString('es-CO')} - {new Date(fechasSugeridas.mesAnterior.fin).toLocaleDateString('es-CO')}
              </div>
            </button>
          </div>
        </div>

        {/* Fechas personalizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData(prev => ({ ...prev, fechaInicio: e.target.value }))}
            error={errors.fechaInicio}
            required
          />

          <Input
            label="Fecha de Fin"
            type="date"
            value={formData.fechaFin}
            onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
            error={errors.fechaFin}
            required
          />
        </div>

        {/* Información del período */}
        {diasPeriodo > 0 && (
          <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className={`${ds.typography.body} font-semibold`}>
                  Período seleccionado
                </div>
                <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {diasPeriodo} días
                </div>
              </div>
              <div className="flex items-center gap-2">
                {diasPeriodo <= 31 ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : diasPeriodo <= 90 ? (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                <span className={`${ds.typography.bodySmall} ${
                  diasPeriodo <= 31 ? 'text-green-600' :
                  diasPeriodo <= 90 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {diasPeriodo <= 31 ? 'Período óptimo' :
                   diasPeriodo <= 90 ? 'Período largo' : 'Período muy largo'}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Información importante */}
        <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className={`${ds.typography.body} font-semibold text-yellow-700 dark:text-yellow-300 mb-2`}>
                Información importante
              </h4>
              <ul className={`space-y-1 ${ds.typography.bodySmall} text-yellow-600 dark:text-yellow-400`}>
                <li>• La conciliación analizará todos los movimientos del período seleccionado</li>
                <li>• Se identificarán automáticamente las diferencias y movimientos pendientes</li>
                <li>• Asegúrese de tener importados todos los movimientos bancarios del período</li>
                <li>• El proceso puede tomar unos minutos dependiendo del volumen de transacciones</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || !formData.cuentaId || !formData.fechaInicio || !formData.fechaFin}
          >
            {loading ? 'Creando conciliación...' : 'Crear Conciliación'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};