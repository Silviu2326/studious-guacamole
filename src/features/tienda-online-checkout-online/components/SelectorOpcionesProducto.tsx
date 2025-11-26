import React, { useState, useEffect } from 'react';
import { Producto, OpcionesSeleccionadas, OpcionPersonalizable } from '../types';
import { calcularPrecioConOpciones, validarOpcionesRequeridas } from '../utils/precios';
import { Select } from '../../../components/componentsreutilizables';
import { Settings, Euro } from 'lucide-react';

interface SelectorOpcionesProductoProps {
  producto: Producto;
  opcionesIniciales?: OpcionesSeleccionadas;
  onOpcionesCambiadas: (opciones: OpcionesSeleccionadas, precioFinal: number) => void;
  onValidacionCambiada?: (valido: boolean) => void;
}

export const SelectorOpcionesProducto: React.FC<SelectorOpcionesProductoProps> = ({
  producto,
  opcionesIniciales = {},
  onOpcionesCambiadas,
  onValidacionCambiada,
}) => {
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<OpcionesSeleccionadas>(
    opcionesIniciales
  );

  const opcionesPersonalizables = producto.metadatos?.opcionesPersonalizables || [];

  // Inicializar opciones requeridas con el primer valor disponible
  useEffect(() => {
    const nuevasOpciones: OpcionesSeleccionadas = { ...opcionesSeleccionadas };

    opcionesPersonalizables.forEach((opcion) => {
      if (opcion.requerida && !nuevasOpciones[opcion.id]) {
        const primerValorDisponible = opcion.valores.find((v) => v.disponible);
        if (primerValorDisponible) {
          nuevasOpciones[opcion.id] = primerValorDisponible.id;
        }
      }
    });

    if (Object.keys(nuevasOpciones).length !== Object.keys(opcionesSeleccionadas).length) {
      setOpcionesSeleccionadas(nuevasOpciones);
      const precioFinal = calcularPrecioConOpciones(producto, nuevasOpciones);
      onOpcionesCambiadas(nuevasOpciones, precioFinal);
    }
  }, []);

  useEffect(() => {
    const precioFinal = calcularPrecioConOpciones(producto, opcionesSeleccionadas);
    onOpcionesCambiadas(opcionesSeleccionadas, precioFinal);

    // Validar opciones
    const validacion = validarOpcionesRequeridas(producto, opcionesSeleccionadas);
    if (onValidacionCambiada) {
      onValidacionCambiada(validacion.valido);
    }
  }, [opcionesSeleccionadas, producto]);

  const handleOpcionCambio = (opcionId: string, valorId: string) => {
    setOpcionesSeleccionadas((prev) => ({
      ...prev,
      [opcionId]: valorId,
    }));
  };

  const precioFinal = calcularPrecioConOpciones(producto, opcionesSeleccionadas);
  const diferenciaPrecio = precioFinal - producto.precio;

  if (opcionesPersonalizables.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <Settings size={18} className="text-blue-600" />
        <h4 className="font-semibold text-gray-900">Personalizar Servicio</h4>
      </div>

      {opcionesPersonalizables.map((opcion) => {
        const valorSeleccionado = opcion.valores.find(
          (v) => v.id === opcionesSeleccionadas[opcion.id]
        );

        return (
          <div key={opcion.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {opcion.nombre}
              {opcion.requerida && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
              value={opcionesSeleccionadas[opcion.id] || ''}
              onChange={(e) => handleOpcionCambio(opcion.id, e.target.value)}
              options={[
                { value: '', label: 'Selecciona una opción' },
                ...opcion.valores
                  .filter((v) => v.disponible)
                  .map((valor) => ({
                    value: valor.id,
                    label: `${valor.nombre}${
                      valor.modificadorPrecio !== undefined && valor.modificadorPrecio !== 0
                        ? ` (${valor.modificadorPrecio > 0 ? '+' : ''}€${valor.modificadorPrecio.toFixed(2)})`
                        : valor.modificadorPorcentaje !== undefined && valor.modificadorPorcentaje !== 0
                        ? ` (${valor.modificadorPorcentaje > 0 ? '+' : ''}${valor.modificadorPorcentaje}%)`
                        : ''
                    }`,
                  })),
              ]}
              required={opcion.requerida}
            />
            {valorSeleccionado && (
              <p className="text-xs text-gray-500">
                {valorSeleccionado.modificadorPrecio !== undefined &&
                  valorSeleccionado.modificadorPrecio !== 0 && (
                    <span>
                      {valorSeleccionado.modificadorPrecio > 0 ? '+' : ''}
                      €{valorSeleccionado.modificadorPrecio.toFixed(2)}
                    </span>
                  )}
                {valorSeleccionado.modificadorPorcentaje !== undefined &&
                  valorSeleccionado.modificadorPorcentaje !== 0 && (
                    <span>
                      {valorSeleccionado.modificadorPorcentaje > 0 ? '+' : ''}
                      {valorSeleccionado.modificadorPorcentaje}%
                    </span>
                  )}
              </p>
            )}
          </div>
        );
      })}

      {diferenciaPrecio !== 0 && (
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Precio base:</span>
            <span className="text-sm text-gray-600">€{producto.precio.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Euro size={14} />
              Modificador por opciones:
            </span>
            <span
              className={`text-sm font-semibold ${
                diferenciaPrecio > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {diferenciaPrecio > 0 ? '+' : ''}€{diferenciaPrecio.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-300">
            <span className="text-base font-bold text-gray-900">Precio final:</span>
            <span className="text-lg font-bold text-blue-600">€{precioFinal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

