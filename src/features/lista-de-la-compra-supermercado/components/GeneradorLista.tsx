import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Modal } from '../../../components/componentsreutilizables';
import { ShoppingCart, Users, Sparkles } from 'lucide-react';
import { 
  type Cliente,
  generarListaCompra,
  getListasCompra,
  type ListaCompra 
} from '../api';

interface GeneradorListaProps {
  onListaGenerada?: (lista: ListaCompra) => void;
}

export const GeneradorLista: React.FC<GeneradorListaProps> = ({ onListaGenerada }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [numeroPersonas, setNumeroPersonas] = useState<number>(1);
  const [dietaId, setDietaId] = useState<string>('');
  const [generando, setGenerando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClientes(data.map((c: any) => ({
          id: c.id,
          nombre: c.name || c.nombre,
          email: c.email,
          dietaAsignada: c.dietaAsignada,
          numeroPersonasHogar: c.numeroPersonasHogar || 1,
          supermercadoPreferido: c.supermercadoPreferido,
        })));
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const handleGenerar = async () => {
    if (!clienteSeleccionado) {
      alert('Selecciona un cliente');
      return;
    }

    setGenerando(true);
    try {
      const cliente = clientes.find((c) => c.id === clienteSeleccionado);
      const personas = numeroPersonas || cliente?.numeroPersonasHogar || 1;
      const dieta = dietaId || cliente?.dietaAsignada?.id;

      const lista = await generarListaCompra(clienteSeleccionado, dieta, personas);
      
      if (lista) {
        onListaGenerada?.(lista);
        setMostrarModal(false);
        setClienteSeleccionado('');
        setNumeroPersonas(1);
        setDietaId('');
      } else {
        alert('Error al generar la lista de compra');
      }
    } catch (error) {
      console.error('Error generando lista:', error);
      alert('Error al generar la lista de compra');
    } finally {
      setGenerando(false);
    }
  };

  const cliente = clientes.find((c) => c.id === clienteSeleccionado);
  const dietasDisponibles = cliente?.dietaAsignada 
    ? [{ value: cliente.dietaAsignada.id, label: cliente.dietaAsignada.nombre }]
    : [];

  return (
    <>
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Generar Lista de Compra
            </h2>
          </div>
          <Button onClick={() => setMostrarModal(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Generar Nueva Lista
          </Button>
        </div>

        <p className="text-gray-600">
          Genera listas de compra personalizadas basadas en las dietas asignadas a tus clientes.
          El sistema extraerá automáticamente los ingredientes y calculará las cantidades necesarias.
        </p>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Generar Nueva Lista de Compra"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerar} loading={generando}>
              Generar Lista
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Cliente"
            options={clientes.map((c) => ({ value: c.id, label: c.nombre }))}
            value={clienteSeleccionado}
            onChange={(e) => {
              setClienteSeleccionado(e.target.value);
              const cliente = clientes.find((c) => c.id === e.target.value);
              if (cliente) {
                setNumeroPersonas(cliente.numeroPersonasHogar || 1);
                setDietaId(cliente.dietaAsignada?.id || '');
              }
            }}
            placeholder="Selecciona un cliente"
          />

          {cliente && (
            <>
              {dietasDisponibles.length > 0 && (
                <Select
                  label="Dieta Asignada"
                  options={dietasDisponibles}
                  value={dietaId}
                  onChange={(e) => setDietaId(e.target.value)}
                />
              )}

              <Input
                label="Número de Personas"
                type="number"
                min="1"
                value={numeroPersonas.toString()}
                onChange={(e) => setNumeroPersonas(parseInt(e.target.value) || 1)}
                leftIcon={<Users className="w-4 h-4" />}
              />

              {cliente.supermercadoPreferido && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Supermercado preferido: <strong>{cliente.supermercadoPreferido}</strong>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

