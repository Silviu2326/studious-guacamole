import React, { useState } from 'react';
import {
  Offer,
  getOfferTypeLabel,
  getOfferStatusLabel,
  getOfferStatusColor,
  getDiscountTypeLabel
} from '../api/offers';
import { Edit, Eye, Trash2, Tag, Package } from 'lucide-react';

interface OfferListTableProps {
  offers: Offer[];
  onEdit: (offerId: string) => void;
  onViewStats: (offerId: string) => void;
}

export const OfferListTable: React.FC<OfferListTableProps> = ({ offers, onEdit, onViewStats }) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'status'>('name');

  const filteredOffers = offers.filter(offer =>
    offer.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
    offer.code?.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'usage':
        return b.usageCount - a.usageCount;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            placeholder="Buscar por nombre o código..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="name">Ordenar por nombre</option>
          <option value="usage">Ordenar por uso</option>
          <option value="status">Ordenar por estado</option>
        </select>
      </div>

      {/* Table */}
      {sortedOffers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay ofertas</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Oferta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Usos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center gap-2">
                        {offer.type === 'coupon' ? (
                          <Tag className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Package className="w-4 h-4 text-blue-600" />
                        )}
                        <div className="font-semibold text-gray-900">{offer.name}</div>
                      </div>
                      {offer.code && (
                        <div className="text-sm text-gray-600 mt-1">
                          Código: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{offer.code}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getOfferTypeLabel(offer.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {offer.discountValue}
                      {getDiscountTypeLabel(offer.discountType)}
                    </div>
                    {offer.usageLimit && (
                      <div className="text-xs text-gray-600 mt-1">
                        Límite: {offer.usageLimit}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {offer.usageCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getOfferStatusColor(offer.status)}`}>
                      {getOfferStatusLabel(offer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewStats(offer.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Ver estadísticas"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(offer.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta oferta?')) {
                            console.log('Eliminar:', offer.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

