import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  getAccount, 
  Account, 
  Contact, 
  Activity 
} from '../api/abm';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  X
} from 'lucide-react';

interface AccountDetailPanelProps {
  accountId: string;
  onClose?: () => void;
}

export const AccountDetailPanel: React.FC<AccountDetailPanelProps> = ({ accountId, onClose }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccount();
  }, [accountId]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAccount(accountId);
      setAccount(data);
    } catch (err) {
      setError('Error al cargar la cuenta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'proposal':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="text-gray-500">Cargando detalles de la cuenta...</div>
      </Card>
    );
  }

  if (error || !account) {
    return (
      <Card className="p-8">
        <div className="text-red-600 mb-4">{error || 'Cuenta no encontrada'}</div>
        <Button variant="primary" onClick={loadAccount}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{account.companyName}</h2>
            {account.industry && (
              <p className="text-sm text-gray-600 mt-1">{account.industry}</p>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Información general */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {account.website && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Sitio Web</p>
            <a 
              href={account.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {account.website}
            </a>
          </div>
        )}
        {account.employeeCount && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Empleados</p>
            <p className="text-sm font-medium text-gray-900">{account.employeeCount}</p>
          </div>
        )}
      </div>

      {/* Contactos Clave */}
      {account.contacts && account.contacts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Contactos Clave</h3>
          </div>
          <div className="space-y-3">
            {account.contacts.map(contact => (
              <div 
                key={contact.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3" />
                      {contact.role}
                    </p>
                    {contact.email && (
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <a 
                        href={`tel:${contact.phone}`}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </a>
                    )}
                  </div>
                  {contact.isKeyContact && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                      Clave
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Oportunidades relacionadas */}
      {account.deals && account.deals.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Oportunidades</h3>
          </div>
          <div className="space-y-2">
            {account.deals.map(deal => (
              <div 
                key={deal.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">{deal.title}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0
                    }).format(deal.value)}
                  </p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {deal.stageId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de Actividades */}
      {account.activityLog && account.activityLog.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Actividades Recientes</h3>
          </div>
          <div className="space-y-3">
            {account.activityLog.map(activity => (
              <div 
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="p-1.5 bg-white rounded border border-gray-200">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
        <Button variant="primary" onClick={() => {/* TODO: Crear oportunidad */}}>
          Nueva Oportunidad
        </Button>
        <Button variant="secondary" onClick={() => {/* TODO: Enviar email */}}>
          Enviar Email
        </Button>
      </div>
    </Card>
  );
};


