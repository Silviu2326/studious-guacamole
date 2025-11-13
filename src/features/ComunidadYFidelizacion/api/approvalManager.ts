import { ApprovalRequest, ApprovalConfig, ApprovalStatus } from '../types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function simulateLatency<T>(data: T): Promise<T> {
  return delay(300 + Math.random() * 200).then(() => data);
}

// Mock data para aprobaciones
const MOCK_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: 'approval_001',
    type: 'testimonial',
    itemId: 'testimonial_001',
    itemType: 'testimonial',
    content: {
      title: 'Testimonio de María García',
      text: 'Excelente entrenador, me ayudó a alcanzar mis objetivos de pérdida de peso. Muy profesional y motivador.',
      metadata: {
        score: 5,
        customerName: 'María García',
      },
    },
    status: 'pending',
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'approval_002',
    type: 'message',
    itemId: 'message_001',
    itemType: 'automated-message',
    content: {
      title: 'Mensaje de felicitación por hito',
      text: '¡Felicidades! Has completado 10 sesiones. Estamos orgullosos de tu progreso. ¡Sigue así!',
      metadata: {
        clientName: 'Juan Pérez',
        milestone: '10 sesiones',
      },
    },
    status: 'pending',
    requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'approval_003',
    type: 'testimonial',
    itemId: 'testimonial_002',
    itemType: 'testimonial',
    content: {
      title: 'Testimonio de Ana López',
      text: 'El mejor entrenador personal que he tenido. Los resultados son increíbles.',
      metadata: {
        score: 5,
        customerName: 'Ana López',
      },
    },
    status: 'approved',
    requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'trainer_001',
  },
];

const MOCK_APPROVAL_CONFIG: ApprovalConfig = {
  id: 'config_001',
  trainerId: 'trainer_001',
  testimonialApproval: {
    enabled: true,
    autoApproveHighScore: true,
    autoApproveScoreThreshold: 4.5,
    requireApprovalForAll: false,
  },
  messageApproval: {
    enabled: true,
    autoApproveTemplates: true,
    requireApprovalForNewTemplates: true,
    requireApprovalForPersonalized: true,
  },
  notifications: {
    notifyOnPending: true,
    notifyOnRejection: true,
    notificationChannels: ['email', 'in-app'],
  },
  stats: {
    totalPending: 2,
    totalApproved: 15,
    totalRejected: 3,
    averageApprovalTime: 2.5,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const ApprovalManagerAPI = {
  /**
   * Obtener todas las solicitudes de aprobación
   */
  async getAll(): Promise<ApprovalRequest[]> {
    return simulateLatency([...MOCK_APPROVAL_REQUESTS]);
  },

  /**
   * Obtener solicitudes pendientes
   */
  async getPending(): Promise<ApprovalRequest[]> {
    const pending = MOCK_APPROVAL_REQUESTS.filter((a) => a.status === 'pending');
    return simulateLatency([...pending]);
  },

  /**
   * Obtener configuración de aprobación
   */
  async getConfig(): Promise<ApprovalConfig> {
    return simulateLatency({ ...MOCK_APPROVAL_CONFIG });
  },

  /**
   * Actualizar configuración de aprobación
   */
  async updateConfig(config: ApprovalConfig): Promise<ApprovalConfig> {
    return simulateLatency({
      ...config,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Aprobar una solicitud
   */
  async approve(approvalId: string, approvedBy: string): Promise<ApprovalRequest> {
    const approval = MOCK_APPROVAL_REQUESTS.find((a) => a.id === approvalId);
    if (!approval) {
      throw new Error('Aprobación no encontrada');
    }

    const updated: ApprovalRequest = {
      ...approval,
      status: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString(),
    };

    const index = MOCK_APPROVAL_REQUESTS.findIndex((a) => a.id === approvalId);
    if (index !== -1) {
      MOCK_APPROVAL_REQUESTS[index] = updated;
    }

    return simulateLatency(updated);
  },

  /**
   * Rechazar una solicitud
   */
  async reject(approvalId: string, reason: string, rejectedBy: string): Promise<ApprovalRequest> {
    const approval = MOCK_APPROVAL_REQUESTS.find((a) => a.id === approvalId);
    if (!approval) {
      throw new Error('Aprobación no encontrada');
    }

    const updated: ApprovalRequest = {
      ...approval,
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    };

    const index = MOCK_APPROVAL_REQUESTS.findIndex((a) => a.id === approvalId);
    if (index !== -1) {
      MOCK_APPROVAL_REQUESTS[index] = updated;
    }

    return simulateLatency(updated);
  },
};

