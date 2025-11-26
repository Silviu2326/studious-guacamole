import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import {
  Camera,
  Upload,
  Grid3X3,
  List,
  Calendar,
  Search,
  Filter,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import type { FotoComparativa } from '../types';

export const FotosComparativas: React.FC = () => {
  const [vista, setVista] = useState<'grid' | 'list'>('grid');
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  // Datos de ejemplo
  const fotosEjemplo: FotoComparativa[] = [
    {
      id: '1',
      progresoId: 'p1',
      tipo: 'frente',
      url: '/fotos/frente-1.jpg',
      fecha: '2025-01-15',
      etiquetas: ['progreso', 'mes-1'],
    },
    {
      id: '2',
      progresoId: 'p1',
      tipo: 'lado',
      url: '/fotos/lado-1.jpg',
      fecha: '2025-01-15',
      etiquetas: ['progreso'],
    },
    {
      id: '3',
      progresoId: 'p1',
      tipo: 'espalda',
      url: '/fotos/espalda-1.jpg',
      fecha: '2024-12-15',
      etiquetas: ['inicio'],
    },
  ];

  const getTipoLabel = (tipo: FotoComparativa['tipo']) => {
    switch (tipo) {
      case 'frente':
        return 'Frente';
      case 'lado':
        return 'Lado';
      case 'espalda':
        return 'Espalda';
      case 'detalle':
        return 'Detalle';
    }
  };

  const fotosFiltradas =
    tipoFiltro === 'todos'
      ? fotosEjemplo
      : fotosEjemplo.filter((f) => f.tipo === tipoFiltro);

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {}} leftIcon={<Upload size={20} />}>
          Subir Fotos
        </Button>
      </div>

      {/* Sistema de Filtros y Controles */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar fotos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
            />
          </div>

          {/* Selector de tipo */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="todos">Todos</option>
              <option value="frente">Frente</option>
              <option value="lado">Lado</option>
              <option value="espalda">Espalda</option>
              <option value="detalle">Detalle</option>
            </select>
          </div>

          {/* Selector de vista */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Vista:</span>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setVista('grid')}
                className={`p-2 transition-all ${
                  vista === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setVista('list')}
                className={`p-2 transition-all border-l ${
                  vista === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid/Lista de Fotos */}
      {vista === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fotosFiltradas.map((foto) => (
            <Card
              key={foto.id}
              variant="hover"
              className="h-full flex flex-col transition-shadow overflow-hidden"
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                    {getTipoLabel(foto.tipo)}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar size={14} />
                  {new Date(foto.fecha).toLocaleDateString('es-ES')}
                </div>
                {foto.etiquetas && foto.etiquetas.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {foto.etiquetas.map((etiqueta, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-lg"
                      >
                        {etiqueta}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <Button variant="primary" size="sm" className="flex-1">
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm">
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {fotosFiltradas.map((foto) => (
            <Card key={foto.id} variant="hover" className="transition-shadow">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getTipoLabel(foto.tipo)}
                      </h3>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(foto.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {foto.etiquetas && foto.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {foto.etiquetas.map((etiqueta, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-lg"
                          >
                            {etiqueta}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm">
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {fotosFiltradas.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Camera size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay fotos comparativas
          </h3>
          <p className="text-gray-600 mb-4">
            Sube fotos para hacer seguimiento visual del progreso
          </p>
          <Button onClick={() => {}} leftIcon={<Upload size={20} />}>
            Subir Primera Foto
          </Button>
        </Card>
      )}
    </div>
  );
};

