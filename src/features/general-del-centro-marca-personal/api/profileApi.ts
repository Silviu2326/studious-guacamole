import { GeneralProfile, GeneralProfileFormData, LogoUploadResponse, StripeConnectResponse } from '../types';

const API_BASE = '/api/v1/profile';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const profileApi = {
  /**
   * Obtiene la configuración general del perfil del usuario autenticado
   */
  getGeneralProfile: async (): Promise<GeneralProfile> => {
    try {
      const response = await fetch(`${API_BASE}/general`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('El perfil para el usuario autenticado no existe');
        }
        if (response.status === 401) {
          throw new Error('El token de autenticación no es válido o ha expirado');
        }
        throw new Error('Error al obtener el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getGeneralProfile:', error);
      // Retornar datos mock para desarrollo
      return mockGeneralProfile;
    }
  },

  /**
   * Actualiza la información textual de la configuración general del perfil
   */
  updateGeneralProfile: async (data: GeneralProfileFormData): Promise<{ success: boolean; data: Partial<GeneralProfile> }> => {
    try {
      const response = await fetch(`${API_BASE}/general`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Los datos enviados no son válidos');
        }
        if (response.status === 403) {
          throw new Error('No tienes permisos para modificar este perfil');
        }
        throw new Error('Error al actualizar el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateGeneralProfile:', error);
      throw error;
    }
  },

  /**
   * Sube o reemplaza el logotipo del perfil
   */
  uploadLogo: async (file: File): Promise<LogoUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch(`${API_BASE}/logo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('El archivo de imagen excede el tamaño máximo permitido (5MB)');
        }
        if (response.status === 415) {
          throw new Error('El formato del archivo no está soportado');
        }
        throw new Error('Error al subir el logotipo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en uploadLogo:', error);
      throw error;
    }
  },

  /**
   * Inicia el flujo de conexión con Stripe Connect
   */
  connectStripe: async (): Promise<StripeConnectResponse> => {
    try {
      const response = await fetch('/api/v1/payments/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Ya tienes una cuenta de Stripe conectada y activa');
        }
        if (response.status === 500) {
          throw new Error('Error al comunicarse con la API de Stripe');
        }
        throw new Error('Error al conectar con Stripe');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en connectStripe:', error);
      throw error;
    }
  },
};

// Datos mock para desarrollo
const mockGeneralProfile: GeneralProfile = {
  profileType: 'gym',
  name: 'FitZone Central',
  description: 'El mejor gimnasio de la ciudad.',
  logoUrl: undefined,
  address: 'Calle Falsa 123',
  phone: '+34 123 456 789',
  maxCapacity: 150,
  businessHours: [
    {
      day: 'monday',
      slots: [
        { open: '06:00', close: '22:00' }
      ],
      isClosed: false,
    },
    {
      day: 'tuesday',
      slots: [
        { open: '06:00', close: '22:00' }
      ],
      isClosed: false,
    },
    {
      day: 'wednesday',
      slots: [
        { open: '06:00', close: '22:00' }
      ],
      isClosed: false,
    },
    {
      day: 'thursday',
      slots: [
        { open: '06:00', close: '22:00' }
      ],
      isClosed: false,
    },
    {
      day: 'friday',
      slots: [
        { open: '06:00', close: '22:00' }
      ],
      isClosed: false,
    },
    {
      day: 'saturday',
      slots: [
        { open: '08:00', close: '20:00' }
      ],
      isClosed: false,
    },
    {
      day: 'sunday',
      slots: [],
      isClosed: true,
    },
  ],
  paymentStatus: 'not_connected',
  lastUpdated: new Date().toISOString(),
};

