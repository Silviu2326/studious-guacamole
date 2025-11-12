/**
 * Sistema de Reporte de Errores
 * 
 * Este módulo captura, registra y reporta todos los errores encontrados durante el testing.
 */

export interface ErrorReport {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  module: string;
  component?: string;
  error: string;
  stack?: string;
  context?: Record<string, any>;
  suggestions?: string[];
}

class ErrorReporter {
  private errors: ErrorReport[] = [];
  private warnings: ErrorReport[] = [];

  /**
   * Registra un error durante el testing
   */
  reportError(
    category: string,
    module: string,
    error: string | Error,
    options?: {
      severity?: ErrorReport['severity'];
      component?: string;
      context?: Record<string, any>;
      suggestions?: string[];
    }
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    const report: ErrorReport = {
      id: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      severity: options?.severity || 'medium',
      category,
      module,
      component: options?.component,
      error: errorMessage,
      stack,
      context: options?.context,
      suggestions: options?.suggestions,
    };

    this.errors.push(report);
    
    // También lo registra en la consola para debugging inmediato
    console.error(`[${report.severity.toUpperCase()}] ${category} - ${module}:`, errorMessage);
  }

  /**
   * Registra una advertencia
   */
  reportWarning(
    category: string,
    module: string,
    message: string,
    context?: Record<string, any>
  ): void {
    const warning: ErrorReport = {
      id: `WARN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      severity: 'low',
      category,
      module,
      error: message,
      context,
    };

    this.warnings.push(warning);
    console.warn(`[WARNING] ${category} - ${module}:`, message);
  }

  /**
   * Obtiene todos los errores registrados
   */
  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  /**
   * Obtiene todas las advertencias registradas
   */
  getWarnings(): ErrorReport[] {
    return [...this.warnings];
  }

  /**
   * Obtiene errores por categoría
   */
  getErrorsByCategory(category: string): ErrorReport[] {
    return this.errors.filter(err => err.category === category);
  }

  /**
   * Obtiene errores por severidad
   */
  getErrorsBySeverity(severity: ErrorReport['severity']): ErrorReport[] {
    return this.errors.filter(err => err.severity === severity);
  }

  /**
   * Genera un reporte completo en formato JSON
   */
  generateReport(): {
    summary: {
      totalErrors: number;
      totalWarnings: number;
      errorsBySeverity: Record<string, number>;
      errorsByCategory: Record<string, number>;
    };
    errors: ErrorReport[];
    warnings: ErrorReport[];
  } {
    const errorsBySeverity = this.errors.reduce((acc, err) => {
      acc[err.severity] = (acc[err.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsByCategory = this.errors.reduce((acc, err) => {
      acc[err.category] = (acc[err.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        errorsBySeverity,
        errorsByCategory,
      },
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  /**
   * Genera un reporte en formato de texto legible
   */
  generateTextReport(): string {
    const report = this.generateReport();
    let text = '\n' + '='.repeat(80) + '\n';
    text += 'REPORTE DE ERRORES Y ADVERTENCIAS\n';
    text += '='.repeat(80) + '\n\n';

    text += 'RESUMEN:\n';
    text += `  Total de errores: ${report.summary.totalErrors}\n`;
    text += `  Total de advertencias: ${report.summary.totalWarnings}\n\n`;

    text += 'Errores por severidad:\n';
    Object.entries(report.summary.errorsBySeverity).forEach(([severity, count]) => {
      text += `  ${severity}: ${count}\n`;
    });

    text += '\nErrores por categoría:\n';
    Object.entries(report.summary.errorsByCategory).forEach(([category, count]) => {
      text += `  ${category}: ${count}\n`;
    });

    if (report.errors.length > 0) {
      text += '\n' + '-'.repeat(80) + '\n';
      text += 'ERRORES DETALLADOS:\n';
      text += '-'.repeat(80) + '\n\n';

      report.errors.forEach((err, index) => {
        text += `${index + 1}. [${err.severity.toUpperCase()}] ${err.category} - ${err.module}\n`;
        if (err.component) {
          text += `   Componente: ${err.component}\n`;
        }
        text += `   Error: ${err.error}\n`;
        if (err.context) {
          text += `   Contexto: ${JSON.stringify(err.context, null, 2)}\n`;
        }
        if (err.suggestions && err.suggestions.length > 0) {
          text += `   Sugerencias:\n`;
          err.suggestions.forEach(s => text += `     - ${s}\n`);
        }
        text += '\n';
      });
    }

    if (report.warnings.length > 0) {
      text += '\n' + '-'.repeat(80) + '\n';
      text += 'ADVERTENCIAS:\n';
      text += '-'.repeat(80) + '\n\n';

      report.warnings.forEach((warn, index) => {
        text += `${index + 1}. ${warn.category} - ${warn.module}\n`;
        text += `   ${warn.error}\n`;
        if (warn.context) {
          text += `   Contexto: ${JSON.stringify(warn.context, null, 2)}\n`;
        }
        text += '\n';
      });
    }

    text += '='.repeat(80) + '\n';
    return text;
  }

  /**
   * Limpia todos los errores y advertencias registrados
   */
  clear(): void {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Exporta el reporte a un archivo JSON
   */
  async exportToFile(filename: string = 'error-report.json'): Promise<void> {
    const report = this.generateReport();
    const json = JSON.stringify(report, null, 2);
    
    // En el navegador, descargar como archivo
    if (typeof window !== 'undefined') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // En Node.js, escribir al sistema de archivos
      const fs = await import('fs/promises');
      await fs.writeFile(filename, json, 'utf-8');
    }
  }
}

// Instancia global del reporter
export const errorReporter = new ErrorReporter();

// Helper para usar en tests
export function reportError(
  category: string,
  module: string,
  error: string | Error,
  options?: Parameters<ErrorReporter['reportError']>[3]
): void {
  errorReporter.reportError(category, module, error, options);
}

export function reportWarning(
  category: string,
  module: string,
  message: string,
  context?: Record<string, any>
): void {
  errorReporter.reportWarning(category, module, message, context);
}






















