import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Modal } from '../../../components/componentsreutilizables';
import {
  ShoppingCart,
  Filter,
  Calendar,
  Users,
  UtensilsCrossed,
  Download,
  CheckCircle2,
  X,
  Sparkles,
  ChefHat,
  Plus,
  Trash2,
  Edit,
  Euro,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  generarListaCompra,
  aplicarMultiplicadorLista,
  añadirSugerenciaMealPrep,
  actualizarSugerenciaMealPrep,
  eliminarSugerenciaMealPrep,
  calcularCosteSemanal,
  obtenerPresupuestoCliente,
} from '../api/listaCompra';
import {
  ListaCompra,
  FiltrosGeneracionListaCompra,
  CategoriaAlimento,
  TipoComida,
  Dieta,
  SugerenciaMealPrep,
} from '../types';
import { getDietas } from '../api';

interface GeneradorListaCompraProps {
  clienteId?: string;
  dietaId?: string;
  onListaGenerada?: (lista: ListaCompra) => void;
}

const CATEGORIAS_LABELS: Record<CategoriaAlimento, string> = {
  'frutas': '🍎 Frutas',
  'verduras': '🥬 Verduras',
  'proteinas': '🍗 Proteínas',
  'carbohidratos': '🍞 Carbohidratos',
  'lacteos': '🥛 Lácteos',
  'despensa': '📦 Despensa',
  'condimentos': '🧂 Condimentos',
  'bebidas': '🥤 Bebidas',
  'frutos-secos': '🥜 Frutos Secos',
  'aceites-grasas': '🫒 Aceites y Grasas',
  'otros': '📋 Otros',
};

const TIPOS_COMIDA_LABELS: Record<TipoComida, string> = {
  'desayuno': 'Desayuno',
  'media-manana': 'Media Mañana',
  'almuerzo': 'Almuerzo',
  'merienda': 'Merienda',
  'cena': 'Cena',
  'post-entreno': 'Post Entreno',
};

export const GeneradorListaCompra: React.FC<GeneradorListaCompraProps> = ({
  clienteId: clienteIdProp,
  dietaId: dietaIdProp,
  onListaGenerada,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [listaCompra, setListaCompra] = useState<ListaCompra | null>(null);
  const [dietas, setDietas] = useState<Dieta[]>([]);
  
  // Filtros
  const [clienteId, setClienteId] = useState<string>(clienteIdProp || '');
  const [dietaId, setDietaId] = useState<string>(dietaIdProp || '');
  const [tipoFiltro, setTipoFiltro] = useState<'cliente' | 'semana' | 'tipo-comida' | 'completa'>('completa');
  const [semanaNumero, setSemanaNumero] = useState<number>(1);
  const [tiposComida, setTiposComida] = useState<TipoComida[]>([]);
  const [numeroPersonas, setNumeroPersonas] = useState<number>(1);
  const [numeroRaciones, setNumeroRaciones] = useState<number>(1);
  // User Story 1: Estado para sugerencias de meal prep
  const [mostrarModalMealPrep, setMostrarModalMealPrep] = useState(false);
  const [nuevaSugerencia, setNuevaSugerencia] = useState({ dia: 'lunes', descripcion: '', prioridad: 'media' as 'alta' | 'media' | 'baja' });
  // User Story 2: Estado para presupuesto
  const [presupuestoSemanal, setPresupuestoSemanal] = useState<number | undefined>(undefined);
  const [mostrarConfigPresupuesto, setMostrarConfigPresupuesto] = useState(false);

  useEffect(() => {
    if (mostrarModal) {
      cargarDietas();
    }
  }, [mostrarModal]);

  const cargarDietas = async () => {
    try {
      const dietasData = await getDietas({ clienteId: clienteIdProp });
      setDietas(dietasData);
      if (dietasData.length > 0 && !dietaId) {
        setDietaId(dietasData[0].id);
      }
    } catch (error) {
      console.error('Error cargando dietas:', error);
    }
  };

  const handleGenerar = async () => {
    if (!dietaId) {
      alert('Por favor selecciona una dieta');
      return;
    }

    setGenerando(true);
    try {
      const filtros: FiltrosGeneracionListaCompra = {
        clienteId: clienteId || clienteIdProp,
        dietaId,
        tipoFiltro,
        semanaNumero: tipoFiltro === 'semana' ? semanaNumero : undefined,
        tiposComida: tipoFiltro === 'tipo-comida' && tiposComida.length > 0 ? tiposComida : undefined,
        numeroPersonas,
        numeroRaciones,
      };

      const lista = await generarListaCompra(filtros);
      if (lista) {
        setListaCompra(lista);
        onListaGenerada?.(lista);
        setMostrarModal(false);
        
        // User Story 2: Obtener presupuesto del cliente si está disponible
        if (lista.clienteId && lista.dietaId) {
          const presupuesto = await obtenerPresupuestoCliente(lista.clienteId, lista.dietaId);
          if (presupuesto) {
            setPresupuestoSemanal(presupuesto);
            // Recalcular coste con presupuesto
            const listaConCoste = {
              ...lista,
              calculoCoste: calcularCosteSemanal(lista, presupuesto),
            };
            setListaCompra(listaConCoste);
          }
        }
      } else {
        alert('Error al generar la lista de compra');
      }
    } catch (error) {
      console.error('Error generando lista:', error);
      alert('Error al generar la lista de compra');
    } finally {
      setGenerando(false);
    }
  };

  const handleAjustarRaciones = (nuevoMultiplicador: number) => {
    if (!listaCompra) return;
    
    const listaAjustada = aplicarMultiplicadorLista(listaCompra, nuevoMultiplicador);
    setListaCompra(listaAjustada);
    setNumeroPersonas(listaAjustada.ajustes?.numeroPersonas || 1);
  };

  const toggleTipoComida = (tipo: TipoComida) => {
    setTiposComida(prev => 
      prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    );
  };

  const exportarLista = () => {
    if (!listaCompra) return;
    
    let texto = `LISTA DE COMPRA\n`;
    texto += `Cliente: ${listaCompra.clienteNombre || 'N/A'}\n`;
    texto += `Dieta: ${listaCompra.dietaNombre || 'N/A'}\n`;
    if (listaCompra.ajustes) {
      texto += `Personas: ${listaCompra.ajustes.numeroPersonas}\n`;
      texto += `Raciones: ${listaCompra.ajustes.numeroRaciones}\n`;
    }
    texto += `\n${'='.repeat(50)}\n\n`;

    Object.entries(listaCompra.itemsPorCategoria).forEach(([categoria, items]) => {
      if (items.length > 0) {
        texto += `${CATEGORIAS_LABELS[categoria as CategoriaAlimento]}\n`;
        texto += `${'-'.repeat(50)}\n`;
        items.forEach(item => {
          texto += `  • ${item.nombre}: ${item.cantidad} ${item.unidad}\n`;
        });
        texto += `\n`;
      }
    });

    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-compra-${listaCompra.clienteNombre || 'cliente'}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dietasOptions = dietas.map(d => ({
    value: d.id,
    label: `${d.nombre}${d.clienteNombre ? ` - ${d.clienteNombre}` : ''}`,
  }));

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Lista de Compra
            </h2>
          </div>
          <Button onClick={() => setMostrarModal(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generar Lista
          </Button>
        </div>

        {listaCompra ? (
          <div className="space-y-4">
            {/* Resumen */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {listaCompra.clienteNombre || 'Cliente'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setListaCompra(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                {listaCompra.dietaNombre || 'Dieta'}
              </p>
              {listaCompra.ajustes && (
                <p className="text-sm text-gray-600">
                  {listaCompra.ajustes.numeroPersonas} persona(s) × {listaCompra.ajustes.numeroRaciones} ración(es)
                </p>
              )}
              <p className="text-sm text-gray-600">
                {listaCompra.totalItems} items en {listaCompra.totalCategorias} categorías
              </p>
            </div>

            {/* Ajustador de raciones */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ajustar para número de personas:
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={numeroPersonas}
                    onChange={(e) => {
                      const nuevo = parseInt(e.target.value) || 1;
                      setNumeroPersonas(nuevo);
                      if (listaCompra) {
                        const multiplicador = nuevo / (listaCompra.ajustes?.numeroPersonas || 1);
                        handleAjustarRaciones(multiplicador);
                      }
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">persona(s)</span>
                  <Input
                    type="number"
                    min="1"
                    value={numeroRaciones}
                    onChange={(e) => {
                      const nuevo = parseInt(e.target.value) || 1;
                      setNumeroRaciones(nuevo);
                      if (listaCompra) {
                        const multiplicador = (numeroPersonas * nuevo) / 
                          ((listaCompra.ajustes?.numeroPersonas || 1) * (listaCompra.ajustes?.numeroRaciones || 1));
                        handleAjustarRaciones(multiplicador);
                      }
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">ración(es) por persona</span>
                </div>
              </div>
            </div>

            {/* Lista agrupada por categorías */}
            <div className="space-y-4">
              {Object.entries(listaCompra.itemsPorCategoria).map(([categoria, items]) => {
                if (items.length === 0) return null;
                
                return (
                  <Card key={categoria} className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {CATEGORIAS_LABELS[categoria as CategoriaAlimento]}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">
                              {item.nombre}
                            </span>
                            {item.notas && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({item.notas})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">
                              {item.cantidad} {item.unidad}
                            </span>
                            <button
                              onClick={() => {
                                const nuevosItems = listaCompra.items.map(i =>
                                  i.id === item.id ? { ...i, adquirido: !i.adquirido } : i
                                );
                                const nuevosItemsPorCategoria = {
                                  ...listaCompra.itemsPorCategoria,
                                  [categoria]: items.map(i =>
                                    i.id === item.id ? { ...i, adquirido: !i.adquirido } : i
                                  ),
                                };
                                setListaCompra({
                                  ...listaCompra,
                                  items: nuevosItems,
                                  itemsPorCategoria: nuevosItemsPorCategoria,
                                });
                              }}
                              className={`p-1 rounded ${
                                item.adquirido
                                  ? 'text-green-600 bg-green-50'
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>

            {/* User Story 1: Sugerencias de Meal Prep */}
            <Card className="p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sugerencias de Meal Prep
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setMostrarModalMealPrep(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Sugerencia
                </Button>
              </div>
              
              {listaCompra.sugerenciasMealPrep && listaCompra.sugerenciasMealPrep.length > 0 ? (
                <div className="space-y-2">
                  {listaCompra.sugerenciasMealPrep.map((sugerencia) => (
                    <div
                      key={sugerencia.id}
                      className={`flex items-start justify-between p-3 rounded-lg border ${
                        sugerencia.completada ? 'bg-gray-50 opacity-60' : 'bg-white'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {sugerencia.dia}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              sugerencia.prioridad === 'alta'
                                ? 'bg-red-100 text-red-700'
                                : sugerencia.prioridad === 'media'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {sugerencia.prioridad}
                          </span>
                        </div>
                        <p className={`text-sm ${sugerencia.completada ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {sugerencia.descripcion}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            if (listaCompra) {
                              const actualizada = actualizarSugerenciaMealPrep(
                                listaCompra,
                                sugerencia.id,
                                { completada: !sugerencia.completada }
                              );
                              setListaCompra(actualizada);
                            }
                          }}
                          className={`p-1 rounded ${
                            sugerencia.completada
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (listaCompra) {
                              const actualizada = eliminarSugerenciaMealPrep(listaCompra, sugerencia.id);
                              setListaCompra(actualizada);
                            }
                          }}
                          className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay sugerencias de meal prep. Haz clic en "Añadir Sugerencia" para crear una.
                </p>
              )}
            </Card>

            {/* User Story 2: Cálculo de Coste y Presupuesto */}
            {listaCompra.calculoCoste && (
              <Card className="p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Coste Semanal Estimado
                    </h3>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMostrarConfigPresupuesto(true)}
                  >
                    Configurar Presupuesto
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Coste Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {listaCompra.calculoCoste.costeTotal.toFixed(2)} €
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Por Día</p>
                    <p className="text-2xl font-bold text-green-600">
                      {listaCompra.calculoCoste.costePorDia.toFixed(2)} €
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Por Comida</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {listaCompra.calculoCoste.costePorComida.toFixed(2)} €
                    </p>
                  </div>
                </div>

                {/* Comparación con presupuesto */}
                {listaCompra.calculoCoste.comparacionPresupuesto && (
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      listaCompra.calculoCoste.comparacionPresupuesto.excedePresupuesto
                        ? 'bg-red-50 border-red-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {listaCompra.calculoCoste.comparacionPresupuesto.excedePresupuesto ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        <h4 className="font-semibold text-gray-900">
                          Comparación con Presupuesto
                        </h4>
                      </div>
                      {listaCompra.calculoCoste.comparacionPresupuesto.excedePresupuesto ? (
                        <TrendingUp className="w-5 h-5 text-red-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Presupuesto Semanal</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {listaCompra.calculoCoste.comparacionPresupuesto.presupuesto.toFixed(2)} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          {listaCompra.calculoCoste.comparacionPresupuesto.excedePresupuesto
                            ? 'Exceso'
                            : 'Ahorro'}
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            listaCompra.calculoCoste.comparacionPresupuesto.excedePresupuesto
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {listaCompra.calculoCoste.comparacionPresupuesto.excedePresupuesto ? '+' : ''}
                          {Math.abs(listaCompra.calculoCoste.comparacionPresupuesto.diferencia).toFixed(2)} €
                          ({listaCompra.calculoCoste.comparacionPresupuesto.porcentaje.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    {listaCompra.calculoCoste.comparacionPresupuesto.excedePresupuesto && (
                      <div className="mt-3 p-3 bg-red-100 rounded">
                        <p className="text-sm text-red-800">
                          ⚠️ El coste estimado excede el presupuesto. Considera ajustar el plan nutricional.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Botón exportar */}
            <div className="flex justify-end mt-4">
              <Button onClick={exportarLista} variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                Exportar Lista
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Genera una lista de compra personalizada basada en las dietas asignadas.
            Puedes filtrar por cliente, semana o tipo de comida, y ajustar las cantidades según el número de personas.
          </p>
        )}
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Generar Lista de Compra"
        size="lg"
      >
        <div className="space-y-4">
          {/* Selección de dieta */}
          <Select
            label="Dieta"
            options={dietasOptions}
            value={dietaId}
            onChange={(e) => setDietaId(e.target.value)}
            placeholder="Selecciona una dieta"
          />

          {/* Tipo de filtro */}
          <Select
            label="Filtrar por"
            options={[
              { value: 'completa', label: 'Dieta completa' },
              { value: 'semana', label: 'Por semana' },
              { value: 'tipo-comida', label: 'Por tipo de comida' },
            ]}
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value as any)}
          />

          {/* Filtro por semana */}
          {tipoFiltro === 'semana' && (
            <Input
              label="Número de semana"
              type="number"
              min="1"
              value={semanaNumero}
              onChange={(e) => setSemanaNumero(parseInt(e.target.value) || 1)}
            />
          )}

          {/* Filtro por tipo de comida */}
          {tipoFiltro === 'tipo-comida' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipos de comida
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TIPOS_COMIDA_LABELS) as TipoComida[]).map((tipo) => (
                  <label
                    key={tipo}
                    className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={tiposComida.includes(tipo)}
                      onChange={() => toggleTipoComida(tipo)}
                      className="rounded"
                    />
                    <span className="text-sm">{TIPOS_COMIDA_LABELS[tipo]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Número de personas */}
          <Input
            label="Número de personas"
            type="number"
            min="1"
            value={numeroPersonas}
            onChange={(e) => setNumeroPersonas(parseInt(e.target.value) || 1)}
            helperText="Cantidad de personas para las que se generará la lista"
          />

          {/* Número de raciones */}
          <Input
            label="Raciones por persona"
            type="number"
            min="1"
            value={numeroRaciones}
            onChange={(e) => setNumeroRaciones(parseInt(e.target.value) || 1)}
            helperText="Número de raciones por persona (por defecto 1)"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setMostrarModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGenerar}
              loading={generando}
              disabled={!dietaId}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Generar Lista
            </Button>
          </div>
        </div>
      </Modal>

      {/* User Story 1: Modal para añadir sugerencia de meal prep */}
      <Modal
        isOpen={mostrarModalMealPrep}
        onClose={() => {
          setMostrarModalMealPrep(false);
          setNuevaSugerencia({ dia: 'lunes', descripcion: '', prioridad: 'media' });
        }}
        title="Añadir Sugerencia de Meal Prep"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Día de la semana"
            options={[
              { value: 'lunes', label: 'Lunes' },
              { value: 'martes', label: 'Martes' },
              { value: 'miércoles', label: 'Miércoles' },
              { value: 'jueves', label: 'Jueves' },
              { value: 'viernes', label: 'Viernes' },
              { value: 'sábado', label: 'Sábado' },
              { value: 'domingo', label: 'Domingo' },
            ]}
            value={nuevaSugerencia.dia}
            onChange={(e) => setNuevaSugerencia({ ...nuevaSugerencia, dia: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ej: Prepara 3 raciones de pollo el lunes"
              value={nuevaSugerencia.descripcion}
              onChange={(e) => setNuevaSugerencia({ ...nuevaSugerencia, descripcion: e.target.value })}
            />
          </div>

          <Select
            label="Prioridad"
            options={[
              { value: 'alta', label: 'Alta' },
              { value: 'media', label: 'Media' },
              { value: 'baja', label: 'Baja' },
            ]}
            value={nuevaSugerencia.prioridad}
            onChange={(e) => setNuevaSugerencia({ ...nuevaSugerencia, prioridad: e.target.value as 'alta' | 'media' | 'baja' })}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setMostrarModalMealPrep(false);
                setNuevaSugerencia({ dia: 'lunes', descripcion: '', prioridad: 'media' });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (listaCompra && nuevaSugerencia.descripcion.trim()) {
                  const actualizada = añadirSugerenciaMealPrep(listaCompra, nuevaSugerencia);
                  setListaCompra(actualizada);
                  setMostrarModalMealPrep(false);
                  setNuevaSugerencia({ dia: 'lunes', descripcion: '', prioridad: 'media' });
                }
              }}
              disabled={!nuevaSugerencia.descripcion.trim()}
            >
              Añadir Sugerencia
            </Button>
          </div>
        </div>
      </Modal>

      {/* User Story 2: Modal para configurar presupuesto */}
      <Modal
        isOpen={mostrarConfigPresupuesto}
        onClose={() => setMostrarConfigPresupuesto(false)}
        title="Configurar Presupuesto Semanal"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Presupuesto Semanal (€)"
            type="number"
            min="0"
            step="0.01"
            value={presupuestoSemanal || ''}
            onChange={(e) => setPresupuestoSemanal(parseFloat(e.target.value) || undefined)}
            helperText="Ingresa el presupuesto semanal del cliente en euros"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setMostrarConfigPresupuesto(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (listaCompra && presupuestoSemanal !== undefined) {
                  const listaConCoste = {
                    ...listaCompra,
                    calculoCoste: calcularCosteSemanal(listaCompra, presupuestoSemanal),
                  };
                  setListaCompra(listaConCoste);
                  setMostrarConfigPresupuesto(false);
                }
              }}
              disabled={presupuestoSemanal === undefined || presupuestoSemanal <= 0}
            >
              Guardar Presupuesto
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

