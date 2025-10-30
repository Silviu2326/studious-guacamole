import React, { useState } from 'react';
import { Tabs } from '../../components/componentsreutilizables';
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

export const CatalogoProductosPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('catalogo');

  const tabItems = [
    {
      id: 'catalogo',
      label: 'Catálogo',
      icon: <Package size={20} />
    },
    {
      id: 'categorias',
      label: 'Categorías',
      icon: <Tag size={20} />
    },
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: <BarChart3 size={20} />
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <ShoppingBag size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          items={tabItems}
          activeTab={tabActiva}
          onTabChange={setTabActiva}
          variant="pills"
        />
        
        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};