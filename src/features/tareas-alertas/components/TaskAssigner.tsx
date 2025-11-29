import React, { useState } from 'react';
import { Card, Button, Select, Input } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Task, UserRole } from '../types';
import { updateTask } from '../api';
import { Users, UserPlus } from 'lucide-react';

interface TaskAssignerProps {
  role: UserRole;
  task: Task;
  onAssign?: () => void;
}

// Mock users - en producción vendría de la API
const mockUsers = [
  { id: 'user1', name: 'Juan Pérez', role: 'entrenador' },
  { id: 'user2', name: 'María García', role: 'entrenador' },
  { id: 'user3', name: 'Admin Gimnasio', role: 'gimnasio' },
  { id: 'user4', name: 'Staff 1', role: 'gimnasio' },
  { id: 'user5', name: 'Staff 2', role: 'gimnasio' },
];

export const TaskAssigner: React.FC<TaskAssignerProps> = ({ role, task, onAssign }) => {
  const [selectedUser, setSelectedUser] = useState(task.assignedTo || '');
  const [loading, setLoading] = useState(false);

  const availableUsers = mockUsers.filter(user => 
    role === 'gimnasio' || (role === 'entrenador' && user.id === task.assignedTo)
  );

  const userOptions = availableUsers.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const handleAssign = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await updateTask(task.id, { assignedTo: selectedUser });
      onAssign?.();
    } catch (error) {
      console.error('Error asignando tarea:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <UserPlus className="w-5 h-5 text-gray-600" />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Asignar Tarea
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Tarea
          </label>
          <Input
            value={task.title}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div>
          <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Asignar a
          </label>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            options={userOptions}
          />
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleAssign}
          loading={loading}
          disabled={!selectedUser || selectedUser === task.assignedTo}
        >
          <Users className="w-4 h-4 mr-2" />
          Asignar Tarea
        </Button>

        {task.assignedToName && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Actualmente asignada a: <strong>{task.assignedToName}</strong>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

