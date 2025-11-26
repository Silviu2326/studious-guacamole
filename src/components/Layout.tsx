import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeView?: string;
  onViewChange?: (view: string) => void;
  hideSidebar?: boolean;
}

export function Layout({ children, activeView, onViewChange, hideSidebar = false }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {!hideSidebar && (
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeView={activeView}
          onViewChange={onViewChange}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
