import React, { useState } from 'react';
import { Box, Dumbbell, LayoutTemplate, Search, Filter } from 'lucide-react';

type Tab = 'blocks' | 'exercises' | 'templates';

export const LibraryPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('exercises');

  return (
    <aside className="w-60 border-r border-gray-200 bg-white flex flex-col h-full hidden lg:flex">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('blocks')}
          className={`flex-1 py-3 flex justify-center items-center hover:bg-gray-50 transition-colors ${
            activeTab === 'blocks' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          title="Bloques"
        >
          <Box className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 py-3 flex justify-center items-center hover:bg-gray-50 transition-colors ${
            activeTab === 'exercises' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          title="Ejercicios"
        >
          <Dumbbell className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 flex justify-center items-center hover:bg-gray-50 transition-colors ${
            activeTab === 'templates' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
          title="Plantillas"
        >
          <LayoutTemplate className="w-5 h-5" />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 text-xs text-gray-500 font-medium hover:text-gray-700">
          <Filter className="w-3 h-3" />
          Filtros avanzados
        </button>
      </div>

      {/* Content List (Placeholder) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {activeTab === 'exercises' && (
          <>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Favoritos
            </div>
            {['Bench Press', 'Squat', 'Deadlift', 'Pull Up'].map((item) => (
              <div
                key={item}
                className="group flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-100 transition-all"
              >
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-blue-600">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{item}</p>
                  <p className="text-xs text-gray-400 truncate">Fuerza • Barbell</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600">
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>
            ))}
          </>
        )}
        
        {activeTab === 'blocks' && (
           <div className="p-4 text-center text-gray-400 text-sm">
             <p>Biblioteca de bloques vacía</p>
           </div>
        )}

        {activeTab === 'templates' && (
           <div className="p-4 text-center text-gray-400 text-sm">
             <p>No hay plantillas guardadas</p>
           </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
          <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              + Crear Nuevo
          </button>
      </div>
    </aside>
  );
};
