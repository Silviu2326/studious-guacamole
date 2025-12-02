import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Mail, Phone, Calendar, User } from 'lucide-react';
import { Client360 } from '../types';

interface ClientHeaderProps {
  client: Client360;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ client }) => {
  const getStatusBadge = () => {
    if (client.membership.status === 'active') return <Badge variant="green">Activo</Badge>;
    if (client.membership.status === 'pending') return <Badge variant="yellow">Pendiente</Badge>;
    if (client.membership.status === 'frozen') return <Badge variant="gray">Congelado</Badge>;
    return <Badge variant="red">Expirado</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = client.personalInfo.birthDate 
    ? calculateAge(client.personalInfo.birthDate)
    : null;

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Información personal */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={client.personalInfo.avatarUrl}
              alt={`${client.personalInfo.firstName} ${client.personalInfo.lastName}`}
              className="w-20 h-20 rounded-full ring-4 ring-gray-50 object-cover"
            />
          </div>

          {/* Datos personales */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {client.personalInfo.firstName} {client.personalInfo.lastName}
              </h2>
              {getStatusBadge()}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span>{client.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span>{client.personalInfo.phone}</span>
              </div>
              {age && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span>{age} años</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Membresía */}
        <div className="lg:text-right">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">Plan Actual</p>
            <p className="text-lg font-semibold text-gray-900">
              {client.membership.planName}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2 lg:justify-end">
              <Calendar size={14} className="text-gray-400" />
              <span>Desde {formatDate(client.membership.startDate)}</span>
            </div>
            {client.membership.endDate && (
              <div className="flex items-center gap-2 lg:justify-end mt-1">
                <Calendar size={14} className="text-gray-400" />
                <span>Hasta {formatDate(client.membership.endDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

