import { ImportJob, ImportStatus, ImportEntity, FieldMapping, ImportResults } from '../types';

const API_BASE = '/api/v1/data/imports';

// Simulación de delay para operaciones asíncronas
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Almacenamiento en memoria para simulaciones
let importJobs: Map<string, ImportJob> = new Map();
let jobCounter = 1;

export const importService = {
  /**
   * Inicia un nuevo trabajo de importación
   */
  async startImport(
    file: File,
    entity: ImportEntity,
    mappings: Record<string, string>
  ): Promise<{ jobId: string; status: ImportStatus; message: string }> {
    await delay(500);
    
    const jobId = `imp-${Date.now()}-${jobCounter++}`;
    const totalRows = Math.floor(Math.random() * 500) + 50; // Simulación
    
    const job: ImportJob = {
      jobId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      originalFilename: file.name,
      entity,
      progress: {
        totalRows,
        processedRows: 0,
        successfulRows: 0,
        failedRows: 0,
      },
    };
    
    importJobs.set(jobId, job);
    
    // Simular procesamiento en segundo plano
    simulateProcessing(jobId, totalRows);
    
    return {
      jobId,
      status: 'pending',
      message: 'Import job successfully created. Polling for status is required.',
    };
  },

  /**
   * Obtiene el estado actual de un trabajo de importación
   */
  async getImportStatus(jobId: string): Promise<ImportJob | null> {
    await delay(300);
    return importJobs.get(jobId) || null;
  },

  /**
   * Obtiene el historial de importaciones
   */
  async getImportHistory(page: number = 1, limit: number = 10): Promise<{
    data: ImportJob[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    await delay(300);
    
    const allJobs = Array.from(importJobs.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedJobs = allJobs.slice(start, end);
    
    return {
      data: paginatedJobs,
      pagination: {
        total: allJobs.length,
        page,
        limit,
      },
    };
  },

  /**
   * Descarga la plantilla CSV para una entidad
   */
  async downloadTemplate(entity: ImportEntity): Promise<Blob> {
    await delay(200);
    
    const templates: Record<ImportEntity, string> = {
      members: 'first_name,last_name,email,phone_number,membership_plan_id,start_date\n',
      classes: 'name,description,instructor_id,capacity,start_time,duration\n',
      subscriptions: 'member_id,plan_id,start_date,end_date,status\n',
      check_ins: 'member_id,check_in_date,check_in_time\n',
    };
    
    const csvContent = templates[entity] || '';
    return new Blob([csvContent], { type: 'text/csv' });
  },

  /**
   * Obtiene los resultados detallados de una importación
   */
  async getImportResults(jobId: string): Promise<ImportResults | null> {
    await delay(300);
    const job = importJobs.get(jobId);
    
    if (!job) return null;
    
    return {
      jobId: job.jobId,
      status: job.status,
      summary: job.summary || {
        total: job.progress?.totalRows || 0,
        success: job.progress?.successfulRows || 0,
        failed: job.progress?.failedRows || 0,
      },
      errors: generateMockErrors(job.progress?.failedRows || 0),
      reportUrl: job.reportUrl,
    };
  },
};

/**
 * Simula el procesamiento de una importación en segundo plano
 */
function simulateProcessing(jobId: string, totalRows: number) {
  let processed = 0;
  let successful = 0;
  let failed = 0;
  
  const interval = setInterval(() => {
    processed += Math.floor(Math.random() * 10) + 5;
    
    if (processed > totalRows) {
      processed = totalRows;
    }
    
    const successRate = 0.95; // 95% de éxito
    successful = Math.floor(processed * successRate);
    failed = processed - successful;
    
    const job = importJobs.get(jobId);
    if (!job) {
      clearInterval(interval);
      return;
    }
    
    job.status = processed < totalRows ? 'processing' : 'completed';
    job.progress = {
      totalRows,
      processedRows: processed,
      successfulRows: successful,
      failedRows: failed,
    };
    
    if (processed >= totalRows) {
      job.completedAt = new Date().toISOString();
      job.summary = {
        total: totalRows,
        success: successful,
        failed: failed,
      };
      job.status = failed > 0 ? 'completed_with_errors' : 'completed';
      job.reportUrl = `/downloads/reports/${jobId}.csv`;
      clearInterval(interval);
    }
    
    importJobs.set(jobId, job);
  }, 500);
}

/**
 * Genera errores mock para la importación
 */
function generateMockErrors(count: number) {
  if (count === 0) return undefined;
  
  return Array.from({ length: Math.min(count, 10) }, (_, i) => ({
    row: i + 2,
    column: ['email', 'phone_number', 'start_date', 'membership_plan_id'][i % 4],
    value: `valor_${i}`,
    error: [
      'Email duplicado',
      'Formato de fecha inválido',
      'El ID del plan de membresía no existe',
      'Número de teléfono inválido',
    ][i % 4],
  }));
}

