import React, { useState, useEffect } from 'react';
import { usePoliciesAPI } from '../api/usePoliciesAPI';
import { Policy, PolicyVersion } from '../types';
import PolicyCard from './PolicyCard';
import PolicyEditor from './PolicyEditor';
import VersionHistory from './VersionHistory';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Plus, Search, AlertCircle, FileText } from 'lucide-react';

const PoliciesManagerContainer: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [currentVersion, setCurrentVersion] = useState<PolicyVersion | null>(null);
  const [versions, setVersions] = useState<PolicyVersion[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { loading, error, getPolicies, getPolicyVersions, createPolicy, createVersion } = usePoliciesAPI();

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('Error al cargar políticas:', error);
    }
  };

  const handleCreate = () => {
    setSelectedPolicy(null);
    setCurrentVersion(null);
    setIsEditorOpen(true);
  };

  const handleEdit = async (policy: Policy) => {
    try {
      setSelectedPolicy(policy);
      const versionData = await getPolicyVersions(policy.id);
      if (versionData.length > 0) {
        setCurrentVersion(versionData[0]);
      } else {
        setCurrentVersion(null);
      }
      setIsEditorOpen(true);
    } catch (error) {
      console.error('Error al cargar política:', error);
    }
  };

  const handleViewHistory = async (policyId: string) => {
    try {
      const versionData = await getPolicyVersions(policyId);
      setVersions(versionData);
      const policy = policies.find(p => p.id === policyId);
      setIsHistoryOpen(true);
      setSelectedPolicy(policy || null);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleSave = async (content: string, requireReAcceptance: boolean) => {
    if (!selectedPolicy) {
      alert('Selecciona una política para editar');
      return;
    }

    try {
      await createVersion(selectedPolicy.id, content, requireReAcceptance);
      await loadPolicies();
      setIsEditorOpen(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  };

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDefaultPolicies = () => {
    const types: Array<{ type: 'CANCELLATION' | 'GDPR' | 'FACILITY_RULES', title: string }> = [
      { type: 'CANCELLATION', title: 'Política de Cancelación de Membresías' },
      { type: 'GDPR', title: 'Política de Privacidad (RGPD)' },
      { type: 'FACILITY_RULES', title: 'Normas de Uso de Instalaciones' },
    ];

    return types.map(type => {
      const existing = policies.find(p => p.type === type.type);
      return existing ? null : type;
    }).filter(Boolean);
  };

  const defaultPolicies = getDefaultPolicies();

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          onClick={handleCreate}
          leftIcon={<Plus size={20} className="mr-2" />}
          disabled={isEditorOpen}
        >
          Nueva Política
        </Button>
      </div>

      {/* Sistema de búsqueda */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar políticas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Error message */}
      {error && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </Card>
      )}

      {/* Editor view */}
      {isEditorOpen ? (
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => setIsEditorOpen(false)}
            className="mb-4"
          >
            ← Volver a políticas
          </Button>
          <PolicyEditor
            policy={selectedPolicy}
            currentVersion={currentVersion}
            onSave={handleSave}
            loading={loading}
          />
        </div>
      ) : (
        <>
          {/* Default policies to create */}
          {defaultPolicies.length > 0 && (
            <Card className="p-4 bg-white shadow-sm">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Crear Políticas por Defecto
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Para empezar, puedes crear las políticas básicas que todo gimnasio necesita:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {defaultPolicies.map((policy, idx) => (
                    policy && (
                      <Button
                        key={idx}
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={async () => {
                          try {
                            const defaultContent = '<h2>Contenido por defecto</h2><p>Edita este contenido para personalizar tu política.</p>';
                            await createPolicy(policy.type, policy.title, defaultContent);
                            await loadPolicies();
                          } catch (error) {
                            console.error('Error al crear política:', error);
                          }
                        }}
                      >
                        {policy.title}
                      </Button>
                    )
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Policies grid */}
          {loading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : filteredPolicies.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No se encontraron políticas' : 'No hay políticas creadas'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Comienza creando tu primera política o usa las plantillas por defecto'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPolicies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onEdit={handleEdit}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Version History Modal */}
      <VersionHistory
        versions={versions}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        policyTitle={selectedPolicy?.title}
      />
    </div>
  );
};

export default PoliciesManagerContainer;

