import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  NutritionPlanShare,
  Nutritionist,
  NutritionPlanPermissions,
  NutritionPlanComment,
  NutritionPlanAdjustment,
} from '../types/nutrition-sharing';
import {
  getNutritionists,
  searchNutritionists,
  shareNutritionPlan,
  getSharedPlans,
  updateSharedPlanPermissions,
  respondToSharedPlan,
  revokeSharedPlan,
  addPlanComment,
  getPlanComments,
  recordPlanAdjustment,
  getPlanAdjustments,
} from '../api/nutrition-sharing';
import { getDietas } from '../../dietas-asignadas/api/dietas';
import { Dieta } from '../../dietas-asignadas/types';
import {
  Users,
  Share2,
  MessageSquare,
  Settings,
  Check,
  X,
  Eye,
  Edit,
  Lock,
  Unlock,
  Plus,
  Loader2,
  AlertCircle,
  UserPlus,
  ChefHat,
  FileText,
  Calendar,
} from 'lucide-react';

interface NutritionSharingPanelProps {
  clienteId: string;
  clienteName: string;
}

export const NutritionSharingPanel: React.FC<NutritionSharingPanelProps> = ({
  clienteId,
  clienteName,
}) => {
  const { user } = useAuth();
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [sharedPlans, setSharedPlans] = useState<NutritionPlanShare[]>([]);
  const [comments, setComments] = useState<Record<string, NutritionPlanComment[]>>({});
  const [adjustments, setAdjustments] = useState<Record<string, NutritionPlanAdjustment[]>>({});
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState<string>('');
  const [selectedDieta, setSelectedDieta] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanShare, setSelectedPlanShare] = useState<NutritionPlanShare | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [permissions, setPermissions] = useState<NutritionPlanPermissions>({
    puedeVer: true,
    puedeEditar: true,
    puedeComentar: true,
    puedeAjustarMacros: true,
    puedeVerHistorial: true,
    puedeAsignarComidas: false,
  });

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user, clienteId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [nutritionistsData, sharedPlansData, dietasData] = await Promise.all([
        getNutritionists(),
        getSharedPlans(user?.id || '', clienteId),
        getDietas({ clienteId, estado: 'activa' }),
      ]);

      setNutritionists(nutritionistsData);
      setSharedPlans(sharedPlansData);
      setDietas(dietasData);

      // Cargar comentarios y ajustes para cada plan compartido
      const commentsData: Record<string, NutritionPlanComment[]> = {};
      const adjustmentsData: Record<string, NutritionPlanAdjustment[]> = {};

      for (const share of sharedPlansData) {
        const [shareComments, shareAdjustments] = await Promise.all([
          getPlanComments(share.id),
          getPlanAdjustments(share.id),
        ]);
        commentsData[share.id] = shareComments;
        adjustmentsData[share.id] = shareAdjustments;
      }

      setComments(commentsData);
      setAdjustments(adjustmentsData);
    } catch (error) {
      console.error('Error cargando datos de compartir planes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchNutritionists = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const results = await searchNutritionists(query);
        setNutritionists(results);
      } catch (error) {
        console.error('Error buscando nutricionistas:', error);
      }
    } else {
      const all = await getNutritionists();
      setNutritionists(all);
    }
  };

  const handleSharePlan = async () => {
    if (!selectedNutritionist || !selectedDieta) {
      alert('Por favor selecciona un nutricionista y una dieta');
      return;
    }

    const nutritionist = nutritionists.find(n => n.id === selectedNutritionist);
    const dieta = dietas.find(d => d.id === selectedDieta);
    
    if (!nutritionist || !dieta) return;

    setSharing(true);
    try {
      await shareNutritionPlan(
        dieta.id,
        dieta.nombre,
        clienteId,
        clienteName,
        user?.id || '',
        user?.name || 'Entrenador',
        selectedNutritionist,
        nutritionist.name,
        permissions
      );
      setShowShareModal(false);
      setSelectedNutritionist('');
      setSelectedDieta('');
      await loadData();
    } catch (error) {
      console.error('Error compartiendo plan:', error);
      alert('Error al compartir el plan');
    } finally {
      setSharing(false);
    }
  };

  const handleUpdatePermissions = async (shareId: string) => {
    try {
      await updateSharedPlanPermissions(shareId, permissions);
      setShowPermissionsModal(false);
      await loadData();
    } catch (error) {
      console.error('Error actualizando permisos:', error);
    }
  };

  const handleRevokeShare = async (shareId: string) => {
    if (!confirm('¿Estás seguro de que quieres revocar el acceso a este plan?')) return;

    try {
      await revokeSharedPlan(shareId);
      await loadData();
    } catch (error) {
      console.error('Error revocando acceso:', error);
    }
  };

  const getStatusBadge = (estado: NutritionPlanShare['estado']) => {
    switch (estado) {
      case 'aceptado':
        return <Badge variant="green">Aceptado</Badge>;
      case 'pendiente':
        return <Badge variant="yellow">Pendiente</Badge>;
      case 'rechazado':
        return <Badge variant="red">Rechazado</Badge>;
      case 'revocado':
        return <Badge variant="gray">Revocado</Badge>;
      default:
        return <Badge variant="gray">{estado}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Cargando planes compartidos...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Compartir Plan Nutricional
          </h3>
          <p className="text-sm text-gray-600">
            Comparte planes nutricionales con nutricionistas aliados para coordinar ajustes
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowShareModal(true)}
          leftIcon={<Share2 className="w-4 h-4" />}
          disabled={dietas.length === 0}
        >
          Compartir Plan
        </Button>
      </div>

      {/* Lista de planes compartidos */}
      {sharedPlans.length === 0 ? (
        <Card className="p-8 text-center">
          <Share2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            {dietas.length === 0 
              ? 'Este cliente no tiene dietas activas. Asigna una dieta primero para poder compartirla.'
              : 'No hay planes compartidos para este cliente'}
          </p>
          {dietas.length > 0 && (
            <Button variant="primary" onClick={() => setShowShareModal(true)}>
              Compartir Primer Plan
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {sharedPlans.map(share => (
            <Card key={share.id} variant="hover" className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <ChefHat className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {share.planNutricionalNombre}
                    </h4>
                    {getStatusBadge(share.estado)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Nutricionista: <strong>{share.nutritionistName}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Cliente: <strong>{share.clienteName}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Compartido: {new Date(share.fechaCompartido).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>

                  {/* Permisos */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {share.permisos.puedeVer && (
                      <Badge variant="blue" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Badge>
                    )}
                    {share.permisos.puedeEditar && (
                      <Badge variant="green" className="text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Badge>
                    )}
                    {share.permisos.puedeComentar && (
                      <Badge variant="purple" className="text-xs">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Comentar
                      </Badge>
                    )}
                    {share.permisos.puedeAjustarMacros && (
                      <Badge variant="orange" className="text-xs">
                        Ajustar Macros
                      </Badge>
                    )}
                    {share.permisos.puedeVerHistorial && (
                      <Badge variant="gray" className="text-xs">
                        Ver Historial
                      </Badge>
                    )}
                    {share.permisos.puedeAsignarComidas && (
                      <Badge variant="yellow" className="text-xs">
                        Asignar Comidas
                      </Badge>
                    )}
                  </div>

                  {/* Comentarios y ajustes */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Comentarios</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {comments[share.id]?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Ajustes</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {adjustments[share.id]?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPlanShare(share);
                      setPermissions(share.permisos);
                      setShowPermissionsModal(true);
                    }}
                    leftIcon={<Settings className="w-4 h-4" />}
                  >
                    Permisos
                  </Button>
                  {share.estado === 'aceptado' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeShare(share.id)}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Revocar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para compartir plan */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Compartir Plan Nutricional
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Dieta
                </label>
                <select
                  value={selectedDieta}
                  onChange={e => setSelectedDieta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona una dieta</option>
                  {dietas.map(dieta => (
                    <option key={dieta.id} value={dieta.id}>
                      {dieta.nombre} - {dieta.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Nutricionista
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchNutritionists(e.target.value)}
                  placeholder="Buscar por nombre o especialidad..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Nutricionista
                </label>
                <select
                  value={selectedNutritionist}
                  onChange={e => setSelectedNutritionist(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un nutricionista</option>
                  {nutritionists.map(nutritionist => (
                    <option key={nutritionist.id} value={nutritionist.id}>
                      {nutritionist.name} - {nutritionist.especialidades?.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowShareModal(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSharePlan}
                  loading={sharing}
                  fullWidth
                >
                  Compartir
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal para editar permisos */}
      {showPermissionsModal && selectedPlanShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Editar Permisos
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.puedeVer}
                    onChange={e =>
                      setPermissions({ ...permissions, puedeVer: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Puede ver el plan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.puedeEditar}
                    onChange={e =>
                      setPermissions({ ...permissions, puedeEditar: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Puede editar el plan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.puedeComentar}
                    onChange={e =>
                      setPermissions({ ...permissions, puedeComentar: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Puede comentar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.puedeAjustarMacros}
                    onChange={e =>
                      setPermissions({
                        ...permissions,
                        puedeAjustarMacros: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Puede ajustar macros</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.puedeVerHistorial}
                    onChange={e =>
                      setPermissions({
                        ...permissions,
                        puedeVerHistorial: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Puede ver historial</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.puedeAsignarComidas}
                    onChange={e =>
                      setPermissions({
                        ...permissions,
                        puedeAsignarComidas: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Puede asignar comidas</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowPermissionsModal(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleUpdatePermissions(selectedPlanShare.id)}
                  fullWidth
                >
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

