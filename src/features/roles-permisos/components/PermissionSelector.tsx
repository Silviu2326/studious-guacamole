import React from 'react';
import { PermissionGroup } from '../types';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';

export interface PermissionSelectorProps {
  permissionGroups: PermissionGroup[];
  selectedPermissions: string[];
  onChange: (newSelectedPermissions: string[]) => void;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  permissionGroups,
  selectedPermissions,
  onChange,
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(permissionGroups.map(group => group.groupName))
  );

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const togglePermission = (permissionSlug: string) => {
    const newSelected = selectedPermissions.includes(permissionSlug)
      ? selectedPermissions.filter(p => p !== permissionSlug)
      : [...selectedPermissions, permissionSlug];
    onChange(newSelected);
  };

  const toggleAllInGroup = (group: PermissionGroup) => {
    const groupPermissions = group.permissions.map(p => p.slug);
    const allSelected = groupPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      // Deseleccionar todos
      onChange(selectedPermissions.filter(p => !groupPermissions.includes(p)));
    } else {
      // Seleccionar todos
      const toAdd = groupPermissions.filter(p => !selectedPermissions.includes(p));
      onChange([...selectedPermissions, ...toAdd]);
    }
  };

  return (
    <div className="space-y-2">
      {permissionGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.groupName);
        const groupPermissions = group.permissions.map(p => p.slug);
        const selectedCount = groupPermissions.filter(p => selectedPermissions.includes(p)).length;
        const allSelected = selectedCount === groupPermissions.length;

        return (
          <div
            key={group.groupName}
            className="border border-slate-200 rounded-xl overflow-hidden transition-all"
          >
            {/* Grupo Header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer bg-slate-100 hover:bg-slate-200 transition-all"
              onClick={() => toggleGroup(group.groupName)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown size={20} className="text-slate-600" />
                ) : (
                  <ChevronRight size={20} className="text-slate-600" />
                )}
                <h3 className="text-base font-semibold text-gray-900">
                  {group.groupName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {selectedCount}/{groupPermissions.length}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleAllInGroup(group);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600">
                    Todos
                  </span>
                </div>
              </div>
            </div>

            {/* Permisos List */}
            {isExpanded && (
              <div className="border-t border-slate-200 bg-white">
                {group.permissions.map((permission) => (
                  <label
                    key={permission.slug}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-200 last:border-b-0 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.slug)}
                      onChange={() => togglePermission(permission.slug)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {selectedPermissions.includes(permission.slug) && (
                          <Check size={16} className="text-blue-600" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {permission.label || permission.slug}
                        </span>
                      </div>
                      {permission.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

