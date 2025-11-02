import { test, expect, Page } from '@playwright/test';
import { ALL_SIDEBAR_ROUTES, getRoutesForRole, navigateAndVerifyPage, SidebarRoute } from '../utils/page-navigator';
import { errorReporter } from '../../src/test/error-reporter';

/**
 * Test exhaustivo que recorre todas las páginas de la aplicación
 * y detecta errores, documentando todo lo encontrado.
 */

interface TestResult {
  route: SidebarRoute;
  success: boolean;
  errors: string[];
  warnings: string[];
  loadTime?: number;
  screenshot?: string;
}

/**
 * Inicia sesión en la aplicación
 */
async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  
  // Esperar a que el formulario de login esté visible
  await page.waitForSelector('#email', { timeout: 10000 });
  
  // Rellenar formulario
  await page.fill('#email', email);
  await page.fill('#password', password);
  
  // Hacer clic en el botón de login
  await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  
  // Esperar a que se complete el login (redirección al dashboard)
  await page.waitForURL(/\/dashboard|\/resumen-general/, { timeout: 15000 });
}

test.describe('Test Exhaustivo de Todas las Páginas', () => {
  let testResults: TestResult[] = [];

  test.beforeAll(async () => {
    // Limpiar el reporte de errores antes de empezar
    errorReporter.clear();
  });

  test('Test completo para rol Entrenador', async ({ page }) => {
    test.setTimeout(600000); // 10 minutos para todo el test

    // Login como entrenador
    await login(page, 'entrenador@test.com', 'entrenador123');
    await page.waitForTimeout(2000); // Esperar a que la aplicación se estabilice

    const routes = getRoutesForRole('entrenador');
    console.log(`\n🧪 Probando ${routes.length} páginas para rol Entrenador...\n`);

    for (const route of routes) {
      console.log(`  📄 Probando: ${route.label} (${route.path})`);
      
      const startTime = Date.now();
      const result = await navigateAndVerifyPage(page, route);
      const loadTime = Date.now() - startTime;

      const testResult: TestResult = {
        route,
        success: result.success,
        errors: result.errors,
        warnings: result.warnings,
        loadTime,
      };

      // Si hay errores, registrar en el error reporter
      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          errorReporter.reportError(
            route.section,
            route.id,
            error,
            {
              severity: 'high',
              component: route.label,
              context: { path: route.path, loadTime },
              suggestions: [
                'Verificar que la ruta está correctamente configurada en App.tsx',
                'Verificar que el componente de la página se renderiza correctamente',
                'Revisar la consola del navegador para más detalles del error',
              ],
            }
          );
        });
      }

      // Registrar advertencias
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          errorReporter.reportWarning(
            route.section,
            route.id,
            warning,
            { path: route.path }
          );
        });
      }

      testResults.push(testResult);

      // Reportar resultado
      if (result.success) {
        console.log(`    ✅ Éxito (${loadTime}ms)`);
        if (result.warnings.length > 0) {
          console.log(`    ⚠️  ${result.warnings.length} advertencia(s)`);
        }
      } else {
        console.log(`    ❌ Error: ${result.errors.join(', ')}`);
      }
    }
  });

  test('Test completo para rol Gimnasio', async ({ page }) => {
    test.setTimeout(600000); // 10 minutos

    // Login como gimnasio
    await login(page, 'gimnasio@test.com', 'gimnasio123');
    await page.waitForTimeout(2000);

    const routes = getRoutesForRole('gimnasio');
    console.log(`\n🧪 Probando ${routes.length} páginas para rol Gimnasio...\n`);

    for (const route of routes) {
      console.log(`  📄 Probando: ${route.label} (${route.path})`);
      
      const startTime = Date.now();
      const result = await navigateAndVerifyPage(page, route);
      const loadTime = Date.now() - startTime;

      const testResult: TestResult = {
        route,
        success: result.success,
        errors: result.errors,
        warnings: result.warnings,
        loadTime,
      };

      // Registrar errores
      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          errorReporter.reportError(
            route.section,
            route.id,
            error,
            {
              severity: 'high',
              component: route.label,
              context: { path: route.path, loadTime },
            }
          );
        });
      }

      // Registrar advertencias
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          errorReporter.reportWarning(
            route.section,
            route.id,
            warning,
            { path: route.path }
          );
        });
      }

      testResults.push(testResult);

      // Reportar resultado
      if (result.success) {
        console.log(`    ✅ Éxito (${loadTime}ms)`);
        if (result.warnings.length > 0) {
          console.log(`    ⚠️  ${result.warnings.length} advertencia(s)`);
        }
      } else {
        console.log(`    ❌ Error: ${result.errors.join(', ')}`);
      }
    }
  });

  test.afterAll(async () => {
    // Generar reporte final
    console.log('\n' + '='.repeat(80));
    console.log('RESUMEN DEL TEST EXHAUSTIVO');
    console.log('='.repeat(80));
    
    const successful = testResults.filter(r => r.success).length;
    const failed = testResults.filter(r => !r.success).length;
    const totalErrors = testResults.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = testResults.reduce((sum, r) => sum + r.warnings.length, 0);
    const avgLoadTime = testResults.reduce((sum, r) => sum + (r.loadTime || 0), 0) / testResults.length;

    console.log(`\n📊 Estadísticas:`);
    console.log(`   Total de páginas probadas: ${testResults.length}`);
    console.log(`   ✅ Exitosas: ${successful}`);
    console.log(`   ❌ Fallidas: ${failed}`);
    console.log(`   🔴 Total de errores: ${totalErrors}`);
    console.log(`   ⚠️  Total de advertencias: ${totalWarnings}`);
    console.log(`   ⏱️  Tiempo promedio de carga: ${Math.round(avgLoadTime)}ms`);

    // Mostrar páginas con errores
    const failedRoutes = testResults.filter(r => !r.success);
    if (failedRoutes.length > 0) {
      console.log(`\n❌ Páginas con errores (${failedRoutes.length}):`);
      failedRoutes.forEach(result => {
        console.log(`   - ${result.route.label} (${result.route.path})`);
        result.errors.forEach(err => console.log(`     → ${err}`));
      });
    }

    // Mostrar reporte del error reporter
    const report = errorReporter.generateTextReport();
    console.log(report);

    // Exportar reporte JSON
    const fs = require('fs');
    const path = require('path');
    
    // Asegurar que el directorio test-results existe
    const resultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const reportData = {
      summary: {
        totalPages: testResults.length,
        successful,
        failed,
        totalErrors,
        totalWarnings,
        avgLoadTime,
      },
      results: testResults,
      errorReport: errorReporter.generateReport(),
    };

    fs.writeFileSync(
      path.join(resultsDir, 'exhaustive-test-report.json'),
      JSON.stringify(reportData, null, 2)
    );

    console.log('\n📄 Reporte completo guardado en: test-results/exhaustive-test-report.json');
    console.log('📄 Reporte de errores en texto guardado en: test-results/error-report.txt');
    
    // También guardar reporte de texto
    fs.writeFileSync(
      path.join(resultsDir, 'error-report.txt'),
      errorReporter.generateTextReport()
    );
  });
});

/**
 * Test adicional que verifica funcionalidades básicas en cada página
 */
test.describe('Verificación de Funcionalidades Básicas', () => {
  test('Verificar que todas las páginas tienen elementos básicos', async ({ page }) => {
    // Login
    await login(page, 'entrenador@test.com', 'entrenador123');
    await page.waitForTimeout(1000);

    const routes = getRoutesForRole('entrenador').slice(0, 10); // Probar las primeras 10 para no hacerlo demasiado largo

    for (const route of routes) {
      await page.goto(route.path);
      await page.waitForTimeout(1000);

      // Verificar que hay un elemento body (página cargada)
      await expect(page.locator('body')).toBeVisible();

      // Verificar que no hay errores críticos en la consola
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Esperar un poco más para detectar errores tardíos
      await page.waitForTimeout(500);

      if (consoleErrors.length > 0) {
        errorReporter.reportError(
          'Funcionalidad Básica',
          route.id,
          `Errores en consola: ${consoleErrors.join(', ')}`,
          { component: route.label }
        );
      }
    }
  });
});

