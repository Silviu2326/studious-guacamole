import React, { useState } from 'react';
import { MessageSquare, BarChart2, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

type FitCoachTab = 'chat' | 'insights' | 'alerts' | 'metrics';

export const FitCoachPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FitCoachTab>('chat');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Definición de las tabs para mapeo dinámico
  const tabs: { id: FitCoachTab; label: string; icon: React.ReactNode }[] = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'alerts', label: 'Alertas', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'metrics', label: 'Métricas', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  // Estado Colapsado (Sección 1.2)
  if (isCollapsed) {
    return (
      <aside className="w-12 border-l border-gray-200 bg-white flex flex-col items-center py-4 gap-6 h-full transition-all duration-300 ease-in-out relative z-20">
        <button 
            onClick={() => setIsCollapsed(false)} 
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 mb-2"
            title="Expandir"
        >
             <ChevronLeft className="w-5 h-5" />
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsCollapsed(false);
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
            title={tab.label}
          >
            {tab.icon}
          </button>
        ))}
      </aside>
    );
  }

  // Estado Expandido (Sección 1.1)
  return (
    <aside className="w-80 border-l border-gray-200 bg-white flex flex-col h-full transition-all duration-300 ease-in-out relative z-20">
      
      {/* Header: Tabs & Collapse Toggle */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex-1 flex">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 flex justify-center items-center hover:bg-gray-50 transition-colors border-b-2 ${
                        activeTab === tab.id 
                            ? 'border-indigo-600 text-indigo-600' 
                            : 'border-transparent text-gray-500'
                    }`}
                    title={tab.label}
                >
                    {tab.icon}
                </button>
            ))}
        </div>
        {/* Botón para colapsar */}
        <button 
            onClick={() => setIsCollapsed(true)}
            className="p-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 border-l border-gray-200"
            title="Colapsar panel"
        >
            <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      {/* Body Scrollable (Contenedor dinámico según tab) */}
      <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
        {/* El contenido específico de cada tab se renderizará aquí */}
        <div className="p-4 flex-1">
             {activeTab === 'chat' && (
                 <div className="text-center text-gray-500 mt-10">
                     <p className="text-sm">Componente Chat (Próximamente)</p>
                 </div>
             )}
             {activeTab === 'insights' && (
                 <div className="text-center text-gray-500 mt-10">
                     <p className="text-sm">Componente Insights (Próximamente)</p>
                 </div>
             )}
             {activeTab === 'alerts' && (
                 <div className="text-center text-gray-500 mt-10">
                     <p className="text-sm">Componente Alertas (Próximamente)</p>
                 </div>
             )}
             {activeTab === 'metrics' && (
                 <div className="text-center text-gray-500 mt-10">
                     <p className="text-sm">Componente Métricas (Próximamente)</p>
                 </div>
             )}
        </div>
      </div>

      {/* Footer (Opcional/Contextual, por defecto vacío o para input de chat) */}
      {activeTab === 'chat' && (
        <footer className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
            <div className="h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Input Placeholder
            </div>
        </footer>
      )}
    </aside>
  );
};