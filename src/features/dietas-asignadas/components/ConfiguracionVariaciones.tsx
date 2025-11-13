import React, { useState, useMemo } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import { 
  RotateCcw, 
  Plus, 
  X, 
  Calendar, 
  UtensilsCrossed, 
  CheckCircle2, 
  AlertCircle,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import { Dieta, Comida, TipoComida, VariacionAutomatica } from '../types';

interface ConfiguracionVariacionesProps {
  dieta: Dieta;
  variaciones: VariacionAutomatica[];
  onGuardar: (variaciones: VariacionAutomatica[]) => void;
  onCancelar?: () => void;
}

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' },
];

const tiposComida: { id: TipoComida; nombre: string }[] = [
  { id: 'desayuno', nombre: 'Desayuno' },
  { id: 'media-manana', nombre: 'Snack mañana' },
  { id: 'almuerzo', nombre: 'Almuerzo' },
  { id: 'merienda', nombre: 'Snack tarde' },
  { id: 'cena', nombre: 'Cena' },
  { id: 'post-entreno', nombre: 'Post-entreno' },
];

export const ConfiguracionVariaciones: React.FC<ConfiguracionVariacionesProps> = ({
  dieta,
  variaciones,
  onGuardar,
  onCancelar,
}) => {
  const [variacionesLocales, setVariacionesLocales] = useState<VariacionAutomatica[]>(variaciones);
  const [mostrarModalNueva, setMostrarModalNueva] = useState(false);
  const [variacionEditando, setVariacionEditando] = useState<VariacionAutomatica | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('');
  const [tipoComidaSeleccionado, setTipoComidaSeleccionado] = useState<TipoComida | ''>('');
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<Comida[]>([]);

  // Obtener comidas disponibles para seleccionar como opciones
  const comidasDisponibles = useMemo(() => {
    return dieta.comidas.filter(c => 
      !variacionesLocales.some(v => 
        v.id !== variacionEditando?.id && 
        v.opciones.some(op => op.id === c.id)
      )
    );
  }, [dieta.comidas, variacionesLocales, variacionEditando]);

  const abrirModalNueva = () => {
    setVariacionEditando(null);
    setDiaSeleccionado('');
    setTipoComidaSeleccionado('');
    setOpcionesSeleccionadas([]);
    setMostrarModalNueva(true);
  };

  const abrirModalEditar = (variacion: VariacionAutomatica) => {
    setVariacionEditando(variacion);
    setDiaSeleccionado(variacion.dia);
    setTipoComidaSeleccionado(variacion.tipoComida);
    setOpcionesSeleccionadas([...variacion.opciones]);
    setMostrarModalNueva(true);
  };

  const cerrarModal = () => {
    setMostrarModalNueva(false);
    setVariacionEditando(null);
    setDiaSeleccionado('');
    setTipoComidaSeleccionado('');
    setOpcionesSeleccionadas([]);
  };

  const agregarOpcion = (comida: Comida) => {
    if (!opcionesSeleccionadas.find(c => c.id === comida.id)) {
      setOpcionesSeleccionadas([...opcionesSeleccionadas, comida]);
    }
  };

  const eliminarOpcion = (comidaId: string) => {
    setOpcionesSeleccionadas(opcionesSeleccionadas.filter(c => c.id !== comidaId));
  };

  const guardarVariacion = () => {
    if (!diaSeleccionado || !tipoComidaSeleccionado || opcionesSeleccionadas.length < 2) {
      alert('Por favor, selecciona un día, tipo de comida y al menos 2 opciones para rotar');
      return;
    }

    const nuevaVariacion: VariacionAutomatica = {
      id: variacionEditando?.id || `var-${Date.now()}`,
      dietaId: dieta.id,
      tipoComida: tipoComidaSeleccionado as TipoComida,
      dia: diaSeleccionado,
      opciones: opcionesSeleccionadas,
      activa: variacionEditando?.activa ?? true,
      creadoEn: variacionEditando?.creadoEn || new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };

    let nuevasVariaciones: VariacionAutomatica[];
    if (variacionEditando) {
      nuevasVariaciones = variacionesLocales.map(v => 
        v.id === variacionEditando.id ? nuevaVariacion : v
      );
    } else {
      nuevasVariaciones = [...variacionesLocales, nuevaVariacion];
    }

    setVariacionesLocales(nuevasVariaciones);
    cerrarModal();
  };

  const eliminarVariacion = (variacionId: string) => {
    if (confirm('¿Eliminar esta variación automática?')) {
      setVariacionesLocales(variacionesLocales.filter(v => v.id !== variacionId));
    }
  };

  const toggleActivar = (variacionId: string) => {
    setVariacionesLocales(variacionesLocales.map(v => 
      v.id === variacionId ? { ...v, activa: !v.activa } : v
    ));
  };

  const handleGuardar = () => {
    onGuardar(variacionesLocales);
  };

  const getDiaNombre = (diaId: string) => {
    return diasSemana.find(d => d.id === diaId)?.nombre || diaId;
  };

  const getTipoComidaNombre = (tipo: TipoComida) => {
    return tiposComida.find(t => t.id === tipo)?.nombre || tipo;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Variaciones Automáticas</h3>
          <p className="text-sm text-gray-500 mt-1">
            Programa rotaciones automáticas de comidas para mantener variedad sin trabajo manual
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={abrirModalNueva}
        >
          Nueva Variación
        </Button>
      </div>

      {variacionesLocales.length === 0 ? (
        <Card className="p-8 text-center border-2 border-dashed border-gray-300">
          <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            No hay variaciones configuradas
          </h4>
          <p className="text-xs text-gray-500 mb-4">
            Crea variaciones automáticas para rotar comidas en días específicos
          </p>
          <Button variant="secondary" size="sm" onClick={abrirModalNueva}>
            Crear primera variación
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {variacionesLocales.map((variacion) => (
            <Card
              key={variacion.id}
              className={`p-4 border-2 ${
                variacion.activa 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${
                      variacion.activa 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {variacion.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {getDiaNombre(variacion.dia)}
                    </span>
                    <UtensilsCrossed className="w-4 h-4 text-gray-500 ml-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {getTipoComidaNombre(variacion.tipoComida)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {variacion.opciones.map((opcion, index) => (
                      <Badge
                        key={opcion.id}
                        className="bg-blue-50 text-blue-700 text-xs py-1 px-2"
                      >
                        {index + 1}. {opcion.nombre} ({opcion.calorias} kcal)
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {variacion.opciones.length} opciones que rotarán automáticamente
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActivar(variacion.id)}
                    className="h-8 w-8 p-0"
                    title={variacion.activa ? 'Desactivar' : 'Activar'}
                  >
                    {variacion.activa ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => abrirModalEditar(variacion)}
                    className="h-8 w-8 p-0"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarVariacion(variacion.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        {onCancelar && (
          <Button variant="ghost" size="sm" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={handleGuardar}>
          Guardar Variaciones
        </Button>
      </div>

      {/* Modal para crear/editar variación */}
      <Modal
        isOpen={mostrarModalNueva}
        onClose={cerrarModal}
        title={variacionEditando ? 'Editar Variación' : 'Nueva Variación Automática'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día de la semana
            </label>
            <select
              value={diaSeleccionado}
              onChange={(e) => setDiaSeleccionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona un día</option>
              {diasSemana.map((dia) => (
                <option key={dia.id} value={dia.id}>
                  {dia.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de comida
            </label>
            <select
              value={tipoComidaSeleccionado}
              onChange={(e) => setTipoComidaSeleccionado(e.target.value as TipoComida)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona un tipo</option>
              {tiposComida.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opciones para rotar (mínimo 2)
            </label>
            {opcionesSeleccionadas.length > 0 && (
              <div className="mb-3 space-y-2">
                {opcionesSeleccionadas.map((opcion, index) => (
                  <div
                    key={opcion.id}
                    className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700">
                        Opción {index + 1}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {opcion.nombre}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({opcion.calorias} kcal)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarOpcion(opcion.id)}
                      className="h-6 w-6 p-0 text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
              <p className="text-xs text-gray-500 mb-2">Comidas disponibles:</p>
              {comidasDisponibles.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No hay comidas disponibles. Añade comidas a la dieta primero.
                </p>
              ) : (
                <div className="space-y-2">
                  {comidasDisponibles.map((comida) => (
                    <button
                      key={comida.id}
                      onClick={() => agregarOpcion(comida)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {comida.nombre}
                          </span>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>{comida.calorias} kcal</span>
                            <span>·</span>
                            <span>P: {comida.proteinas}g</span>
                            <span>·</span>
                            <span>H: {comida.carbohidratos}g</span>
                            <span>·</span>
                            <span>G: {comida.grasas}g</span>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {opcionesSeleccionadas.length < 2 && (
              <p className="text-xs text-amber-600 mt-2">
                Selecciona al menos 2 opciones para crear una rotación automática
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={guardarVariacion}
              disabled={!diaSeleccionado || !tipoComidaSeleccionado || opcionesSeleccionadas.length < 2}
            >
              {variacionEditando ? 'Actualizar' : 'Crear'} Variación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

