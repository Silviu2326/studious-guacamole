import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../../../components/componentsreutilizables';

export const RecordatoriosAutomaticos: React.FC = () => {
  const [recordatorios] = useState([
    {
      id: '1',
      tipo: 'email',
      tiempoAnticipacion: 24,
      activo: true,
    },
    {
      id: '2',
      tipo: 'sms',
      tiempoAnticipacion: 2,
      activo: true,
    },
  ]);

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'email':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'push':
        return <Smartphone className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Recordatorios Automáticos
          </h3>
          <Button>
            Configurar
          </Button>
        </div>
        <div className="space-y-4">
          {recordatorios.map((recordatorio) => (
            <div key={recordatorio.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                {getIconoTipo(recordatorio.tipo)}
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Recordatorio por {recordatorio.tipo.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {recordatorio.tiempoAnticipacion} horas antes
                  </div>
                </div>
              </div>
              <Badge color={recordatorio.activo ? 'success' : 'warning'}>
                {recordatorio.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
