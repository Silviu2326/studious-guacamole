import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Input, Textarea } from '../../../components/componentsreutilizables';
import {
  PlantillaCheckInNutricional,
  PreguntaCampo,
  getPlantillas,
  crearPlantilla,
  actualizarPlantilla,
  eliminarPlantilla,
  ensureDefaultTemplates,
  setPlantillaActivaParaCliente,
  getPlantillaActivaPorCliente,
} from '../api/plantillas';

interface GestorPlantillasCheckInNutricionalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId?: string;
}

export const GestorPlantillasCheckInNutricional: React.FC<GestorPlantillasCheckInNutricionalProps> = ({
  isOpen,
  onClose,
  clienteId,
}) => {
  const [plantillas, setPlantillas] = useState<PlantillaCheckInNutricional[]>([]);
  const [activaId, setActivaId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PlantillaCheckInNutricional | null>(null);

  const [form, setForm] = useState<{
    nombre: string;
    descripcion: string;
    preguntas: PreguntaCampo[];
  }>({
    nombre: '',
    descripcion: '',
    preguntas: [],
  });

  useEffect(() => {
    if (!isOpen) return;
    cargar();
  }, [isOpen]);

  const cargar = async () => {
    await ensureDefaultTemplates();
    const list = await getPlantillas();
    setPlantillas(list);
    if (clienteId) {
      const activa = await getPlantillaActivaPorCliente(clienteId);
      setActivaId(activa?.id || null);
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', preguntas: [] });
    setEditing(null);
  };

  const addPregunta = () => {
    const nueva: PreguntaCampo = {
      id: 'q_' + Math.random().toString(36).slice(2, 8),
      etiqueta: 'Nueva pregunta',
      clave: 'campo_' + Math.random().toString(36).slice(2, 6),
      tipo: 'text',
      requerido: false,
      orden: (form.preguntas?.length || 0) + 1,
    };
    setForm({ ...form, preguntas: [...form.preguntas, nueva] });
  };

  const updatePregunta = (id: string, updates: Partial<PreguntaCampo>) => {
    setForm({
      ...form,
      preguntas: form.preguntas.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const removePregunta = (id: string) => {
    setForm({
      ...form,
      preguntas: form.preguntas.filter((p) => p.id !== id),
    });
  };

  const handleSave = async () => {
    if (!form.nombre || form.preguntas.length === 0) {
      alert('Define un nombre y al menos una pregunta');
      return;
    }
    if (editing) {
      await actualizarPlantilla(editing.id, {
        ...editing,
        nombre: form.nombre,
        descripcion: form.descripcion,
        preguntas: form.preguntas,
      });
    } else {
      await crearPlantilla({
        nombre: form.nombre,
        descripcion: form.descripcion,
        preguntas: form.preguntas,
        creadaPor: 'entrenador',
      } as any);
    }
    resetForm();
    setShowForm(false);
    await cargar();
  };

  const handleEdit = (tpl: PlantillaCheckInNutricional) => {
    setEditing(tpl);
    setForm({
      nombre: tpl.nombre,
      descripcion: tpl.descripcion || '',
      preguntas: tpl.preguntas,
    });
    setShowForm(true);
  };

  const handleDelete = async (tpl: PlantillaCheckInNutricional) => {
    if (confirm('¿Eliminar plantilla?')) {
      await eliminarPlantilla(tpl.id);
      await cargar();
    }
  };

  const handleActivar = async (tplId: string) => {
    if (!clienteId) return;
    await setPlantillaActivaParaCliente(clienteId, tplId);
    setActivaId(tplId);
  };

  const handleDesactivar = async () => {
    if (!clienteId) return;
    await setPlantillaActivaParaCliente(clienteId, null);
    setActivaId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plantillas de Check-in Nutricional">
      <div className="space-y-4">
        {/* Lista */}
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">Plantillas</h3>
            <Button onClick={() => { resetForm(); setShowForm(true); }}>Nueva plantilla</Button>
          </div>
          <div className="space-y-3">
            {plantillas.map((tpl) => (
              <div key={tpl.id} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{tpl.nombre}</div>
                  <div className="text-xs text-slate-500">
                    {tpl.preguntas.length} preguntas • {tpl.creadaPor === 'sistema' ? 'Sistema' : 'Entrenador'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {clienteId && (
                    activaId === tpl.id ? (
                      <Button variant="secondary" onClick={handleDesactivar}>Desactivar</Button>
                    ) : (
                      <Button onClick={() => handleActivar(tpl.id)}>Activar</Button>
                    )
                  )}
                  <Button variant="secondary" onClick={() => handleEdit(tpl)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(tpl)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Formulario de edición/creación */}
        {showForm && (
          <Card className="p-4 bg-white">
            <div className="space-y-3">
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre de la plantilla"
              />
              <Textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción (opcional)"
                rows={2}
              />
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700">Preguntas</h4>
                <Button variant="secondary" onClick={addPregunta}>Añadir pregunta</Button>
              </div>
              <div className="space-y-2">
                {form.preguntas.map((p) => (
                  <div key={p.id} className="border rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={p.etiqueta}
                        onChange={(e) => updatePregunta(p.id, { etiqueta: e.target.value })}
                        placeholder="Etiqueta"
                      />
                      <Input
                        value={p.clave}
                        onChange={(e) => updatePregunta(p.id, { clave: e.target.value })}
                        placeholder="Clave de almacenamiento"
                      />
                      <select
                        value={p.tipo}
                        onChange={(e) => updatePregunta(p.id, { tipo: e.target.value as any })}
                        className="rounded-xl ring-1 ring-slate-300 px-3 py-2"
                      >
                        <option value="text">Texto</option>
                        <option value="textarea">Texto largo</option>
                        <option value="number">Número</option>
                        <option value="boolean">Sí/No</option>
                        <option value="select">Selección</option>
                        <option value="scale">Escala</option>
                      </select>
                      <Input
                        type="number"
                        value={p.orden || 0}
                        onChange={(e) => updatePregunta(p.id, { orden: Number(e.target.value) })}
                        placeholder="Orden"
                      />
                      {(p.tipo === 'number' || p.tipo === 'scale') && (
                        <>
                          <Input
                            type="number"
                            value={p.min ?? ''}
                            onChange={(e) => updatePregunta(p.id, { min: Number(e.target.value) })}
                            placeholder="Mín"
                          />
                          <Input
                            type="number"
                            value={p.max ?? ''}
                            onChange={(e) => updatePregunta(p.id, { max: Number(e.target.value) })}
                            placeholder="Máx"
                          />
                        </>
                      )}
                    </div>
                    {p.tipo === 'select' && (
                      <div className="space-y-1">
                        <label className="text-xs text-slate-600">Opciones (formato: valor|etiqueta, una por línea)</label>
                        <Textarea
                          value={(p.opciones || []).map(o => `${o.value}|${o.label}`).join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n').filter(l => l.trim());
                            const opciones = lines.map(line => {
                              const [value, label] = line.split('|').map(s => s.trim());
                              return { value: value || line.trim(), label: label || value || line.trim() };
                            });
                            updatePregunta(p.id, { opciones });
                          }}
                          placeholder="valor1|Etiqueta 1&#10;valor2|Etiqueta 2"
                          rows={3}
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <Textarea
                        value={p.ayuda || ''}
                        onChange={(e) => updatePregunta(p.id, { ayuda: e.target.value })}
                        placeholder="Ayuda (opcional)"
                        rows={2}
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!p.requerido}
                          onChange={(e) => updatePregunta(p.id, { requerido: e.target.checked })}
                        />
                        Requerido
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="danger" onClick={() => removePregunta(p.id)}>Eliminar pregunta</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={() => { resetForm(); setShowForm(false); }}>Cancelar</Button>
                <Button onClick={handleSave}>{editing ? 'Guardar cambios' : 'Crear plantilla'}</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
};

