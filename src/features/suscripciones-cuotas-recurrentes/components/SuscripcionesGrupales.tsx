import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  DollarSign,
  Percent,
  RefreshCw,
  Save,
  X,
  Eye,
  Activity
} from 'lucide-react';
import { 
  getSuscripcionesGrupales,
  createSuscripcionGrupal,
  agregarMiembroGrupo,
  removerMiembroGrupo,
  getSuscripciones,
} from '../api/suscripciones';
import { 
  Suscripcion,
  CreateSuscripcionGrupalRequest,
  AgregarMiembroGrupoRequest,
  RemoverMiembroGrupoRequest,
  FrecuenciaPago,
} from '../types';

interface SuscripcionesGrupalesProps {
  entrenadorId?: string;
  onRefresh?: () => void;
}

interface MiembroForm {
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  planId: string;
  sesionesIncluidas: number;
}

export const SuscripcionesGrupales: React.FC<SuscripcionesGrupalesProps> = ({
  entrenadorId,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(true);
  const [suscripcionesGrupales, setSuscripcionesGrupales] = useState<Suscripcion[]>([]);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Suscripcion | null>(null);
  const [suscripcionesMiembros, setSuscripcionesMiembros] = useState<Suscripcion[]>([]);
  
  // Formulario de creación
  const [formCrear, setFormCrear] = useState<{
    nombreGrupo: string;
    clientePrincipalId: string;
    clientePrincipalNombre: string;
    clientePrincipalEmail: string;
    frecuenciaPago: FrecuenciaPago;
    descuentoTipo: 'porcentaje' | 'fijo';
    descuentoValor: number;
    miembros: MiembroForm[];
    fechaInicio: string;
    notas?: string;
  }>({
    nombreGrupo: '',
    clientePrincipalId: '',
    clientePrincipalNombre: '',
    clientePrincipalEmail: '',
    frecuenciaPago: 'mensual',
    descuentoTipo: 'porcentaje',
    descuentoValor: 10,
    miembros: [],
    fechaInicio: new Date().toISOString().split('T')[0],
  });

  // Formulario de agregar miembro
  const [formAgregar, setFormAgregar] = useState<MiembroForm>({
    clienteId: '',
    clienteNombre: '',
    clienteEmail: '',
    clienteTelefono: '',
    planId: 'pt-4',
    sesionesIncluidas: 4,
  });

  useEffect(() => {
    loadSuscripcionesGrupales();
  }, [entrenadorId]);

  const loadSuscripcionesGrupales = async () => {
    try {
      setLoading(true);
      const data = await getSuscripcionesGrupales(entrenadorId);
      setSuscripcionesGrupales(data);
    } catch (error) {
      console.error('Error cargando suscripciones grupales:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuscripcionesMiembros = async (grupoId: string) => {
    try {
      const todasSuscripciones = await getSuscripciones('entrenador', entrenadorId);
      const miembros = todasSuscripciones.filter(s => s.grupoId === grupoId && !s.esGrupal);
      setSuscripcionesMiembros(miembros);
    } catch (error) {
      console.error('Error cargando suscripciones de miembros:', error);
    }
  };

  const calcularUsoGrupo = (grupo: Suscripcion) => {
    const miembros = grupo.miembrosGrupo?.filter(m => m.activo) || [];
    let sesionesIncluidas = 0;
    let sesionesUsadas = 0;
    
    miembros.forEach(miembro => {
      const suscripcionMiembro = suscripcionesMiembros.find(s => s.id === miembro.suscripcionId);
      if (suscripcionMiembro) {
        sesionesIncluidas += suscripcionMiembro.sesionesIncluidas || 0;
        sesionesUsadas += suscripcionMiembro.sesionesUsadas || 0;
      }
    });
    
    const sesionesDisponibles = sesionesIncluidas - sesionesUsadas;
    const porcentajeUso = sesionesIncluidas > 0 ? (sesionesUsadas / sesionesIncluidas) * 100 : 0;
    
    return {
      sesionesIncluidas,
      sesionesUsadas,
      sesionesDisponibles,
      porcentajeUso,
    };
  };

  const calcularProrrateo = (grupo: Suscripcion) => {
    // Calcular prorrateo si hay cambios recientes en miembros
    const fechaInicio = new Date(grupo.fechaInicio);
    const fechaVencimiento = new Date(grupo.fechaVencimiento);
    const hoy = new Date();
    
    const diasTotales = Math.ceil((fechaVencimiento.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    const diasTranscurridos = Math.ceil((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    // Si hay miembros agregados recientemente, calcular prorrateo
    const miembrosRecientes = grupo.miembrosGrupo?.filter(m => {
      const fechaAgregado = new Date(m.fechaAgregado);
      const diasDesdeAgregado = Math.ceil((hoy.getTime() - fechaAgregado.getTime()) / (1000 * 60 * 60 * 24));
      return diasDesdeAgregado < 30; // Miembros agregados en los últimos 30 días
    }) || [];
    
    if (miembrosRecientes.length > 0 && diasTranscurridos > 0) {
      const precioPorDia = grupo.precioOriginal / diasTotales;
      const diasRestantes = diasTotales - diasTranscurridos;
      const montoProrrateado = precioPorDia * diasRestantes;
      
      return {
        aplicado: true,
        motivo: `Prorrateo por ${miembrosRecientes.length} miembro(s) agregado(s) recientemente`,
        fechaAplicacion: hoy.toISOString().split('T')[0],
        montoProrrateado: Math.round(montoProrrateado * 100) / 100,
        diasTranscurridos,
        diasRestantes,
      };
    }
    
    return { aplicado: false };
  };

  const handleCrearGrupo = async () => {
    try {
      const request: CreateSuscripcionGrupalRequest = {
        nombreGrupo: formCrear.nombreGrupo,
        clientePrincipalId: formCrear.clientePrincipalId,
        miembros: formCrear.miembros.map(m => ({
          clienteId: m.clienteId,
          clienteNombre: m.clienteNombre,
          clienteEmail: m.clienteEmail,
          clienteTelefono: m.clienteTelefono,
          planId: m.planId,
          sesionesIncluidas: m.sesionesIncluidas,
        })),
        descuentoGrupo: {
          tipo: formCrear.descuentoTipo,
          valor: formCrear.descuentoValor,
        },
        frecuenciaPago: formCrear.frecuenciaPago,
        fechaInicio: formCrear.fechaInicio,
        entrenadorId,
        notas: formCrear.notas,
      };

      await createSuscripcionGrupal(request);
      await loadSuscripcionesGrupales();
      setMostrarModalCrear(false);
      resetFormCrear();
      onRefresh?.();
    } catch (error) {
      console.error('Error creando suscripción grupal:', error);
      alert('Error al crear la suscripción grupal');
    }
  };

  const handleAgregarMiembro = async () => {
    if (!grupoSeleccionado) return;

    try {
      const request: AgregarMiembroGrupoRequest = {
        grupoId: grupoSeleccionado.grupoId!,
        clienteId: formAgregar.clienteId,
        clienteNombre: formAgregar.clienteNombre,
        clienteEmail: formAgregar.clienteEmail,
        clienteTelefono: formAgregar.clienteTelefono,
        planId: formAgregar.planId,
        sesionesIncluidas: formAgregar.sesionesIncluidas,
      };

      await agregarMiembroGrupo(request);
      await loadSuscripcionesGrupales();
      setMostrarModalAgregar(false);
      setGrupoSeleccionado(null);
      resetFormAgregar();
      onRefresh?.();
    } catch (error) {
      console.error('Error agregando miembro:', error);
      alert('Error al agregar miembro al grupo');
    }
  };

  const handleRemoverMiembro = async (miembroId: string) => {
    if (!grupoSeleccionado) return;

    if (!confirm('¿Estás seguro de que quieres remover este miembro del grupo?')) {
      return;
    }

    try {
      const request: RemoverMiembroGrupoRequest = {
        grupoId: grupoSeleccionado.grupoId!,
        miembroId,
        motivo: 'Removido por el entrenador',
      };

      await removerMiembroGrupo(request);
      await loadSuscripcionesGrupales();
      onRefresh?.();
    } catch (error) {
      console.error('Error removiendo miembro:', error);
      alert('Error al remover miembro del grupo');
    }
  };

  const resetFormCrear = () => {
    setFormCrear({
      nombreGrupo: '',
      clientePrincipalId: '',
      clientePrincipalNombre: '',
      clientePrincipalEmail: '',
      frecuenciaPago: 'mensual',
      descuentoTipo: 'porcentaje',
      descuentoValor: 10,
      miembros: [],
      fechaInicio: new Date().toISOString().split('T')[0],
    });
  };

  const resetFormAgregar = () => {
    setFormAgregar({
      clienteId: '',
      clienteNombre: '',
      clienteEmail: '',
      clienteTelefono: '',
      planId: 'pt-4',
      sesionesIncluidas: 4,
    });
  };

  const agregarMiembroAlForm = () => {
    setFormCrear({
      ...formCrear,
      miembros: [...formCrear.miembros, {
        clienteId: '',
        clienteNombre: '',
        clienteEmail: '',
        clienteTelefono: '',
        planId: 'pt-4',
        sesionesIncluidas: 4,
      }],
    });
  };

  const removerMiembroDelForm = (index: number) => {
    setFormCrear({
      ...formCrear,
      miembros: formCrear.miembros.filter((_, i) => i !== index),
    });
  };

  const actualizarMiembroForm = (index: number, campo: keyof MiembroForm, valor: any) => {
    const nuevosMiembros = [...formCrear.miembros];
    nuevosMiembros[index] = { ...nuevosMiembros[index], [campo]: valor };
    setFormCrear({ ...formCrear, miembros: nuevosMiembros });
  };

  const calcularPrecioTotal = () => {
    const precioPorMiembro = formCrear.miembros.reduce((sum, m) => {
      return sum + (m.sesionesIncluidas * 37.5); // Precio estimado
    }, 0);
    
    let precioTotal = precioPorMiembro;
    if (formCrear.descuentoTipo === 'porcentaje') {
      precioTotal = precioPorMiembro * (1 - formCrear.descuentoValor / 100);
    } else {
      precioTotal = precioPorMiembro - formCrear.descuentoValor;
    }
    
    return { precioPorMiembro, precioTotal };
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando suscripciones grupales...</span>
        </div>
      </Card>
    );
  }

  const columns = [
    {
      key: 'planNombre',
      label: 'Grupo',
      render: (value: string, row: Suscripcion) => (
        <div>
          <div className="text-base font-semibold text-gray-900">
            {value.replace('Suscripción Grupal: ', '')}
          </div>
          <div className="text-sm text-gray-600">
            {row.miembrosGrupo?.filter(m => m.activo).length || 0} miembro(s) activo(s)
          </div>
        </div>
      ),
    },
    {
      key: 'clienteNombre',
      label: 'Cliente Principal',
      render: (value: string, row: Suscripcion) => (
        <div>
          <div className="text-base text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{row.clienteEmail}</div>
        </div>
      ),
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number, row: Suscripcion) => (
        <div>
          <div className="text-base font-semibold text-gray-900">
            {value.toFixed(2)} €
          </div>
          {row.precioOriginal && row.precioOriginal > value && (
            <div className="text-sm text-gray-500 line-through">
              {row.precioOriginal.toFixed(2)} €
            </div>
          )}
          {row.descuentoGrupo && (
            <Badge color="success" className="mt-1">
              {row.descuentoGrupo.tipo === 'porcentaje' 
                ? `${row.descuentoGrupo.valor}% desc.`
                : `${row.descuentoGrupo.valor}€ desc.`}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'miembrosGrupo',
      label: 'Miembros / Uso',
      render: (value: any, row: Suscripcion) => {
        const uso = calcularUsoGrupo(row);
        return (
          <div className="space-y-1">
            <div className="text-sm text-gray-700">
              {row.miembrosGrupo?.filter(m => m.activo).length || 0} miembro(s)
            </div>
            <div className="text-xs text-gray-500">
              {uso.sesionesUsadas}/{uso.sesionesIncluidas} sesiones ({uso.porcentajeUso.toFixed(0)}%)
            </div>
          </div>
        );
      },
    },
    {
      key: 'fechaVencimiento',
      label: 'Próxima Renovación',
      render: (value: string) => (
        <span className="text-base text-gray-900">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Suscripcion) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              setGrupoSeleccionado(row);
              if (row.grupoId) {
                await loadSuscripcionesMiembros(row.grupoId);
              }
              setMostrarModalDetalle(true);
            }}
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setGrupoSeleccionado(row);
              setMostrarModalAgregar(true);
            }}
            title="Agregar miembro"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const { precioPorMiembro, precioTotal } = calcularPrecioTotal();

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Suscripciones Grupales
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Crea suscripciones que agrupen varios miembros para ofrecer descuentos por volumen
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSuscripcionesGrupales}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setMostrarModalCrear(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Grupo
            </Button>
          </div>
        </div>

        <Table
          data={suscripcionesGrupales}
          columns={columns}
          emptyMessage="No hay suscripciones grupales. Crea una nueva para comenzar."
        />
      </Card>

      {/* Modal Crear Grupo */}
      <Modal
        isOpen={mostrarModalCrear}
        onClose={() => {
          setMostrarModalCrear(false);
          resetFormCrear();
        }}
        title="Crear Suscripción Grupal"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Grupo/Familia
            </label>
            <Input
              value={formCrear.nombreGrupo}
              onChange={(e) => setFormCrear({ ...formCrear, nombreGrupo: e.target.value })}
              placeholder="Ej: Familia García"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente Principal ID
              </label>
              <Input
                value={formCrear.clientePrincipalId}
                onChange={(e) => setFormCrear({ ...formCrear, clientePrincipalId: e.target.value })}
                placeholder="ID del cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <Input
                value={formCrear.clientePrincipalNombre}
                onChange={(e) => setFormCrear({ ...formCrear, clientePrincipalNombre: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formCrear.clientePrincipalEmail}
              onChange={(e) => setFormCrear({ ...formCrear, clientePrincipalEmail: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia de Pago
              </label>
              <Select
                value={formCrear.frecuenciaPago}
                onChange={(e) => setFormCrear({ ...formCrear, frecuenciaPago: e.target.value as FrecuenciaPago })}
                options={[
                  { value: 'mensual', label: 'Mensual' },
                  { value: 'trimestral', label: 'Trimestral' },
                  { value: 'semestral', label: 'Semestral' },
                  { value: 'anual', label: 'Anual' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <Input
                type="date"
                value={formCrear.fechaInicio}
                onChange={(e) => setFormCrear({ ...formCrear, fechaInicio: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Descuento por Volumen</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Descuento
                </label>
                <Select
                  value={formCrear.descuentoTipo}
                  onChange={(e) => setFormCrear({ ...formCrear, descuentoTipo: e.target.value as 'porcentaje' | 'fijo' })}
                  options={[
                    { value: 'porcentaje', label: 'Porcentaje (%)' },
                    { value: 'fijo', label: 'Cantidad Fija (€)' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor del Descuento
                </label>
                <Input
                  type="number"
                  value={formCrear.descuentoValor}
                  onChange={(e) => setFormCrear({ ...formCrear, descuentoValor: parseFloat(e.target.value) || 0 })}
                  placeholder={formCrear.descuentoTipo === 'porcentaje' ? '10' : '50'}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Miembros del Grupo</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={agregarMiembroAlForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {formCrear.miembros.map((miembro, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">Miembro {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerMiembroDelForm(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="ID Cliente"
                      value={miembro.clienteId}
                      onChange={(e) => actualizarMiembroForm(index, 'clienteId', e.target.value)}
                    />
                    <Input
                      placeholder="Nombre"
                      value={miembro.clienteNombre}
                      onChange={(e) => actualizarMiembroForm(index, 'clienteNombre', e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={miembro.clienteEmail}
                      onChange={(e) => actualizarMiembroForm(index, 'clienteEmail', e.target.value)}
                    />
                    <Input
                      placeholder="Teléfono (opcional)"
                      value={miembro.clienteTelefono}
                      onChange={(e) => actualizarMiembroForm(index, 'clienteTelefono', e.target.value)}
                    />
                    <Select
                      value={miembro.planId}
                      onChange={(e) => actualizarMiembroForm(index, 'planId', e.target.value)}
                      options={[
                        { value: 'pt-4', label: 'Plan 4 Sesiones' },
                        { value: 'pt-8', label: 'Plan 8 Sesiones' },
                        { value: 'pt-12', label: 'Plan 12 Sesiones' },
                      ]}
                    />
                    <Input
                      type="number"
                      placeholder="Sesiones incluidas"
                      value={miembro.sesionesIncluidas}
                      onChange={(e) => actualizarMiembroForm(index, 'sesionesIncluidas', parseInt(e.target.value) || 4)}
                    />
                  </div>
                </div>
              ))}
              {formCrear.miembros.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay miembros agregados. Haz clic en "Agregar Miembro" para comenzar.
                </div>
              )}
            </div>
          </div>

          {formCrear.miembros.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Precio total sin descuento:</span>
                <span className="font-semibold text-gray-900">{precioPorMiembro.toFixed(2)} €</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Descuento aplicado:</span>
                <span className="font-semibold text-green-600">
                  {formCrear.descuentoTipo === 'porcentaje' 
                    ? `${formCrear.descuentoValor}%`
                    : `${formCrear.descuentoValor}€`}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <span className="text-base font-semibold text-gray-900">Precio total:</span>
                <span className="text-xl font-bold text-gray-900">{precioTotal.toFixed(2)} €</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setMostrarModalCrear(false);
                resetFormCrear();
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearGrupo}
              disabled={!formCrear.nombreGrupo || !formCrear.clientePrincipalId || formCrear.miembros.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Crear Grupo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Agregar Miembro */}
      <Modal
        isOpen={mostrarModalAgregar}
        onClose={() => {
          setMostrarModalAgregar(false);
          setGrupoSeleccionado(null);
          resetFormAgregar();
        }}
        title="Agregar Miembro al Grupo"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Cliente
            </label>
            <Input
              value={formAgregar.clienteId}
              onChange={(e) => setFormAgregar({ ...formAgregar, clienteId: e.target.value })}
              placeholder="ID del cliente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <Input
              value={formAgregar.clienteNombre}
              onChange={(e) => setFormAgregar({ ...formAgregar, clienteNombre: e.target.value })}
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formAgregar.clienteEmail}
              onChange={(e) => setFormAgregar({ ...formAgregar, clienteEmail: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono (opcional)
            </label>
            <Input
              value={formAgregar.clienteTelefono}
              onChange={(e) => setFormAgregar({ ...formAgregar, clienteTelefono: e.target.value })}
              placeholder="+34 600 000 000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan
              </label>
              <Select
                value={formAgregar.planId}
                onChange={(e) => {
                  setFormAgregar({ ...formAgregar, planId: e.target.value });
                  if (e.target.value === 'pt-4') setFormAgregar(prev => ({ ...prev, sesionesIncluidas: 4 }));
                  if (e.target.value === 'pt-8') setFormAgregar(prev => ({ ...prev, sesionesIncluidas: 8 }));
                  if (e.target.value === 'pt-12') setFormAgregar(prev => ({ ...prev, sesionesIncluidas: 12 }));
                }}
                options={[
                  { value: 'pt-4', label: 'Plan 4 Sesiones' },
                  { value: 'pt-8', label: 'Plan 8 Sesiones' },
                  { value: 'pt-12', label: 'Plan 12 Sesiones' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sesiones Incluidas
              </label>
              <Input
                type="number"
                value={formAgregar.sesionesIncluidas}
                onChange={(e) => setFormAgregar({ ...formAgregar, sesionesIncluidas: parseInt(e.target.value) || 4 })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setMostrarModalAgregar(false);
                setGrupoSeleccionado(null);
                resetFormAgregar();
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAgregarMiembro}
              disabled={!formAgregar.clienteId || !formAgregar.clienteNombre || !formAgregar.clienteEmail}
            >
              <Save className="w-4 h-4 mr-2" />
              Agregar Miembro
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Detalle Grupo */}
      <Modal
        isOpen={mostrarModalDetalle}
        onClose={() => {
          setMostrarModalDetalle(false);
          setGrupoSeleccionado(null);
          setSuscripcionesMiembros([]);
        }}
        title={grupoSeleccionado ? `Detalles: ${grupoSeleccionado.planNombre.replace('Suscripción Grupal: ', '')}` : 'Detalles del Grupo'}
        size="lg"
      >
        {grupoSeleccionado && (
          <div className="space-y-6">
            {/* Resumen del Grupo */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-50 p-4">
                <div className="text-sm text-gray-600">Precio Total</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {grupoSeleccionado.precio.toFixed(2)} €
                </div>
                {grupoSeleccionado.precioOriginal && grupoSeleccionado.precioOriginal > grupoSeleccionado.precio && (
                  <div className="text-sm text-gray-500 line-through mt-1">
                    {grupoSeleccionado.precioOriginal.toFixed(2)} €
                  </div>
                )}
              </Card>
              <Card className="bg-gray-50 p-4">
                <div className="text-sm text-gray-600">Miembros Activos</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {grupoSeleccionado.miembrosGrupo?.filter(m => m.activo).length || 0}
                </div>
              </Card>
            </div>

            {/* Uso Total */}
            {(() => {
              const uso = calcularUsoGrupo(grupoSeleccionado);
              return (
                <Card className="bg-white p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Uso Total del Grupo
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sesiones Incluidas:</span>
                      <span className="font-semibold">{uso.sesionesIncluidas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sesiones Usadas:</span>
                      <span className="font-semibold text-blue-600">{uso.sesionesUsadas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sesiones Disponibles:</span>
                      <span className="font-semibold text-green-600">{uso.sesionesDisponibles}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Porcentaje de Uso:</span>
                        <span className="font-semibold">{uso.porcentajeUso.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, uso.porcentajeUso)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })()}

            {/* Uso por Miembro */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Uso por Miembro</h4>
              <div className="space-y-3">
                {suscripcionesMiembros.length > 0 ? (
                  suscripcionesMiembros.map((suscripcion) => {
                    const sesionesIncluidas = suscripcion.sesionesIncluidas || 0;
                    const sesionesUsadas = suscripcion.sesionesUsadas || 0;
                    const sesionesDisponibles = sesionesIncluidas - sesionesUsadas;
                    const porcentajeUso = sesionesIncluidas > 0 ? (sesionesUsadas / sesionesIncluidas) * 100 : 0;
                    
                    return (
                      <Card key={suscripcion.id} className="bg-white p-4 border">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">{suscripcion.clienteNombre}</div>
                            <div className="text-sm text-gray-600">{suscripcion.clienteEmail}</div>
                          </div>
                          <Badge color={porcentajeUso > 80 ? 'success' : porcentajeUso > 50 ? 'warning' : 'error'}>
                            {porcentajeUso.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="space-y-1 mt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Usadas:</span>
                            <span className="font-semibold">{sesionesUsadas}/{sesionesIncluidas}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Disponibles:</span>
                            <span className="font-semibold text-green-600">{sesionesDisponibles}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(100, porcentajeUso)}%` }}
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Cargando información de miembros...
                  </div>
                )}
              </div>
            </div>

            {/* Prorrateo */}
            {(() => {
              const prorrateo = calcularProrrateo(grupoSeleccionado);
              if (prorrateo.aplicado) {
                return (
                  <Card className="bg-yellow-50 p-4 border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Información de Prorrateo</h4>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-700">{prorrateo.motivo}</div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto Prorrateado:</span>
                        <span className="font-semibold">{prorrateo.montoProrrateado?.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Días Transcurridos:</span>
                        <span className="font-semibold">{prorrateo.diasTranscurridos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Días Restantes:</span>
                        <span className="font-semibold">{prorrateo.diasRestantes}</span>
                      </div>
                    </div>
                  </Card>
                );
              }
              return null;
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

