import React, { useState, useEffect } from 'react';
import { Card, Select, Button } from '../../../components/componentsreutilizables';
import { Users, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface Cliente {
  id: string;
  nombre: string;
}

interface Grupo {
  id: string;
  nombre: string;
  tipo: 'clase' | 'programa';
}

interface AsignadorDestinatarioProps {
  tipoAsignacion?: 'cliente' | 'grupo' | 'programa';
  asignadoA?: string;
  onChange: (tipo: 'cliente' | 'grupo' | 'programa', id: string) => void;
}

export const AsignadorDestinatario: React.FC<AsignadorDestinatarioProps> = ({
  tipoAsignacion,
  asignadoA,
  onChange,
}) => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  useEffect(() => {
    if (esEntrenador) {
      fetchClientes();
    } else {
      fetchGrupos();
    }
  }, [esEntrenador]);

  const fetchClientes = async () => {
    const res = await fetch('/api/clients');
    if (res.ok) {
      const data = await res.json();
      setClientes(data.map((c: any) => ({ id: c.id, nombre: c.name || c.nombre })));
    }
  };

  const fetchGrupos = async () => {
    const res = await fetch('/api/grupos');
    if (res.ok) {
      const data = await res.json();
      setGrupos(data.map((g: any) => ({ id: g.id, nombre: g.nombre, tipo: g.tipo })));
    } else {
      setGrupos([
        { id: 'grupo1', nombre: 'Clase de Fuerza', tipo: 'clase' },
        { id: 'grupo2', nombre: 'Programa HIIT', tipo: 'programa' },
      ]);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          {esEntrenador ? (
            <User className="w-5 h-5 text-blue-600" />
          ) : (
            <Users className="w-5 h-5 text-purple-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {esEntrenador ? 'Asignar a Cliente' : 'Asignar a Grupo/Programa'}
          </h3>
        </div>

        {esEntrenador ? (
          <Select
            label="Cliente"
            value={tipoAsignacion === 'cliente' ? asignadoA || '' : ''}
            onChange={(e) => onChange('cliente', e.target.value)}
            options={[
              { value: '', label: 'Seleccionar cliente...' },
              ...clientes.map((c) => ({ value: c.id, label: c.nombre })),
            ]}
            placeholder="Selecciona un cliente"
          />
        ) : (
          <Select
            label="Grupo o Programa"
            value={asignadoA || ''}
            onChange={(e) => {
              const grupo = grupos.find((g) => g.id === e.target.value);
              onChange(grupo?.tipo === 'programa' ? 'programa' : 'grupo', e.target.value);
            }}
            options={[
              { value: '', label: 'Seleccionar grupo/programa...' },
              ...grupos.map((g) => ({
                value: g.id,
                label: `${g.nombre} (${g.tipo === 'programa' ? 'Programa' : 'Clase'})`,
              })),
            ]}
            placeholder="Selecciona un grupo o programa"
          />
        )}

        {asignadoA && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Sesión asignada correctamente
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

