import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  PromocionesManager,
  CodigosPromocionales,
  GestorCupones,
  DescuentosProductos,
  PacksTienda
} from '../components';
import {
  Tag,
  Ticket,
  Gift,
  Percent,
  ShoppingBag
} from 'lucide-react';

type TabId = 'promociones' | 'codigos' | 'cupones' | 'descuentos' | 'packs';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

export const PromocionesCuponesPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<TabId>('promociones');

  const tabItems: TabItem[] = [
    { id: 'promociones', label: 'Promociones', icon: Tag },
    { id: 'codigos', label: 'Códigos', icon: Ticket },
    { id: 'cupones', label: 'Cupones', icon: Gift },
    { id: 'descuentos', label: 'Descuentos', icon: Percent },
    { id: 'packs', label: 'Packs', icon: ShoppingBag }
  ];

  const renderContent = () => {
    switch (tabActiva) {
      case 'promociones':
        return <PromocionesManager />;
      case 'codigos':
        return <CodigosPromocionales />;
      case 'cupones':
        return <GestorCupones />;
      case 'descuentos':
        return <DescuentosProductos />;
      case 'packs':
        return <PacksTienda />;
      default:
        return <PromocionesManager />;
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
                  <Tag size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Promociones y Cupones
                  </h1>
                  <p className="text-gray-600">
                    Gestiona promociones, códigos descuento, cupones y ofertas especiales
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
              aria-label="Secciones promociones"
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

