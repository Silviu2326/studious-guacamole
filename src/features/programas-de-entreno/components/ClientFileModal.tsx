import { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../components/componentsreutilizables/Modal';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { 
  User, Target, History, AlertTriangle, StickyNote, X, 
  Mail, Phone, Calendar, TrendingUp, CheckCircle2, Clock,
  Download, FileText, AtSign, Edit2, Trash2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { exportToPDF, exportToCSV } from '../utils/exportClientFile';
import { TeamService } from '../../equipo-roles/api';
import type { TeamMember } from '../../equipo-roles/types';

interface ClientFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName?: string;
}

type TabId = 'perfil' | 'objetivos' | 'historial' | 'alertas' | 'notas';

interface ClientProfile {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  altura?: number;
  peso?: number;
  objetivoPrincipal?: string;
  estado: 'activo' | 'inactivo' | 'pausado';
  fechaInicio?: string;
  entrenador?: string;
}

interface ClientObjective {
  id: string;
  titulo: string;
  descripcion?: string;
  progreso: number;
  estado: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
  fechaInicio: string;
  fechaLimite?: string;
}

interface ClientHistoryItem {
  id: string;
  fecha: string;
  tipo: 'entrenamiento' | 'checkin' | 'medicion' | 'nota' | 'objetivo';
  titulo: string;
  descripcion?: string;
}

interface ClientAlert {
  id: string;
  tipo: 'warning' | 'error' | 'info';
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
}

interface Mention {
  userId: string;
  userName: string;
  userEmail?: string;
  position: number;
  length: number;
}

interface ClientNote {
  id: string;
  fecha: string;
  autor: string;
  autorId?: string;
  contenido: string;
  tipo?: 'general' | 'entrenamiento' | 'nutricion' | 'medico';
  menciones?: Mention[];
  editadoPor?: string;
  fechaEdicion?: string;
}

export function ClientFileModal({ open, onOpenChange, clientId, clientName }: ClientFileModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('perfil');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [objectives, setObjectives] = useState<ClientObjective[]>([]);
  const [history, setHistory] = useState<ClientHistoryItem[]>([]);
  const [alerts, setAlerts] = useState<ClientAlert[]>([]);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState<'general' | 'entrenamiento' | 'nutricion' | 'medico'>('general');
  
  // Estados para menciones
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedMentions, setSelectedMentions] = useState<Mention[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Estados para edición de notas
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  useEffect(() => {
    if (open && clientId) {
      loadClientData();
      loadTeamMembers();
    }
  }, [open, clientId]);

  const loadTeamMembers = async () => {
    try {
      const membersResponse = await TeamService.getMembers({ limit: 100 });
      setTeamMembers(membersResponse.data);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const loadClientData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos (en producción vendría de API)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Datos mock
      setProfile({
        id: clientId,
        nombre: clientName || 'Cliente',
        email: 'cliente@example.com',
        telefono: '+34 600 000 000',
        fechaNacimiento: '1990-01-01',
        genero: 'Masculino',
        altura: 175,
        peso: 75,
        objetivoPrincipal: 'Ganancia de masa muscular',
        estado: 'activo',
        fechaInicio: '2024-01-15',
        entrenador: 'Juan Pérez',
      });

      setObjectives([
        {
          id: '1',
          titulo: 'Aumentar masa muscular',
          descripcion: 'Ganar 5kg de masa muscular en 6 meses',
          progreso: 60,
          estado: 'in_progress',
          fechaInicio: '2024-01-15',
          fechaLimite: '2024-07-15',
        },
        {
          id: '2',
          titulo: 'Reducir grasa corporal',
          descripcion: 'Bajar grasa corporal al 15%',
          progreso: 40,
          estado: 'in_progress',
          fechaInicio: '2024-01-15',
          fechaLimite: '2024-06-15',
        },
      ]);

      setHistory([
        {
          id: '1',
          fecha: '2024-11-20',
          tipo: 'entrenamiento',
          titulo: 'Sesión completada',
          descripcion: 'Rutina de fuerza - Piernas',
        },
        {
          id: '2',
          fecha: '2024-11-18',
          tipo: 'checkin',
          titulo: 'Check-in semanal',
          descripcion: 'Progreso: +2kg en press banca',
        },
        {
          id: '3',
          fecha: '2024-11-15',
          tipo: 'medicion',
          titulo: 'Medición corporal',
          descripcion: 'Peso: 75kg, Grasa: 18%',
        },
      ]);

      setAlerts([
        {
          id: '1',
          tipo: 'warning',
          titulo: 'Falta de asistencia',
          descripcion: 'El cliente ha faltado a 2 sesiones consecutivas',
          fecha: '2024-11-19',
          leida: false,
        },
        {
          id: '2',
          tipo: 'info',
          titulo: 'Objetivo en riesgo',
          descripcion: 'El objetivo "Reducir grasa corporal" está por debajo del progreso esperado',
          fecha: '2024-11-17',
          leida: true,
        },
      ]);

      // Cargar notas desde localStorage si existen
      const savedNotes = localStorage.getItem(`client-notes-${clientId}`);
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch {
          // Si hay error, usar notas por defecto
          setNotes([
            {
              id: '1',
              fecha: '2024-11-20',
              autor: 'Juan Pérez',
              contenido: 'Cliente muy motivado. Buen progreso en las últimas semanas.',
              tipo: 'general',
            },
            {
              id: '2',
              fecha: '2024-11-15',
              autor: 'Juan Pérez',
              contenido: 'Notar que el cliente tiene molestias en la rodilla izquierda. Ajustar ejercicios de piernas.',
              tipo: 'medico',
            },
          ]);
        }
      } else {
        setNotes([
          {
            id: '1',
            fecha: '2024-11-20',
            autor: 'Juan Pérez',
            contenido: 'Cliente muy motivado. Buen progreso en las últimas semanas.',
            tipo: 'general',
          },
          {
            id: '2',
            fecha: '2024-11-15',
            autor: 'Juan Pérez',
            contenido: 'Notar que el cliente tiene molestias en la rodilla izquierda. Ajustar ejercicios de piernas.',
            tipo: 'medico',
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    if (editingNoteId) {
      setEditingNoteContent(value);
    } else {
      setNewNote(value);
    }
    
    // Detectar @ para mostrar mención
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Si no hay espacio después del @, mostrar sugerencias
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionQuery(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentions(true);
        return;
      }
    }
    
    setShowMentions(false);
  };

  const handleMentionSelect = (member: TeamMember) => {
    const currentText = editingNoteId ? editingNoteContent : newNote;
    const textBeforeMention = currentText.substring(0, mentionPosition);
    const textAfterMention = currentText.substring(mentionPosition + mentionQuery.length + 1);
    const mentionText = `@${member.name} `;
    
    const updatedText = textBeforeMention + mentionText + textAfterMention;
    
    if (editingNoteId) {
      setEditingNoteContent(updatedText);
    } else {
      setNewNote(updatedText);
    }
    
    // Agregar mención a la lista
    const mention: Mention = {
      userId: member.id,
      userName: member.name,
      userEmail: member.email,
      position: mentionPosition,
      length: mentionText.length - 1, // Sin el espacio final
    };
    
    // Si estamos editando, necesitamos actualizar las posiciones de las menciones existentes
    // que vienen después de la nueva mención
    let updatedMentions: Mention[];
    if (editingNoteId && selectedMentions.length > 0) {
      updatedMentions = selectedMentions.map(m => {
        if (m.position > mentionPosition) {
          return {
            ...m,
            position: m.position + mentionText.length - mentionQuery.length - 1,
          };
        }
        return m;
      });
      updatedMentions.push(mention);
    } else {
      updatedMentions = [...selectedMentions, mention];
    }
    
    setSelectedMentions(updatedMentions);
    
    setShowMentions(false);
    setMentionQuery('');
    
    // Restaurar foco en textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPosition = mentionPosition + mentionText.length;
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: ClientNote = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      autor: user?.name || 'Usuario',
      autorId: user?.id,
      contenido: newNote,
      tipo: newNoteType,
      menciones: selectedMentions.length > 0 ? selectedMentions : undefined,
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    setNewNote('');
    setSelectedMentions([]);
    
    // Guardar en localStorage
    localStorage.setItem(`client-notes-${clientId}`, JSON.stringify(updatedNotes));
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditingNoteContent(note.contenido);
      setSelectedMentions(note.menciones || []);
    }
  };

  const handleSaveEdit = () => {
    if (!editingNoteId || !editingNoteContent.trim()) return;

    const updatedNotes = notes.map(note => {
      if (note.id === editingNoteId) {
        return {
          ...note,
          contenido: editingNoteContent,
          menciones: selectedMentions.length > 0 ? selectedMentions : note.menciones,
          editadoPor: user?.name || 'Usuario',
          fechaEdicion: new Date().toISOString(),
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingNoteContent('');
    setSelectedMentions([]);
    
    // Guardar en localStorage
    localStorage.setItem(`client-notes-${clientId}`, JSON.stringify(updatedNotes));
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteContent('');
    setSelectedMentions([]);
    setShowMentions(false);
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      const updatedNotes = notes.filter(n => n.id !== noteId);
      setNotes(updatedNotes);
      
      // Guardar en localStorage
      localStorage.setItem(`client-notes-${clientId}`, JSON.stringify(updatedNotes));
    }
  };

  const renderMentions = (content: string, mentions?: Mention[]) => {
    if (!mentions || mentions.length === 0) {
      return <span>{content}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const sortedMentions = [...mentions].sort((a, b) => a.position - b.position);

    sortedMentions.forEach((mention, index) => {
      if (mention.position > lastIndex) {
        parts.push(<span key={`text-${index}`}>{content.substring(lastIndex, mention.position)}</span>);
      }

      parts.push(
        <span
          key={`mention-${index}`}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium"
        >
          <AtSign className="w-3 h-3" />
          {mention.userName}
        </span>
      );

      lastIndex = mention.position + mention.length;
    });

    if (lastIndex < content.length) {
      parts.push(<span key="text-end">{content.substring(lastIndex)}</span>);
    }

    return <span>{parts}</span>;
  };

  const handleExportPDF = () => {
    exportToPDF(
      {
        profile,
        objectives,
        history,
        alerts,
        notes,
      },
      clientName || 'Cliente'
    );
  };

  const handleExportCSV = () => {
    exportToCSV(
      {
        profile,
        objectives,
        history,
        alerts,
        notes,
      },
      clientName || 'Cliente'
    );
  };

  const tabs = [
    { id: 'perfil' as TabId, label: 'Perfil', icon: User },
    { id: 'objetivos' as TabId, label: 'Objetivos', icon: Target },
    { id: 'historial' as TabId, label: 'Historial', icon: History },
    { id: 'alertas' as TabId, label: 'Alertas', icon: AlertTriangle },
    { id: 'notas' as TabId, label: 'Notas', icon: StickyNote },
  ];

  const getStatusBadge = (estado: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      activo: 'default',
      inactivo: 'secondary',
      pausado: 'outline',
      achieved: 'default',
      in_progress: 'default',
      at_risk: 'destructive',
      failed: 'destructive',
      not_started: 'secondary',
    };
    return <Badge variant={variants[estado] || 'default'}>{estado}</Badge>;
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del cliente...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-4">
            {profile && (
              <>
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{profile.nombre}</h3>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                    {getStatusBadge(profile.estado)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {profile.email || 'No disponible'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {profile.telefono || 'No disponible'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {profile.fechaNacimiento || 'No disponible'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                    <p className="text-sm text-gray-900">{profile.genero || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
                    <p className="text-sm text-gray-900">{profile.altura ? `${profile.altura} cm` : 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
                    <p className="text-sm text-gray-900">{profile.peso ? `${profile.peso} kg` : 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo Principal</label>
                    <p className="text-sm text-gray-900">{profile.objetivoPrincipal || 'No definido'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entrenador</label>
                    <p className="text-sm text-gray-900">{profile.entrenador || 'No asignado'}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'objetivos':
        return (
          <div className="space-y-4">
            {objectives.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay objetivos asignados</p>
              </div>
            ) : (
              objectives.map((obj) => (
                <Card key={obj.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{obj.titulo}</h4>
                      {obj.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{obj.descripcion}</p>
                      )}
                    </div>
                    {getStatusBadge(obj.estado)}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-medium text-gray-900">{obj.progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${obj.progreso}%` }}
                      />
                    </div>
                  </div>
                  {obj.fechaLimite && (
                    <div className="mt-2 text-xs text-gray-500">
                      Fecha límite: {new Date(obj.fechaLimite).toLocaleDateString('es-ES')}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        );

      case 'historial':
        return (
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay historial disponible</p>
              </div>
            ) : (
              history.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {item.tipo === 'entrenamiento' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                      {item.tipo === 'checkin' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {item.tipo === 'medicion' && <Target className="w-5 h-5 text-purple-500" />}
                      {item.tipo === 'nota' && <StickyNote className="w-5 h-5 text-yellow-500" />}
                      {item.tipo === 'objetivo' && <Target className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{item.titulo}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(item.fecha).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      {item.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{item.descripcion}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );

      case 'alertas':
        return (
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay alertas</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id} className={`p-4 ${!alert.leida ? 'border-l-4 border-l-yellow-500' : ''}`}>
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.tipo)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{alert.titulo}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(alert.fecha).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.descripcion}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );

      case 'notas':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-gray-900">
                {editingNoteId ? 'Editar Nota' : 'Nueva Nota'}
              </h4>
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={editingNoteId ? editingNoteContent : newNote}
                  onChange={handleInputChange}
                  placeholder="Escribe una nota sobre el cliente... Usa @ para mencionar a otros entrenadores"
                  rows={4}
                  className="pr-10"
                />
                {showMentions && filteredMembers.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleMentionSelect(member)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      >
                        <AtSign className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          {member.email && (
                            <div className="text-xs text-gray-500">{member.email}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={!!editingNoteId}
                >
                  <option value="general">General</option>
                  <option value="entrenamiento">Entrenamiento</option>
                  <option value="nutricion">Nutrición</option>
                  <option value="medico">Médico</option>
                </select>
                {editingNoteId ? (
                  <>
                    <Button onClick={handleSaveEdit} size="sm">
                      Guardar
                    </Button>
                    <Button onClick={handleCancelEdit} size="sm" variant="outline">
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddNote} size="sm">
                    Agregar Nota
                  </Button>
                )}
              </div>
              {selectedMentions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-600">Menciones:</span>
                  {selectedMentions.map((mention, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      <AtSign className="w-3 h-3" />
                      {mention.userName}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay notas</p>
                </div>
              ) : (
                notes.map((note) => (
                  <Card key={note.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{note.autor}</span>
                          {note.tipo && (
                            <Badge variant="secondary" className="text-xs">
                              {note.tipo}
                            </Badge>
                          )}
                          {note.menciones && note.menciones.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <AtSign className="w-3 h-3" />
                              <span>{note.menciones.length} mención{note.menciones.length > 1 ? 'es' : ''}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(note.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {note.editadoPor && (
                            <span className="ml-2 italic">
                              (Editado por {note.editadoPor} el {note.fechaEdicion ? new Date(note.fechaEdicion).toLocaleDateString('es-ES') : ''})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {note.autorId === user?.id && (
                          <>
                            <button
                              onClick={() => handleEditNote(note.id)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Editar nota"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar nota"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {renderMentions(note.contenido, note.menciones)}
                    </div>
                    {note.menciones && note.menciones.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1">
                          {note.menciones.map((mention, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                              <AtSign className="w-3 h-3" />
                              {mention.userName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Ficha del Cliente: ${clientName || 'Cliente'}`}
      size="xl"
    >
      <div className="space-y-4">
        {/* Botones de Exportación */}
        <div className="flex justify-end gap-2 pb-2 border-b">
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Exportar PDF
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </Modal>
  );
}

