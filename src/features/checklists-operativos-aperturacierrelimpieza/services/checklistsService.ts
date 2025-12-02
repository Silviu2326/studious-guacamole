// Servicio de Checklists Operativos

import { checklistsApi } from '../api/checklistsApi';
import {
  ChecklistTemplate,
  ChecklistInstance,
  ChecklistFilters,
  ChecklistItem,
  ChecklistTemplateTask
} from '../types';

export class ChecklistsService {
  // Templates
  static async obtenerTemplates(): Promise<ChecklistTemplate[]> {
    return checklistsApi.obtenerTemplates();
  }

  static async crearTemplate(templateData: {
    name: string;
    description: string;
    tasks: ChecklistTemplateTask[];
  }): Promise<ChecklistTemplate> {
    return checklistsApi.crearTemplate(templateData);
  }

  static async actualizarTemplate(
    id: string,
    templateData: Partial<ChecklistTemplate>
  ): Promise<ChecklistTemplate> {
    return checklistsApi.actualizarTemplate(id, templateData);
  }

  static async eliminarTemplate(id: string): Promise<void> {
    return checklistsApi.eliminarTemplate(id);
  }

  // Instances
  static async obtenerInstances(filters?: ChecklistFilters): Promise<ChecklistInstance[]> {
    return checklistsApi.obtenerInstances(filters);
  }

  static async obtenerInstanceById(instanceId: string): Promise<ChecklistInstance | null> {
    return checklistsApi.obtenerInstanceById(instanceId);
  }

  static async actualizarItemStatus(
    instanceId: string,
    itemId: string,
    updateData: { status: string; notes?: string; attachments?: string[] }
  ): Promise<ChecklistItem> {
    return checklistsApi.actualizarItemStatus(instanceId, itemId, updateData);
  }

  static async crearInstance(instanceData: {
    templateId: string;
    assignedToId: string;
    assignedToName: string;
    dueDate: string;
  }): Promise<ChecklistInstance> {
    return checklistsApi.crearInstance(instanceData);
  }
}

