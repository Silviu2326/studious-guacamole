import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleScroll = () => {
        onClose(); 
    };

    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <div 
      ref={menuRef}
      className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[180px] animate-in fade-in zoom-in-95 duration-100 select-none"
      style={{ top: y, left: x }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, index) => {
        if (item.separator) {
           return <div key={index} className="h-px bg-gray-100 my-1" />;
        }
        return (
          <button
            key={index}
            className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors
              ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              onClose(); // Close menu after action
            }}
          >
            {item.icon && <span className="w-4 h-4 flex items-center justify-center text-gray-400 group-hover:text-inherit">{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>,
    document.body
  );
};
