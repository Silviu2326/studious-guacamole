import { Lead } from '../types';
import { getLeads } from '../api/leads';

// Normalizar texto para comparación (eliminar espacios, convertir a minúsculas, etc.)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos
};

// Normalizar teléfono (eliminar espacios, guiones, paréntesis)
const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-\(\)\+]/g, '');
};

// Normalizar email (minúsculas, sin espacios)
const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Calcular similitud entre dos strings (Levenshtein distance simplificado)
const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;

  // Si uno contiene al otro, alta similitud
  if (s1.includes(s2) || s2.includes(s1)) {
    const minLen = Math.min(s1.length, s2.length);
    const maxLen = Math.max(s1.length, s2.length);
    return minLen / maxLen;
  }

  // Calcular distancia de Levenshtein simplificada
  const maxLen = Math.max(s1.length, s2.length);
  let matches = 0;
  const minLen = Math.min(s1.length, s2.length);

  for (let i = 0; i < minLen; i++) {
    if (s1[i] === s2[i]) matches++;
  }

  return matches / maxLen;
};

export interface DuplicateMatch {
  lead: Lead;
  confidence: number; // 0-1, donde 1 es duplicado seguro
  reasons: string[]; // Razones por las que se considera duplicado
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matches: DuplicateMatch[];
  suggestedMerge?: {
    primary: Lead;
    secondary: Lead;
    mergedData: Partial<Lead>;
  };
}

export class DuplicateDetectionService {
  // Detectar duplicados para un lead
  static async detectDuplicates(
    lead: Lead,
    excludeId?: string
  ): Promise<DuplicateCheckResult> {
    const allLeads = await getLeads({ businessType: lead.businessType });
    const matches: DuplicateMatch[] = [];

    for (const existingLead of allLeads) {
      // Excluir el mismo lead si se está editando
      if (excludeId && existingLead.id === excludeId) continue;
      if (lead.id === existingLead.id) continue;

      const reasons: string[] = [];
      let confidence = 0;

      // Verificar email (coincidencia exacta = 100% confianza)
      if (lead.email && existingLead.email) {
        const normalizedLeadEmail = normalizeEmail(lead.email);
        const normalizedExistingEmail = normalizeEmail(existingLead.email);

        if (normalizedLeadEmail === normalizedExistingEmail) {
          confidence = Math.max(confidence, 1.0);
          reasons.push('Email idéntico');
        }
      }

      // Verificar teléfono (coincidencia exacta = 100% confianza)
      if (lead.phone && existingLead.phone) {
        const normalizedLeadPhone = normalizePhone(lead.phone);
        const normalizedExistingPhone = normalizePhone(existingLead.phone);

        if (normalizedLeadPhone === normalizedExistingPhone) {
          confidence = Math.max(confidence, 1.0);
          reasons.push('Teléfono idéntico');
        } else if (
          normalizedLeadPhone.length >= 6 &&
          normalizedExistingPhone.length >= 6
        ) {
          // Si los últimos 6 dígitos coinciden, alta probabilidad
          const leadLast6 = normalizedLeadPhone.slice(-6);
          const existingLast6 = normalizedExistingPhone.slice(-6);
          if (leadLast6 === existingLast6) {
            confidence = Math.max(confidence, 0.8);
            reasons.push('Teléfono similar (últimos 6 dígitos)');
          }
        }
      }

      // Verificar nombre (similitud alta = 70-90% confianza)
      if (lead.name && existingLead.name) {
        const similarity = calculateSimilarity(lead.name, existingLead.name);
        if (similarity >= 0.9) {
          confidence = Math.max(confidence, 0.9);
          reasons.push('Nombre muy similar');
        } else if (similarity >= 0.7) {
          confidence = Math.max(confidence, 0.7);
          reasons.push('Nombre similar');
        }
      }

      // Si hay múltiples coincidencias, aumentar confianza
      if (reasons.length > 1) {
        confidence = Math.min(1.0, confidence + 0.1 * (reasons.length - 1));
      }

      // Solo agregar si la confianza es significativa (>= 0.7)
      if (confidence >= 0.7) {
        matches.push({
          lead: existingLead,
          confidence,
          reasons
        });
      }
    }

    // Ordenar por confianza descendente
    matches.sort((a, b) => b.confidence - a.confidence);

    const isDuplicate = matches.length > 0 && matches[0].confidence >= 0.8;

    // Si hay un duplicado claro, sugerir merge
    let suggestedMerge;
    if (isDuplicate && matches.length > 0) {
      const primary = matches[0].confidence >= 0.95 ? matches[0].lead : lead;
      const secondary = matches[0].confidence >= 0.95 ? lead : matches[0].lead;

      suggestedMerge = {
        primary,
        secondary,
        mergedData: this.prepareMergeData(primary, secondary)
      };
    }

    return {
      isDuplicate,
      matches,
      suggestedMerge
    };
  }

  // Preparar datos para merge (combinar información de ambos leads)
  static prepareMergeData(primary: Lead, secondary: Lead): Partial<Lead> {
    const merged: Partial<Lead> = {
      // Usar datos del lead primario como base
      name: primary.name,
      email: primary.email || secondary.email,
      phone: primary.phone || secondary.phone,
      source: primary.source, // Mantener fuente original
      score: Math.max(primary.score, secondary.score), // Usar score más alto
      status: primary.status === 'converted' ? primary.status : secondary.status, // Priorizar converted
      stage: this.getMostAdvancedStage(primary.stage, secondary.stage),
      assignedTo: primary.assignedTo || secondary.assignedTo,
      // Combinar interacciones (eliminar duplicados por fecha)
      interactions: this.mergeInteractions(primary.interactions, secondary.interactions),
      // Combinar notas
      notes: [...new Set([...primary.notes, ...secondary.notes])],
      // Combinar tags
      tags: [...new Set([...primary.tags, ...secondary.tags])],
      // Combinar customFields
      customFields: {
        ...secondary.customFields,
        ...primary.customFields
      },
      // Usar fechas más antiguas para createdAt, más recientes para updatedAt
      createdAt: primary.createdAt < secondary.createdAt ? primary.createdAt : secondary.createdAt,
      updatedAt: primary.updatedAt > secondary.updatedAt ? primary.updatedAt : secondary.updatedAt,
      lastContactDate: this.getMostRecentDate(primary.lastContactDate, secondary.lastContactDate),
      nextFollowUpDate: this.getMostRecentDate(primary.nextFollowUpDate, secondary.nextFollowUpDate),
      // Si alguno está convertido, mantener esa información
      conversionDate: primary.conversionDate || secondary.conversionDate,
      convertedToClientId: primary.convertedToClientId || secondary.convertedToClientId
    };

    return merged;
  }

  // Obtener el stage más avanzado
  private static getMostAdvancedStage(
    stage1: Lead['stage'],
    stage2: Lead['stage']
  ): Lead['stage'] {
    const stages: Lead['stage'][] = ['captacion', 'interes', 'calificacion', 'oportunidad', 'cierre'];
    const index1 = stages.indexOf(stage1);
    const index2 = stages.indexOf(stage2);
    return index1 > index2 ? stage1 : stage2;
  }

  // Combinar interacciones eliminando duplicados
  private static mergeInteractions(
    interactions1: Lead['interactions'],
    interactions2: Lead['interactions']
  ): Lead['interactions'] {
    const all = [...interactions1, ...interactions2];
    // Eliminar duplicados por id, o por fecha y tipo si no hay id
    const unique = new Map<string, Lead['interactions'][0]>();

    for (const interaction of all) {
      const key = interaction.id || `${interaction.type}-${interaction.date.getTime()}`;
      if (!unique.has(key) || new Date(interaction.date) > new Date(unique.get(key)!.date)) {
        unique.set(key, interaction);
      }
    }

    return Array.from(unique.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Obtener la fecha más reciente
  private static getMostRecentDate(date1?: Date, date2?: Date): Date | undefined {
    if (!date1 && !date2) return undefined;
    if (!date1) return date2;
    if (!date2) return date1;
    return date1 > date2 ? date1 : date2;
  }

  // Verificar si un lead es duplicado antes de crear
  static async checkBeforeCreate(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<DuplicateCheckResult> {
    const tempLead: Lead = {
      ...lead,
      id: 'temp',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.detectDuplicates(tempLead);
  }

  // Verificar duplicados por email, teléfono o nombre
  static async checkDuplicate(
    email?: string,
    phone?: string,
    name?: string
  ): Promise<Lead[]> {
    const allLeads = await getLeads();
    const duplicates: Lead[] = [];

    for (const existingLead of allLeads) {
      let isDuplicate = false;

      if (email && existingLead.email) {
        if (normalizeEmail(email) === normalizeEmail(existingLead.email)) {
          isDuplicate = true;
        }
      }

      if (phone && existingLead.phone) {
        if (normalizePhone(phone) === normalizePhone(existingLead.phone)) {
          isDuplicate = true;
        }
      }

      if (name && existingLead.name) {
        const similarity = calculateSimilarity(name, existingLead.name);
        if (similarity >= 0.9) {
          isDuplicate = true;
        }
      }

      if (isDuplicate) {
        duplicates.push(existingLead);
      }
    }

    return duplicates;
  }

  // Preview de merge
  static async previewMerge(
    primaryId: string,
    duplicateId: string
  ): Promise<{
    name: string;
    email?: string;
    phone?: string;
    totalInteractions: number;
    totalNotes: number;
    combinedHistory: any[];
  }> {
    const allLeads = await getLeads();
    const primary = allLeads.find(l => l.id === primaryId);
    const duplicate = allLeads.find(l => l.id === duplicateId);

    if (!primary || !duplicate) {
      throw new Error('Lead not found');
    }

    const merged = this.prepareMergeData(primary, duplicate);

    return {
      name: merged.name || '',
      email: merged.email,
      phone: merged.phone,
      totalInteractions: merged.interactions?.length || 0,
      totalNotes: merged.notes?.length || 0,
      combinedHistory: []
    };
  }

  // Mergear leads
  static async mergeLeads(
    primaryId: string,
    duplicateId: string
  ): Promise<Lead> {
    const allLeads = await getLeads();
    const primary = allLeads.find(l => l.id === primaryId);
    const duplicate = allLeads.find(l => l.id === duplicateId);

    if (!primary || !duplicate) {
      throw new Error('Lead not found');
    }

    const merged = this.prepareMergeData(primary, duplicate);

    // En producción, esto actualizaría el lead primario y eliminaría el duplicado
    // Por ahora, solo retornamos el lead mergeado
    return {
      ...primary,
      ...merged
    } as Lead;
  }

  // Detectar duplicados con formato simplificado para el modal
  static async detectDuplicates(
    lead: Lead,
    threshold: number = 0.7
  ): Promise<Array<{
    lead: Lead;
    similarity: number;
    matchType: 'email' | 'phone' | 'name';
  }>> {
    const allLeads = await getLeads({ businessType: lead.businessType });
    const matches: Array<{
      lead: Lead;
      similarity: number;
      matchType: 'email' | 'phone' | 'name';
    }> = [];

    for (const existingLead of allLeads) {
      if (existingLead.id === lead.id) continue;

      let similarity = 0;
      let matchType: 'email' | 'phone' | 'name' = 'name';

      // Verificar email
      if (lead.email && existingLead.email) {
        if (normalizeEmail(lead.email) === normalizeEmail(existingLead.email)) {
          similarity = 100;
          matchType = 'email';
        }
      }

      // Verificar teléfono
      if (lead.phone && existingLead.phone && similarity < 100) {
        if (normalizePhone(lead.phone) === normalizePhone(existingLead.phone)) {
          similarity = 100;
          matchType = 'phone';
        } else {
          const leadLast6 = normalizePhone(lead.phone).slice(-6);
          const existingLast6 = normalizePhone(existingLead.phone).slice(-6);
          if (leadLast6 === existingLast6 && leadLast6.length >= 6) {
            similarity = Math.max(similarity, 85);
            matchType = 'phone';
          }
        }
      }

      // Verificar nombre
      if (lead.name && existingLead.name && similarity < 100) {
        const nameSimilarity = calculateSimilarity(lead.name, existingLead.name);
        if (nameSimilarity >= threshold) {
          similarity = Math.max(similarity, nameSimilarity * 100);
          matchType = 'name';
        }
      }

      if (similarity >= threshold * 100) {
        matches.push({
          lead: existingLead,
          similarity,
          matchType
        });
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
  }
}

