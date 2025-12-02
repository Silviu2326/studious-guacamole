import React from 'react';
import { Select, SelectOption } from '../../../components/componentsreutilizables';
import { Branch } from '../types';
import { Building2 } from 'lucide-react';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId: string | null;
  onSelectBranch: (branchId: string) => void;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
}) => {
  const options: SelectOption[] = [
    {
      value: '',
      label: 'Selecciona una sede',
      disabled: true,
    },
    ...branches.map(branch => ({
      value: branch.id,
      label: `${branch.name} - ${branch.location}`,
    })),
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <Building2 size={16} className="inline mr-1" />
        Seleccionar Sede
      </label>
      <Select
        value={selectedBranchId || ''}
        onChange={(e) => {
          const branchId = e.target.value;
          if (branchId) {
            onSelectBranch(branchId);
          }
        }}
        options={options}
        placeholder="Selecciona una sede"
      />
    </div>
  );
};
