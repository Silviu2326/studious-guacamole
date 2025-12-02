import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  status: 'online' | 'idle';
  currentBlockId?: string; // Deprecated, use focusedElementId
  focusedElementId?: string | null; // The element (block/exercise) they are currently editing
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: number;
  resolved?: boolean;
}

interface CollaborationContextType {
  activeUsers: Collaborator[];
  isConnected: boolean;
  currentUser: Collaborator | null;
  comments: Record<string, Comment[]>;
  broadcastBlockUpdate: (blockId: string) => void;
  updateSelection: (elementId: string | null) => void;
  addComment: (elementId: string, text: string) => void;
  resolveThread: (elementId: string) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

// IDs from initial data to simulate realistic activity
const VALID_IDS = ['b1', 'b2', 'b3', 'e1', 'e2', 'e3', 'e4', 'e5'];

const MOCK_USERS: Collaborator[] = [
  { id: 'u1', name: 'Ana García', color: COLORS[0], status: 'online', avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Carlos Ruiz', color: COLORS[1], status: 'online', avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Elena Web', color: COLORS[2], status: 'idle', avatar: 'https://i.pravatar.cc/150?u=u3' },
];

export const CollaborationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<Collaborator>({
    id: 'me',
    name: 'Tú',
    color: COLORS[3],
    status: 'online',
    focusedElementId: null
  });
  
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    'e1': [
        { id: 'c1', authorId: 'u1', text: '¿Podemos bajar el RPE en la última serie?', timestamp: Date.now() - 100000 },
        { id: 'c2', authorId: 'me', text: 'Claro, ajustado a RPE 7.', timestamp: Date.now() - 50000 }
    ]
  });

  // Simulate connection and random user activity
  useEffect(() => {
    // Simulate connect delay
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      setActiveUsers([MOCK_USERS[0]]); // Start with one user
    }, 1000);

    // Simulate users joining/leaving/selecting
    const activityInterval = setInterval(() => {
      setActiveUsers(current => {
        const r = Math.random();
        let nextUsers = [...current];

        if (r > 0.8 && current.length < MOCK_USERS.length) {
          // Add a user
          const nextUser = MOCK_USERS.find(u => !current.find(c => c.id === u.id));
          if (nextUser) nextUsers.push(nextUser);
        } else if (r < 0.1 && current.length > 0) {
          // Remove a user
          nextUsers = current.slice(0, -1);
        } else {
            // Update selection for an existing user
            nextUsers = nextUsers.map(u => {
                if (Math.random() > 0.5) {
                    // Pick a random ID or null
                    const randomId = Math.random() > 0.3 
                        ? VALID_IDS[Math.floor(Math.random() * VALID_IDS.length)]
                        : null;
                    return { ...u, focusedElementId: randomId };
                }
                return u;
            });
        }
        return nextUsers;
      });
    }, 3000); // Updates every 3s

    return () => {
      clearTimeout(connectTimer);
      clearInterval(activityInterval);
    };
  }, []);

  const broadcastBlockUpdate = (blockId: string) => {
    console.log(`[Collaboration] User ${currentUser.id} updated block ${blockId}`);
  };

  const updateSelection = useCallback((elementId: string | null) => {
      setCurrentUser(prev => ({ ...prev, focusedElementId: elementId }));
      // In real app: socket.emit('selection', elementId);
  }, []);

  const addComment = (elementId: string, text: string) => {
      const newComment: Comment = {
          id: `c${Date.now()}`,
          authorId: currentUser.id,
          text,
          timestamp: Date.now()
      };

      setComments(prev => ({
          ...prev,
          [elementId]: [...(prev[elementId] || []), newComment]
      }));
  };

  const resolveThread = (elementId: string) => {
      setComments(prev => {
          const newComments = { ...prev };
          delete newComments[elementId];
          return newComments;
      });
  };

  return (
    <CollaborationContext.Provider value={{ 
        activeUsers, 
        isConnected, 
        currentUser, 
        comments,
        broadcastBlockUpdate, 
        updateSelection,
        addComment,
        resolveThread
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
