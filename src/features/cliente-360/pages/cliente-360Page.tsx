import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client360ProfileComponent } from '../../gestión-de-clientes/components/Client360Profile';

export const Cliente360Page: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const handleClose = () => {
    // Navegar hacia atrás o a la página de gestión de clientes
    navigate(-1);
  };

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="p-8 text-center bg-white shadow-sm rounded-lg">
            <p className="text-gray-600">No se proporcionó un ID de cliente</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <Client360ProfileComponent clientId={clientId} onClose={handleClose} />
      </div>
    </div>
  );
};

export default Cliente360Page;

