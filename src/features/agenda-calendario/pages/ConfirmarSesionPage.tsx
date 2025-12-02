import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfirmarSesionCliente } from '../components/ConfirmarSesionCliente';

export default function ConfirmarSesionPage() {
  const [searchParams] = useSearchParams();
  const citaId = searchParams.get('citaId') || '';
  const accion = (searchParams.get('accion') || 'confirmar') as 'confirmar' | 'cancelar';

  if (!citaId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">No se proporcionó un ID de sesión válido.</p>
        </div>
      </div>
    );
  }

  return <ConfirmarSesionCliente citaId={citaId} accion={accion} />;
}


