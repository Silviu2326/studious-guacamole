import React from 'react';
import { useCollaboration, Collaborator } from '../../context/CollaborationContext';

interface CollaboratorHighlightProps {
  elementId: string;
  children: React.ReactNode;
  className?: string;
  type?: 'block' | 'exercise'; // To adjust label positioning if needed
}

export const CollaboratorHighlight: React.FC<CollaboratorHighlightProps> = ({ 
  elementId, 
  children, 
  className = '',
  type = 'block'
}) => {
  const { activeUsers, currentUser, updateSelection } = useCollaboration();

  // Find users who are focused on this element (excluding current user)
  const focusingUsers = activeUsers.filter(u => u.focusedElementId === elementId && u.id !== currentUser?.id);

  // Handler to set current user's focus
  const handleFocus = (e: React.MouseEvent | React.FocusEvent) => {
    // We don't stop propagation to allow normal selection logic to work
    if (currentUser?.focusedElementId !== elementId) {
        updateSelection(elementId);
    }
  };

  if (focusingUsers.length === 0) {
    return (
      <div 
        className={`relative ${className}`} 
        onClickCapture={handleFocus}
        onFocusCapture={handleFocus}
      >
        {children}
      </div>
    );
  }

  // Use the first user's color for the border (handling multiple users on same block is edge case, usually just show one or stack labels)
  const primaryUser = focusingUsers[0];
  const borderColor = primaryUser.color;

  return (
    <div 
      className={`relative ${className} transition-all duration-200`}
      style={{ 
        boxShadow: `0 0 0 2px ${borderColor}`,
        borderRadius: '0.5rem', // Matches rounded-lg usually
        zIndex: 20 // Ensure it pops out
      }}
      onClickCapture={handleFocus}
      onFocusCapture={handleFocus}
    >
      {/* Label */}
      <div 
        className="absolute -top-3 right-4 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm text-[10px] font-bold text-white uppercase tracking-wider animate-in fade-in zoom-in duration-200 slide-in-from-bottom-1"
        style={{ backgroundColor: borderColor }}
      >
        <span>✏️ {primaryUser.name.split(' ')[0]} está editando...</span>
      </div>
      
      {/* Children */}
      {children}
    </div>
  );
};
