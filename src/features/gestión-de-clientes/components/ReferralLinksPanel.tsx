import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  ReferralLink,
  ReferralUsage,
  ReferralBenefit,
  BenefitConfig,
} from '../types/referrals';
import {
  getReferralLinks,
  createReferralLink,
  updateReferralLink,
  deactivateReferralLink,
  getReferralUsages,
  getReferralBenefits,
  getReferralStats,
  trackReferralClick,
} from '../api/referrals';
import {
  Link2,
  Copy,
  Check,
  X,
  TrendingUp,
  Users,
  Gift,
  DollarSign,
  Eye,
  Plus,
  Settings,
  ExternalLink,
  Loader2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { getClients } from '../api/clients';
import { Client } from '../types';

interface ReferralLinksPanelProps {
  clienteId?: string;
  clienteName?: string;
  onLinkCreated?: (link: ReferralLink) => void;
}

export const ReferralLinksPanel: React.FC<ReferralLinksPanelProps> = ({
  clienteId,
  clienteName,
  onLinkCreated,
}) => {
  const { user } = useAuth();
  const [links, setLinks] = useState<ReferralLink[]>([]);
  const [usages, setUsages] = useState<ReferralUsage[]>([]);
  const [benefits, setBenefits] = useState<ReferralBenefit[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>(clienteId || '');
  const [clients, setClients] = useState<Client[]>([]);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [config, setConfig] = useState<Partial<ReferralLink['configuracion']>>({
    beneficioReferidor: {
      tipo: 'descuento-porcentaje',
      valor: 10,
      descripcion: '10% de descuento en tu próxima mensualidad',
      aplicaA: 'primera-mensualidad',
    },
    beneficioReferido: {
      tipo: 'descuento-porcentaje',
      valor: 15,
      descripcion: '15% de descuento en tu primera mensualidad',
      aplicaA: 'primera-mensualidad',
    },
    descuentoAutomatico: true,
    requiereAprobacion: false,
  });

  useEffect(() => {
    if (user?.id) {
      loadData();
      loadClients();
    }
  }, [user, clienteId]);

  const loadClients = async () => {
    try {
      const data = await getClients('entrenador', user?.id);
      setClients(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [linksData, usagesData, benefitsData, statsData] = await Promise.all([
        getReferralLinks(user?.id || '', clienteId),
        getReferralUsages(user?.id || '', clienteId),
        clienteId ? getReferralBenefits(clienteId) : Promise.resolve([]),
        getReferralStats(user?.id || ''),
      ]);

      setLinks(linksData);
      setUsages(usagesData);
      setBenefits(benefitsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando datos de referidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    if (!selectedClient) {
      alert('Por favor selecciona un cliente');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    if (!client) return;

    setCreating(true);
    try {
      const newLink = await createReferralLink(
        selectedClient,
        client.name,
        user?.id || '',
        config
      );
      setLinks([...links, newLink]);
      setShowCreateModal(false);
      setSelectedClient('');
      if (onLinkCreated) {
        onLinkCreated(newLink);
      }
      await loadData();
    } catch (error) {
      console.error('Error creando enlace de referido:', error);
      alert('Error al crear el enlace de referido');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = async (link: ReferralLink) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedLinkId(link.id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error('Error copiando enlace:', error);
    }
  };

  const handleDeactivateLink = async (linkId: string) => {
    if (!confirm('¿Estás seguro de que quieres desactivar este enlace?')) return;

    try {
      await deactivateReferralLink(linkId);
      await loadData();
    } catch (error) {
      console.error('Error desactivando enlace:', error);
    }
  };

  const getBenefitIcon = (tipo: BenefitConfig['tipo']) => {
    switch (tipo) {
      case 'descuento-porcentaje':
      case 'descuento-fijo':
        return <DollarSign className="w-4 h-4" />;
      case 'sesion-gratis':
        return <Gift className="w-4 h-4" />;
      case 'mes-gratis':
        return <Calendar className="w-4 h-4" />;
      case 'puntos':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const getBenefitText = (benefit: BenefitConfig) => {
    switch (benefit.tipo) {
      case 'descuento-porcentaje':
        return `${benefit.valor}% de descuento`;
      case 'descuento-fijo':
        return `€${benefit.valor} de descuento`;
      case 'sesion-gratis':
        return `${benefit.valor} sesión${benefit.valor > 1 ? 'es' : ''} gratis`;
      case 'mes-gratis':
        return `${benefit.valor} mes${benefit.valor > 1 ? 'es' : ''} gratis`;
      case 'puntos':
        return `${benefit.valor} puntos`;
      default:
        return benefit.descripcion;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Cargando enlaces de referido...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="hover" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Link2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Enlaces Activos</p>
                <p className="text-xl font-bold text-gray-900">{stats.activeLinks}</p>
              </div>
            </div>
          </Card>
          <Card variant="hover" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Referidos</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalRegistros}</p>
              </div>
            </div>
          </Card>
          <Card variant="hover" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Conversiones</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalConversiones}</p>
              </div>
            </div>
          </Card>
          <Card variant="hover" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Ingresos</p>
                <p className="text-xl font-bold text-gray-900">€{stats.totalIngresos.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Botón para crear nuevo enlace */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Enlaces de Referido</h3>
          <p className="text-sm text-gray-600">
            Genera enlaces únicos para cada cliente y otorga beneficios automáticos
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Crear Enlace
        </Button>
      </div>

      {/* Lista de enlaces */}
      {links.length === 0 ? (
        <Card className="p-8 text-center">
          <Link2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No hay enlaces de referido creados</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Crear Primer Enlace
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {links.map(link => (
            <Card key={link.id} variant="hover" className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {link.clienteName}
                    </h4>
                    {link.activo ? (
                      <Badge variant="green">Activo</Badge>
                    ) : (
                      <Badge variant="gray">Inactivo</Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {link.codigo}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(link)}
                        leftIcon={
                          copiedLinkId === link.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )
                        }
                      >
                        {copiedLinkId === link.id ? 'Copiado' : 'Copiar'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {link.url}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                      >
                        Abrir
                      </Button>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card variant="default" className="p-3 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        {getBenefitIcon(link.configuracion.beneficioReferidor.tipo)}
                        <span className="text-sm font-semibold text-gray-900">
                          Beneficio Referidor
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {getBenefitText(link.configuracion.beneficioReferidor)}
                      </p>
                    </Card>
                    <Card variant="default" className="p-3 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        {getBenefitIcon(link.configuracion.beneficioReferido.tipo)}
                        <span className="text-sm font-semibold text-gray-900">
                          Beneficio Referido
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {getBenefitText(link.configuracion.beneficioReferido)}
                      </p>
                    </Card>
                  </div>

                  {/* Estadísticas del enlace */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Clicks</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {link.estadisticas.totalClicks}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Registros</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {link.estadisticas.totalRegistros}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Conversión</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {link.estadisticas.tasaConversion.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {link.activo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeactivateLink(link.id)}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Desactivar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear enlace */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Crear Enlace de Referido
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente
                </label>
                <select
                  value={selectedClient}
                  onChange={e => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateLink}
                  loading={creating}
                  fullWidth
                >
                  Crear Enlace
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Usos del enlace */}
      {usages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Referidos</h3>
          <div className="space-y-2">
            {usages.map(usage => (
              <Card key={usage.id} variant="hover" className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {usage.clienteReferidoName}
                    </p>
                    <p className="text-xs text-gray-600">
                      Referido por {usage.clienteReferidorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(usage.fechaRegistro).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      usage.estado === 'convertido'
                        ? 'green'
                        : usage.estado === 'registrado'
                        ? 'blue'
                        : 'gray'
                    }
                  >
                    {usage.estado}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

