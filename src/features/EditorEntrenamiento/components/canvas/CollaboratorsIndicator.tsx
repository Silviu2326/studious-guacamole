import React from 'react';
import { Users } from 'lucide-react';
import { useCollaboration } from '../../context/CollaborationContext';

export const CollaboratorsIndicator: React.FC = () => {
  const { activeUsers, isConnected } = useCollaboration();

  if (!isConnected) {
    return null; // Or return a loading state/offline indicator
  }

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
      <div className="flex -space-x-2 overflow-hidden">
        {activeUsers.map((user) => (
          <div 
            key={user.id} 
            className="relative inline-block h-6 w-6 rounded-full ring-2 ring-white"
            title={`${user.name} (${user.status === 'online' ? 'Conectado' : 'Ausente'})`}
          >
             {user.avatar ? (
               <img 
                 src={user.avatar} 
                 alt={user.name} 
                 className="h-full w-full rounded-full object-cover"
               />
             ) : (
               <div 
                className="h-full w-full rounded-full flex items-center justify-center text-xs text-white font-medium"
                style={{ backgroundColor: user.color }}
               >
                 {user.name.charAt(0)}
               </div>
             )}
             <span 
               className={`absolute bottom-0 right-0 block h-1.5 w-1.5 rounded-full ring-1 ring-white ${user.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`} 
             />
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
        <Users size={14} />
        <span>{activeUsers.length > 0 ? `${activeUsers.length} online` : 'Solo tú'}</span>
      </div>
    </div>
  );
};
