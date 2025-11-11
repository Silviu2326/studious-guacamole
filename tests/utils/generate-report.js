/**
 * Script para generar un reporte completo de los tests
 * 
 * Ejecutar con: npm run test:report
 */

const fs = require('fs');
const path = require('path');

function generateReport() {
  const resultsDir = path.join(process.cwd(), 'test-results');
  
  if (!fs.existsSync(resultsDir)) {
    console.log('❌ No se encontraron resultados de tests. Ejecuta los tests primero.');
    return;
  }

  const reportPath = path.join(resultsDir, 'exhaustive-test-report.json');
  
  if (!fs.existsSync(reportPath)) {
    console.log('❌ No se encontró el reporte de tests. Ejecuta: npm run test:e2e:all-pages');
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  
  console.log('\n' + '='.repeat(80));
  console.log('REPORTE COMPLETO DE TESTS E2E');
  console.log('='.repeat(80));
  
  console.log('\n📊 RESUMEN GENERAL:');
  console.log(`   Total de páginas probadas: ${report.summary.totalPages}`);
  console.log(`   ✅ Exitosas: ${report.summary.successful}`);
  console.log(`   ❌ Fallidas: ${report.summary.failed}`);
  console.log(`   🔴 Total de errores: ${report.summary.totalErrors}`);
  console.log(`   ⚠️  Total de advertencias: ${report.summary.totalWarnings}`);
  console.log(`   ⏱️  Tiempo promedio de carga: ${Math.round(report.summary.avgLoadTime)}ms`);

  // Errores por categoría
  if (report.errorReport && report.errorReport.summary) {
    console.log('\n📁 ERRORES POR CATEGORÍA:');
    Object.entries(report.errorReport.summary.errorsByCategory).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    console.log('\n🔴 ERRORES POR SEVERIDAD:');
    Object.entries(report.errorReport.summary.errorsBySeverity).forEach(([severity, count]) => {
      console.log(`   ${severity}: ${count}`);
    });
  }

  // Páginas con errores
  const failedPages = report.results.filter(r => !r.success);
  if (failedPages.length > 0) {
    console.log('\n❌ PÁGINAS CON ERRORES:');
    failedPages.forEach(result => {
      console.log(`\n   📄 ${result.route.label}`);
      console.log(`      Ruta: ${result.route.path}`);
      console.log(`      Sección: ${result.route.section}`);
      if (result.errors.length > 0) {
        console.log(`      Errores:`);
        result.errors.forEach(err => console.log(`         - ${err}`));
      }
      if (result.warnings.length > 0) {
        console.log(`      Advertencias:`);
        result.warnings.forEach(warn => console.log(`         - ${warn}`));
      }
    });
  }

  // Top 10 páginas más lentas
  const slowestPages = [...report.results]
    .sort((a, b) => (b.loadTime || 0) - (a.loadTime || 0))
    .slice(0, 10);
  
  if (slowestPages.length > 0) {
    console.log('\n🐌 TOP 10 PÁGINAS MÁS LENTAS:');
    slowestPages.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.route.label}: ${result.loadTime}ms`);
    });
  }

  // Generar HTML report
  generateHTMLReport(report);

  console.log('\n✅ Reporte completo generado!');
  console.log(`   📄 JSON: ${reportPath}`);
  console.log(`   📄 HTML: ${path.join(resultsDir, 'report.html')}`);
}

function generateHTMLReport(report) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Tests E2E</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2563eb;
      margin-bottom: 20px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 10px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #2563eb;
    }
    .stat-card h3 {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .stat-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
    }
    .stat-card.success .value { color: #10b981; }
    .stat-card.error .value { color: #ef4444; }
    .stat-card.warning .value { color: #f59e0b; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #374151;
    }
    tr:hover {
      background: #f9fafb;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge.success { background: #d1fae5; color: #065f46; }
    .badge.error { background: #fee2e2; color: #991b1b; }
    .error-list {
      background: #fef2f2;
      padding: 12px;
      border-radius: 4px;
      margin-top: 8px;
      font-size: 13px;
    }
    .error-list li {
      margin: 4px 0;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Reporte de Tests E2E - Aplicación Completa</h1>
    
    <div class="summary">
      <div class="stat-card">
        <h3>Total de Páginas</h3>
        <div class="value">${report.summary.totalPages}</div>
      </div>
      <div class="stat-card success">
        <h3>Exitosas</h3>
        <div class="value">${report.summary.successful}</div>
      </div>
      <div class="stat-card error">
        <h3>Fallidas</h3>
        <div class="value">${report.summary.failed}</div>
      </div>
      <div class="stat-card error">
        <h3>Errores</h3>
        <div class="value">${report.summary.totalErrors}</div>
      </div>
      <div class="stat-card warning">
        <h3>Advertencias</h3>
        <div class="value">${report.summary.totalWarnings}</div>
      </div>
      <div class="stat-card">
        <h3>Tiempo Promedio</h3>
        <div class="value">${Math.round(report.summary.avgLoadTime)}ms</div>
      </div>
    </div>

    <h2 style="margin-top: 30px;">Resultados por Página</h2>
    <table>
      <thead>
        <tr>
          <th>Página</th>
          <th>Ruta</th>
          <th>Sección</th>
          <th>Estado</th>
          <th>Tiempo de Carga</th>
          <th>Errores</th>
        </tr>
      </thead>
      <tbody>
        ${report.results.map(result => `
          <tr>
            <td><strong>${result.route.label}</strong></td>
            <td><code>${result.route.path}</code></td>
            <td>${result.route.section}</td>
            <td>
              <span class="badge ${result.success ? 'success' : 'error'}">
                ${result.success ? '✅ Éxito' : '❌ Error'}
              </span>
            </td>
            <td>${result.loadTime || 0}ms</td>
            <td>
              ${result.errors.length > 0 ? `
                <div class="error-list">
                  <ul>
                    ${result.errors.map(err => `<li>${err}</li>`).join('')}
                  </ul>
                </div>
              ` : '0'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 6px;">
      <p><strong>Generado:</strong> ${new Date().toLocaleString('es-ES')}</p>
      <p><strong>Total de pruebas:</strong> ${report.results.length}</p>
    </div>
  </div>
</body>
</html>`;

  const resultsDir = path.join(process.cwd(), 'test-results');
  fs.writeFileSync(path.join(resultsDir, 'report.html'), html);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateReport();
}

module.exports = { generateReport };



















