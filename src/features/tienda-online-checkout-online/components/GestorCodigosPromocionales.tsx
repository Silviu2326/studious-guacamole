import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Modal, Badge, Table } from '../../../components/componentsreutilizables';
import { CodigoPromocional } from '../types';
import {
  crearCodigoPromocional,
  getCodigosPromocionales,
  actualizarCodigoPromocional,
  eliminarCodigoPromocional,
} from '../api/codigosPromocionales';
import { Tag, Plus, Edit, Trash2, Copy, Check, Calendar, Users, DollarSign, Percent } from 'lucide-react';

interface GestorCodigosPromocionalesProps {
  entrenadorId?: string;
}

export const GestorCodigosPromocionales: React.FC<GestorCodigosPromocionalesProps> = ({
  entrenadorId,
}) => {
  const [codigos, setCodigos] = useState<CodigoPromocional[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoEditando, setCodigoEditando] = useState<CodigoPromocional | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  // Formulario
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoDescuento, setTipoDescuento] = useState<'porcentual' | 'fijo'>('porcentual');
  const [valorDescuento, setValorDescuento] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [vecesMaximas, setVecesMaximas] = useState<string>('');
  const [vecesMaximasPorCliente, setVecesMaximasPorCliente] = useState<string>('');
  const [minimoCompra, setMinimoCompra] = useState<string>('');
  const [activo, setActivo] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarCodigos();
  }, [entrenadorId]);

  const cargarCodigos = async () => {
    setCargando(true);
    try {
      const data = await getCodigosPromocionales(entrenadorId);
      setCodigos(data);
    } catch (error) {
      console.error('Error cargando códigos promocionales:', error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalCrear = () => {
    setCodigoEditando(null);
    resetearFormulario();
    setMostrarModal(true);
  };

  const abrirModalEditar = (codigo: CodigoPromocional) => {
    setCodigoEditando(codigo);
    setCodigo(codigo.codigo);
    setDescripcion(codigo.descripcion);
    setTipoDescuento(codigo.tipoDescuento);
    setValorDescuento(codigo.valorDescuento);
    setFechaInicio(new Date(codigo.fechaInicio).toISOString().split('T')[0]);
    setFechaFin(new Date(codigo.fechaFin).toISOString().split('T')[0]);
    setVecesMaximas(codigo.vecesMaximas?.toString() || '');
    setVecesMaximasPorCliente(codigo.vecesMaximasPorCliente?.toString() || '');
    setMinimoCompra(codigo.minimoCompra?.toString() || '');
    setActivo(codigo.activo);
    setMostrarModal(true);
  };

  const resetearFormulario = () => {
    setCodigo('');
    setDescripcion('');
    setTipoDescuento('porcentual');
    setValorDescuento(0);
    const hoy = new Date();
    const fin = new Date();
    fin.setMonth(fin.getMonth() + 1);
    setFechaInicio(hoy.toISOString().split('T')[0]);
    setFechaFin(fin.toISOString().split('T')[0]);
    setVecesMaximas('');
    setVecesMaximasPorCliente('');
    setMinimoCompra('');
    setActivo(true);
    setErrores({});
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!codigo.trim()) {
      nuevosErrores.codigo = 'El código es obligatorio';
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (valorDescuento <= 0) {
      nuevosErrores.valorDescuento = 'El valor del descuento debe ser mayor a 0';
    }

    if (tipoDescuento === 'porcentual' && valorDescuento > 100) {
      nuevosErrores.valorDescuento = 'El descuento porcentual no puede ser mayor a 100%';
    }

    if (!fechaInicio) {
      nuevosErrores.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!fechaFin) {
      nuevosErrores.fechaFin = 'La fecha de fin es obligatoria';
    }

    if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
      nuevosErrores.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    try {
      if (codigoEditando) {
        // Actualizar
        const actualizado = await actualizarCodigoPromocional(codigoEditando.id, {
          codigo: codigo.toUpperCase(),
          descripcion,
          tipoDescuento,
          valorDescuento,
          fechaInicio: new Date(fechaInicio),
          fechaFin: new Date(fechaFin),
          vecesMaximas: vecesMaximas ? parseInt(vecesMaximas) : undefined,
          vecesMaximasPorCliente: vecesMaximasPorCliente ? parseInt(vecesMaximasPorCliente) : undefined,
          minimoCompra: minimoCompra ? parseFloat(minimoCompra) : undefined,
          activo,
        });
        setCodigos(codigos.map((c) => (c.id === codigoEditando.id ? actualizado : c)));
      } else {
        // Crear
        const nuevo = await crearCodigoPromocional({
          codigo: codigo.toUpperCase(),
          descripcion,
          tipoDescuento,
          valorDescuento,
          fechaInicio: new Date(fechaInicio),
          fechaFin: new Date(fechaFin),
          vecesMaximas: vecesMaximas ? parseInt(vecesMaximas) : undefined,
          vecesMaximasPorCliente: vecesMaximasPorCliente ? parseInt(vecesMaximasPorCliente) : undefined,
          minimoCompra: minimoCompra ? parseFloat(minimoCompra) : undefined,
          entrenadorId,
        });
        setCodigos([nuevo, ...codigos]);
      }
      setMostrarModal(false);
      resetearFormulario();
    } catch (error: any) {
      setErrores({ general: error.message || 'Error al guardar el código promocional' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este código promocional?')) {
      return;
    }

    try {
      await eliminarCodigoPromocional(id);
      setCodigos(codigos.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error eliminando código:', error);
      alert('Error al eliminar el código promocional');
    }
  };

  const handleCopiarCodigo = async (codigoTexto: string, id: string) => {
    try {
      await navigator.clipboard.writeText(codigoTexto);
      setCopiado(id);
      setTimeout(() => setCopiado(null), 2000);
    } catch (error) {
      console.error('Error copiando código:', error);
    }
  };

  const estaVigente = (codigo: CodigoPromocional): boolean => {
    const ahora = new Date();
    return (
      codigo.activo &&
      ahora >= codigo.fechaInicio &&
      ahora <= codigo.fechaFin &&
      (!codigo.vecesMaximas || codigo.vecesUsado < codigo.vecesMaximas)
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Códigos Promocionales</h2>
            <p className="text-gray-600 mt-1">
              Crea códigos promocionales con descuentos porcentuales o fijos para tus campañas de marketing
            </p>
          </div>
          <Button variant="primary" onClick={abrirModalCrear}>
            <Plus size={18} className="mr-2" />
            Crear Código
          </Button>
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando códigos promocionales...</p>
          </div>
        ) : codigos.length === 0 ? (
          <Card className="p-12 text-center bg-gray-50">
            <Tag size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay códigos promocionales</h3>
            <p className="text-gray-600 mb-4">
              Crea tu primer código promocional para atraer nuevos clientes
            </p>
            <Button variant="primary" onClick={abrirModalCrear}>
              <Plus size={18} className="mr-2" />
              Crear Primer Código
            </Button>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={[
                { key: 'codigo', header: 'Código' },
                { key: 'descripcion', header: 'Descripción' },
                { key: 'descuento', header: 'Descuento' },
                { key: 'vigencia', header: 'Vigencia' },
                { key: 'usos', header: 'Usos' },
                { key: 'estado', header: 'Estado' },
                { key: 'acciones', header: 'Acciones' },
              ]}
              data={codigos.map((c) => ({
                codigo: (
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                      {c.codigo}
                    </code>
                    <button
                      onClick={() => handleCopiarCodigo(c.codigo, c.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiado === c.id ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                ),
                descripcion: <span className="text-sm text-gray-700">{c.descripcion}</span>,
                descuento: (
                  <div className="flex items-center gap-1">
                    {c.tipoDescuento === 'porcentual' ? (
                      <>
                        <Percent size={16} className="text-blue-600" />
                        <span className="font-semibold text-blue-600">{c.valorDescuento}%</span>
                      </>
                    ) : (
                      <>
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-semibold text-green-600">€{c.valorDescuento.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                ),
                vigencia: (
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(c.fechaInicio).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {new Date(c.fechaFin).toLocaleDateString()}
                    </div>
                  </div>
                ),
                usos: (
                  <div className="text-sm">
                    <span className="font-medium">{c.vecesUsado}</span>
                    {c.vecesMaximas && (
                      <span className="text-gray-500"> / {c.vecesMaximas}</span>
                    )}
                  </div>
                ),
                estado: estaVigente(c) ? (
                  <Badge variant="primary">Vigente</Badge>
                ) : (
                  <Badge variant="secondary">Inactivo</Badge>
                ),
                acciones: (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => abrirModalEditar(c)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminar(c.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          resetearFormulario();
        }}
        title={codigoEditando ? 'Editar Código Promocional' : 'Crear Código Promocional'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModal(false);
                resetearFormulario();
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar} loading={guardando}>
              {codigoEditando ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {errores.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errores.general}
            </div>
          )}

          <Input
            label="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            error={errores.codigo}
            placeholder="Ej: VERANO2024"
            disabled={!!codigoEditando}
            required
          />

          <Input
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            error={errores.descripcion}
            placeholder="Descripción del código promocional"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de Descuento"
              value={tipoDescuento}
              onChange={(value) => setTipoDescuento(value as 'porcentual' | 'fijo')}
              options={[
                { value: 'porcentual', label: 'Porcentual (%)' },
                { value: 'fijo', label: 'Fijo (€)' },
              ]}
            />

            <Input
              label={tipoDescuento === 'porcentual' ? 'Descuento (%)' : 'Descuento (€)'}
              type="number"
              step={tipoDescuento === 'porcentual' ? '1' : '0.01'}
              min="0"
              max={tipoDescuento === 'porcentual' ? '100' : undefined}
              value={valorDescuento.toString()}
              onChange={(e) => setValorDescuento(parseFloat(e.target.value) || 0)}
              error={errores.valorDescuento}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              error={errores.fechaInicio}
              required
            />

            <Input
              label="Fecha de Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              error={errores.fechaFin}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Usos Máximos (opcional)"
              type="number"
              min="1"
              value={vecesMaximas}
              onChange={(e) => setVecesMaximas(e.target.value)}
              placeholder="Sin límite"
            />

            <Input
              label="Usos por Cliente (opcional)"
              type="number"
              min="1"
              value={vecesMaximasPorCliente}
              onChange={(e) => setVecesMaximasPorCliente(e.target.value)}
              placeholder="Sin límite"
            />

            <Input
              label="Mínimo de Compra (€) (opcional)"
              type="number"
              step="0.01"
              min="0"
              value={minimoCompra}
              onChange={(e) => setMinimoCompra(e.target.value)}
              placeholder="Sin mínimo"
            />
          </div>

          {codigoEditando && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
              />
              <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                Código activo
              </label>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

