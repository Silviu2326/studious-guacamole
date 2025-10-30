import React, { useState } from 'react';
import { Card, Button, Select, TableWithActions } from '../../../components/componentsreutilizables';
import { Bono, Cliente, Plan } from '../types';
import { PlanForm } from './PlanForm';
import { Plus, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface GestorBonosProps {
  bonos: Bono[];
  clientes: Cliente[];
  planes: Plan[];
  onCreateBono: (bono: Partial<Bono>) => void;
  onUpdateBono: (id: string, bono: Partial<Bono>) => void;
  onDeleteBono: (id: string) => void;
}

export const GestorBonos: React.FC<GestorBonosProps> = ({
  bonos,
  clientes,
  planes,
  onCreateBono,
  onUpdateBono,
  onDeleteBono
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'activo' | 'vencido' | 'agotado'>('all');

  const filteredBonos = bonos.filter(bono => {
    if (filterStatus === 'all') return true;
    return bono.estado === filterStatus;
  });

  const bonosActivos = bonos.filter(b => b.estado === 'activo').length;
  const bonosVencidos = bonos.filter(b => b.estado === 'vencido').length;
  const bonosAgotados = bonos.filter(b => b.estado === 'agotado').length;
  const ingresosTotales = bonos.reduce((acc, b) => acc + b.precio, 0);

  const handleCreateBono = () => {
    if (!selectedCliente || !selectedPlan) return;

    const plan = planes.find(p => p.id === selectedPlan);
    if (!plan) return;

    const nuevoBono: Partial<Bono> = {
      planId: selectedPlan,
      clienteId: selectedCliente,
      sesionesTotal: plan.sesiones || 0,
      sesionesUsadas: 0,
      sesionesRestantes: plan.sesiones || 0,
      fechaCompra: new Date(),
      fechaVencimiento: new Date(Date.now() + (plan.validezMeses || 1) * 30 * 24 * 60 * 60 * 1000),
      estado: 'activo',
      precio: plan.precio.base * (1 - plan.precio.descuento / 100)
    };

    onCreateBono(nuevoBono);
    setSelectedCliente('');
    setSelectedPlan('');
    setShowCreateForm(false);
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      activo: 'bg-green-100 text-green-800',
      vencido: 'bg-red-100 text-red-800',
      agotado: 'bg-yellow-100 text-yellow-800',
      suspendido: 'bg-gray-100 text-gray-800'
    };
    return badges[estado as keyof typeof badges] || badges.suspendido;
  };

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente no encontrado';
  };

  const getPlanName = (planId: string) => {
    const plan = planes.find(p => p.id === planId);
    return plan?.nombre || 'Plan no encontrado';
  };

  const columns = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (bono: Bono) => (
        <div>
          <div className="font-medium text-gray-900">{getClienteName(bono.clienteId)}</div>
          <div className="text-sm text-gray-500">{getPlanName(bono.planId)}</div>
        </div>
      )
    },
    {
      key: 'sesiones',
      label: 'Sesiones',
      render: (bono: Bono) => (
        <div className="text-center">
          <div className="text-sm font-medium">
            {bono.sesionesRestantes} / {bono.sesionesTotal}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{
                width: `${((bono.sesionesTotal - bono.sesionesRestantes) / bono.sesionesTotal) * 100}%`
              }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'fechaVencimiento',
      label: 'Vencimiento',
      render: (bono: Bono) => {
        const diasRestantes = Math.ceil((new Date(bono.fechaVencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const isProximoVencer = diasRestantes <= 30 && diasRestantes > 0;
        const isVencido = diasRestantes <= 0;
        
        return (
          <div className="text-sm">
            <div className={`font-medium ${isVencido ? 'text-red-600' : isProximoVencer ? 'text-yellow-600' : 'text-gray-900'}`}>
              {new Date(bono.fechaVencimiento).toLocaleDateString()}
            </div>
            <div className={`text-xs ${isVencido ? 'text-red-500' : isProximoVencer ? 'text-yellow-500' : 'text-gray-500'}`}>
              {isVencido ? 'Vencido' : `${diasRestantes} días`}
            </div>
          </div>
        );
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (bono: Bono) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(bono.estado)}`}>
          {bono.estado.charAt(0).toUpperCase() + bono.estado.slice(1)}
        </span>
      )
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (bono: Bono) => (
        <div className="text-right font-medium text-gray-900">
          {bono.precio.toFixed(2)}€
        </div>
      )
    }
  ];

  const actions = [
    {
      label: 'Editar',
      onClick: (bono: Bono) => {
        // Implementar edición
        console.log('Editar bono:', bono);
      },
      variant: 'secondary' as const
    },
    {
      label: 'Eliminar',
      onClick: (bono: Bono) => onDeleteBono(bono.id),
      variant: 'destructive' as const
    }
  ];

  const clienteOptions = clientes.map(cliente => ({
    value: cliente.id,
    label: cliente.nombre
  }));

  const planOptions = planes
    .filter(plan => plan.tipo === 'bono_pt' && plan.activo)
    .map(plan => ({
      value: plan.id,
      label: `${plan.nombre} - ${plan.sesiones} sesiones - ${(plan.precio.base * (1 - plan.precio.descuento / 100)).toFixed(2)}€`
    }));

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'activo', label: 'Activos' },
    { value: 'vencido', label: 'Vencidos' },
    { value: 'agotado', label: 'Agotados' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Bonos</h2>
          <p className="text-gray-600 mt-1">
            Administra los bonos de entrenamiento de tus clientes
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Asignar Nuevo Bono</span>
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{bonosActivos}</div>
              <div className="text-sm text-gray-600">Bonos activos</div>
            </div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{bonosVencidos}</div>
              <div className="text-sm text-gray-600">Vencidos</div>
            </div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{bonosAgotados}</div>
              <div className="text-sm text-gray-600">Agotados</div>
            </div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{ingresosTotales.toFixed(0)}€</div>
              <div className="text-sm text-gray-600">Ingresos totales</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex items-center space-x-4">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value as any)}
            placeholder="Filtrar por estado"
          />
        </div>
      </Card>

      {/* Formulario de creación rápida */}
      {showCreateForm && (
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Asignar Nuevo Bono</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Cliente"
                options={clienteOptions}
                value={selectedCliente}
                onChange={setSelectedCliente}
                placeholder="Seleccionar cliente"
              />
              
              <Select
                label="Plan de bono"
                options={planOptions}
                value={selectedPlan}
                onChange={setSelectedPlan}
                placeholder="Seleccionar plan"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateBono}
                disabled={!selectedCliente || !selectedPlan}
              >
                Asignar Bono
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabla de bonos */}
      <Card>
        <TableWithActions
          data={filteredBonos}
          columns={columns}
          actions={actions}
          emptyMessage="No hay bonos registrados"
        />
      </Card>
    </div>
  );
};