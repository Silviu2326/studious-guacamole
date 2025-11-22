import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, User, Plus, Sparkles } from 'lucide-react';
import { useUIContext } from '../context/UIContext';

interface Client {
  id: string;
  name: string;
  program: string;
  currentWeek: number;
  totalWeeks: number;
  status: 'active' | 'paused';
  avatarColor: string;
}

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'María López',
    program: 'Fuerza 12 Sem',
    currentWeek: 3,
    totalWeeks: 12,
    status: 'active',
    avatarColor: 'bg-indigo-500'
  },
  {
    id: '2',
    name: 'Juan Pérez',
    program: 'Hipertrofia',
    currentWeek: 5,
    totalWeeks: 16,
    status: 'active',
    avatarColor: 'bg-blue-500'
  },
  {
    id: '3',
    name: 'Ana García',
    program: 'Pérdida Grasa',
    currentWeek: 2,
    totalWeeks: 8,
    status: 'paused',
    avatarColor: 'bg-green-500'
  },
  {
    id: '4',
    name: 'Carlos Ruiz',
    program: 'Fuerza',
    currentWeek: 8,
    totalWeeks: 12,
    status: 'active',
    avatarColor: 'bg-orange-500'
  }
];

export interface ClientSelectorHandle {
  open: () => void;
}

const ClientSelector = React.forwardRef<ClientSelectorHandle>((_, ref) => {
  const { setAIProgramGeneratorOpen } = useUIContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client>(MOCK_CLIENTS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose open method to parent via ref
  React.useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
    }
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Separator (Visual part of trigger group per spec logic, but implemented here for self-containment) */}
        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

        {/* Avatar */}
        <div className={`w-8 h-8 ${selectedClient.avatarColor} rounded-full hidden sm:flex items-center justify-center text-white text-xs font-medium shadow-sm ring-2 ring-white`}>
          {getInitials(selectedClient.name)}
        </div>

        {/* Name & Info */}
        <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px] sm:max-w-[160px]">
                {selectedClient.name}
            </span>
            <span className="text-xs text-gray-400 hidden sm:block">
                {selectedClient.program}
            </span>
        </div>

        {/* Chevron */}
        <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
            
            {/* Sticky Search */}
            <div className="sticky top-0 bg-white p-3 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Client List */}
            <div className="max-h-[320px] overflow-y-auto py-2">
                {/* Current Client Section (only if not searching or if current matches search) */}
                {searchQuery === '' && (
                    <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Actual
                        </div>
                        <div className="px-2 mb-2">
                            <div className="flex items-center gap-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                                <div className={`w-8 h-8 ${selectedClient.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                                    {getInitials(selectedClient.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                            {selectedClient.name}
                                        </span>
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                            selectedClient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedClient.status === 'active' ? 'Activo' : 'Pausado'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-600 truncate">
                                        {selectedClient.program} • Sem {selectedClient.currentWeek}/{selectedClient.totalWeeks}
                                    </p>
                                </div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 mx-4 my-2" />
                    </>
                )}

                {/* Recent / Search Results */}
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {searchQuery ? 'Resultados' : 'Recientes'}
                </div>
                
                <div className="px-2 space-y-1">
                    {filteredClients.map(client => (
                        <button
                            key={client.id}
                            onClick={() => handleSelectClient(client)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                                selectedClient.id === client.id ? 'bg-gray-50' : ''
                            }`}
                        >
                            <div className={`w-8 h-8 ${client.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                                {getInitials(client.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-900 truncate block">
                                    {client.name}
                                </span>
                                <span className="text-xs text-gray-500 truncate block">
                                    {client.program}
                                </span>
                            </div>
                            {selectedClient.id === client.id && (
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            )}
                        </button>
                    ))}
                    
                    {filteredClients.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No se encontraron clientes
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
                <button 
                    onClick={() => {
                        setAIProgramGeneratorOpen(true);
                        setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    Nuevo Programa con IA
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                </button>
                <button className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">
                    Ver todos los clientes
                </button>
            </div>
        </div>
      )}
    </div>
  );
});

export default ClientSelector;
