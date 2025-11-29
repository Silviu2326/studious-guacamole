import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { Input } from '../../../components/componentsreutilizables';
import { getClients } from '../../gestión-de-clientes/api/clients';
import { Client } from '../../gestión-de-clientes/types';

interface ClienteAutocompleteProps {
  value?: string;
  onChange: (clientId: string, clientName: string) => void;
  onClear?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  role?: 'entrenador' | 'gimnasio';
  userId?: string;
}

export const ClienteAutocomplete: React.FC<ClienteAutocompleteProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar cliente...',
  label = 'Cliente',
  error,
  role = 'entrenador',
  userId,
}) => {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const datos = await getClients(role, userId);
        setClientes(datos);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, [role, userId]);

  useEffect(() => {
    if (value) {
      const cliente = clientes.find(c => c.id === value);
      if (cliente) {
        setClienteSeleccionado(cliente);
        setBusqueda(cliente.name);
      }
    } else {
      setClienteSeleccionado(null);
      setBusqueda('');
    }
  }, [value, clientes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
        setMostrarOpciones(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccionarCliente = (cliente: Client) => {
    setClienteSeleccionado(cliente);
    setBusqueda(cliente.name);
    setMostrarOpciones(false);
    onChange(cliente.id, cliente.name);
  };

  const handleLimpiar = () => {
    setClienteSeleccionado(null);
    setBusqueda('');
    setMostrarOpciones(false);
    if (onClear) {
      onClear();
    } else {
      onChange('', '');
    }
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setMostrarOpciones(true);
    
    if (!valor) {
      handleLimpiar();
    }
  };

  const handleInputFocus = () => {
    if (busqueda || !clienteSeleccionado) {
      setMostrarOpciones(true);
    }
  };

  return (
    <div ref={contenedorRef} className="relative w-full">
      <Input
        ref={inputRef}
        label={label}
        value={busqueda}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        error={error}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          clienteSeleccionado ? (
            <button
              type="button"
              onClick={handleLimpiar}
              className="hover:bg-gray-100 rounded-full p-1 transition-colors"
              aria-label="Limpiar"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          ) : undefined
        }
      />

      {mostrarOpciones && busqueda && !clienteSeleccionado && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Cargando...</div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No se encontraron clientes</div>
          ) : (
            clientesFiltrados.map(cliente => (
              <button
                key={cliente.id}
                type="button"
                onClick={() => handleSeleccionarCliente(cliente)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {cliente.name}
                  </div>
                  {cliente.email && (
                    <div className="text-xs text-gray-500 truncate">
                      {cliente.email}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};


