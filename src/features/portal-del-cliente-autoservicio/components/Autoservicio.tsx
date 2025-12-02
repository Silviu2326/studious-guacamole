import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { CreditCard, FileText, Pause, User, History, Download } from 'lucide-react';

interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface AutoservicioProps {
  onSeleccionarServicio: (servicio: string) => void;
}

export const Autoservicio: React.FC<AutoservicioProps> = ({ onSeleccionarServicio }) => {
  const servicios: Servicio[] = [
    {
      id: 'perfil',
      titulo: 'Gestión de Perfil',
      descripcion: 'Editar datos personales, cambiar contraseña, actualizar contacto',
      icono: <User className="w-8 h-8" />,
      color: 'bg-blue-500',
      onClick: () => onSeleccionarServicio('perfil')
    },
    {
      id: 'historial',
      titulo: 'Historial de Pagos',
      descripcion: 'Ver todos los pagos, filtrar por fecha, descargar comprobantes',
      icono: <History className="w-8 h-8" />,
      color: 'bg-green-500',
      onClick: () => onSeleccionarServicio('historial')
    },
    {
      id: 'tarjeta',
      titulo: 'Cambio de Tarjeta',
      descripcion: 'Actualizar método de pago, validar nueva tarjeta',
      icono: <CreditCard className="w-8 h-8" />,
      color: 'bg-purple-500',
      onClick: () => onSeleccionarServicio('tarjeta')
    },
    {
      id: 'pausar',
      titulo: 'Pausar Cuota',
      descripcion: 'Suspender temporalmente el cobro, configurar fecha de reactivación',
      icono: <Pause className="w-8 h-8" />,
      color: 'bg-orange-500',
      onClick: () => onSeleccionarServicio('pausar')
    },
    {
      id: 'facturas',
      titulo: 'Descargar Facturas',
      descripcion: 'Acceder a facturas históricas, generar PDFs',
      icono: <Download className="w-8 h-8" />,
      color: 'bg-indigo-500',
      onClick: () => onSeleccionarServicio('facturas')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {servicios.map((servicio) => (
        <Card
          key={servicio.id}
          variant="hover"
          onClick={servicio.onClick}
          className="cursor-pointer h-full flex flex-col transition-shadow overflow-hidden"
        >
          <div className="p-4 flex items-start gap-4">
            <div className={`${servicio.color} text-white rounded-xl p-3 flex-shrink-0`}>
              {servicio.icono}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {servicio.titulo}
              </h3>
              <p className="text-sm text-gray-600">
                {servicio.descripcion}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

