import React, { useState } from 'react';
import { Card, Button, MetricCards, Badge } from '../../../components/componentsreutilizables';
import { CodigoPromocional } from '../types';
import {
  Plus,
  Grid3X3,
  List,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Ticket,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Percent,
  Copy,
  CheckCircle2
} from 'lucide-react';

type VistaType = 'grid' | 'list';

// Mock data
const mockCodigos: CodigoPromocional[] = [
  {
    id: '1',
    codigo: 'VERANO2025',
    descripcion: 'Descuento del 15% en todas las compras',
    tipo: 'descuento_porcentaje',
    valor: 15,
    fechaInicio: new Date('2025-01-01'),
    fechaFin: new Date('2025-12-31'),
    activo: true,
    usoMaximo: 500,
    usoActual: 127,
    usoPorCliente: 1,
    minimoCompra: 30,
    fechaCreacion: new Date('2024-12-01'),
    fechaActualizacion: new Date('2024-12-01')
  }
];

export const CodigosPromocionales: React.FC = () => {
  const [codigos] = useState<CodigoPromocional[]>(mockCodigos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<VistaType>('grid');
  const [busqueda, setBusqueda] = useState('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas] = useState(1);
  const [codigoCopiado, setCodigoCopiado] = useState<string | null>(null);

  const totalCodigos = codigos.length;
  const activos = codigos.filter(c => c.activo).length;
  const usados = codigos.filter(c => c.usoActual >= c.usoMaximo).length;

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(fecha));
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCodigoCopiado(codigo);
    setTimeout(() => setCodigoCopiado(null), 2000);
  };

  const generarPaginas = () => {
    const paginas = [];
    const maxPaginas = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginas - 1);
    
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  };

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar códigos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => setError(null)}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {}}>
          <Plus size={20} className="mr-2" />
          Nuevo Código
        </Button>
      </div>

      {/* KPIs */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total códigos',
            value: totalCodigos,
            color: 'info',
          },
          {
            id: 'activos',
            title: 'Activos',
            value: activos,
            color: 'success',
          },
          {
            id: 'usados',
            title: 'Agotados',
            value: usados,
            color: 'warning',
          },
        ]}
      />

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={20} className="text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar códigos por nombre o descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <Button
                variant='secondary'
                onClick={() => setFiltrosAvanzados(!filtrosAvanzados)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
                {filtrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {filtrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Ticket size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9">
                    <option value="">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-3"
                  />
                </div>
              </div>

              {/* Resumen */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>
                  {totalCodigos === 1 ? '1 código encontrado' : `${totalCodigos} códigos encontrados`}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Controles de vista */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {/* Selector de vista */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Vista:</span>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={vista === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setVista('grid')}
                  className="p-2 rounded-none"
                >
                  <Grid3X3 size={16} />
                </Button>
                <Button
                  variant={vista === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setVista('list')}
                  className="p-2 rounded-none"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Información de resultados */}
          <div className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas} ({totalCodigos} códigos)
          </div>
        </div>
      </Card>

      {/* Lista de códigos */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando códigos...</p>
        </Card>
      ) : codigos.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay códigos</h3>
          <p className="text-gray-600 mb-4">
            {busqueda
              ? 'No se encontraron códigos con los filtros aplicados'
              : 'Aún no has creado códigos promocionales'
            }
          </p>
          <Button onClick={() => {}}>
            <Plus size={20} className="mr-2" />
            Crear primer código
          </Button>
        </Card>
      ) : (
        <div className={
          vista === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {codigos.map((codigo) => (
            <Card key={codigo.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
              <div className="flex-1 p-4 flex flex-col">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {codigo.activo ? (
                    <Badge variant="green">Activo</Badge>
                  ) : (
                    <Badge variant="gray">Inactivo</Badge>
                  )}
                  {codigo.usoActual >= codigo.usoMaximo && (
                    <Badge variant="red">Agotado</Badge>
                  )}
                </div>

                {/* Código */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Código:</span>
                    <button
                      onClick={() => copiarCodigo(codigo.codigo)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {codigoCopiado === codigo.codigo ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                  <div className="font-mono font-bold text-lg text-gray-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    {codigo.codigo}
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                  {codigo.descripcion}
                </p>

                {/* Información */}
                <div className="space-y-2 mb-4">
                  {codigo.tipo === 'descuento_porcentaje' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Descuento:</span>
                      <span className="font-semibold text-green-600">{codigo.valor}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha inicio:</span>
                    <span className="text-gray-900">{formatearFecha(codigo.fechaInicio)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha fin:</span>
                    <span className="text-gray-900">{formatearFecha(codigo.fechaFin)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Usos:</span>
                    <span className="text-gray-900">{codigo.usoActual} / {codigo.usoMaximo}</span>
                  </div>
                  {codigo.minimoCompra && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Compra mínima:</span>
                      <span className="text-gray-900">€{codigo.minimoCompra}</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    className="flex-1"
                  >
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaginaActual(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={16} />
              Anterior
            </Button>

            {generarPaginas().map((pagina) => (
              <Button
                key={pagina}
                variant={pagina === paginaActual ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPaginaActual(pagina)}
              >
                {pagina}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

