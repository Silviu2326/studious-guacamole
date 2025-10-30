import React, { useState } from 'react';
import { Card } from '../../components/componentsreutilizables';
import {
  CatalogoProductos,
  GestorCategorias,
  EstadisticasProductos
} from './components';
import {
  Package,
  Tag,
  BarChart3,
  ShoppingBag
} from 'lucide-react';

type TabId = 'catalogo' | 'categorias' | 'estadisticas';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

export const CatalogoProductosPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<TabId>('catalogo');

  const tabItems: TabItem[] = [
    { id: 'catalogo',   label: 'Catálogo',     icon: Package },
    { id: 'categorias', label: 'Categorías',   icon: Tag },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 }
  ];

  const renderContent = () => {
    switch (tabActiva) {
      case 'catalogo':
        return <CatalogoProductos />;
      case 'categorias':
        return <GestorCategorias />;
      case 'estadisticas':
        return <EstadisticasProductos />;
      default:
        return <CatalogoProductos />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ShoppingBag size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Catálogo de Productos
                  </h1>
                  <p className="text-gray-600">
                    Gestiona el inventario completo de productos del gimnasio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <Card className="p-0 bg-white shadow-sm">
          {/* Tablist claro */}
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones catálogo"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabItems.map(({ id, label, icon: Icon }) => {
                const activo = tabActiva === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setTabActiva(id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    <Icon
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
