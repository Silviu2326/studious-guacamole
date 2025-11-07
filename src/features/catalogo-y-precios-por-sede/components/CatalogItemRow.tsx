import React from 'react';
import { Badge, Button } from '../../../components/componentsreutilizables';
import { CatalogItem } from '../types';
import { ds } from '../../adherencia/ui/ds';
import { Edit, RotateCcw, Package, Dumbbell, ShoppingBag, Wrench } from 'lucide-react';

interface CatalogItemRowProps {
  item: CatalogItem;
  onEdit: (itemId: string) => void;
  onRevert?: (itemId: string) => void;
}

const getTypeIcon = (type: CatalogItem['type']) => {
  switch (type) {
    case 'membership':
      return <Package className="w-4 h-4" />;
    case 'class':
      return <Dumbbell className="w-4 h-4" />;
    case 'product':
      return <ShoppingBag className="w-4 h-4" />;
    case 'service':
      return <Wrench className="w-4 h-4" />;
    default:
      return null;
  }
};

const getTypeLabel = (type: CatalogItem['type']) => {
  switch (type) {
    case 'membership':
      return 'Membresía';
    case 'class':
      return 'Clase';
    case 'product':
      return 'Producto';
    case 'service':
      return 'Servicio';
    default:
      return type;
  }
};

const getStatusBadge = (status: CatalogItem['status']) => {
  switch (status) {
    case 'master':
      return <Badge variant="gray" size="sm">Heredado</Badge>;
    case 'override':
      return <Badge variant="blue" size="sm">Sobrescrito</Badge>;
    case 'exclusive':
      return <Badge variant="green" size="sm">Exclusivo</Badge>;
    default:
      return null;
  }
};

export const CatalogItemRow: React.FC<CatalogItemRowProps> = ({
  item,
  onEdit,
  onRevert,
}) => {
  const hasOverride = item.status === 'override';
  const showRevert = hasOverride && onRevert;

  return (
    <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#1E1E2E] border-b border-[#E2E8F0] dark:border-[#334155]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-purple-600">
            {getTypeIcon(item.type)}
          </div>
          <div>
            <div className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {item.name}
            </div>
            <div className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              {getTypeLabel(item.type)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(item.status)}
      </td>
      <td className="px-6 py-4">
        <div className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {item.status === 'exclusive' ? '-' : `€${item.masterPrice.toFixed(2)}`}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`${ds.typography.body} font-semibold ${
          hasOverride && item.branchPrice !== item.masterPrice
            ? 'text-blue-600 dark:text-blue-400'
            : ds.color.textPrimary + ' ' + ds.color.textPrimaryDark
        }`}>
          €{item.branchPrice.toFixed(2)}
        </div>
        {hasOverride && item.branchPrice !== item.masterPrice && (
          <div className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            {item.branchPrice > item.masterPrice ? '+' : ''}
            {(((item.branchPrice - item.masterPrice) / item.masterPrice) * 100).toFixed(1)}%
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <Badge
          variant={item.isActive ? 'green' : 'red'}
          size="sm"
        >
          {item.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item.itemId)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          {showRevert && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRevert!(item.itemId)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Revertir
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};
