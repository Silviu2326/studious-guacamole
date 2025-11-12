# 🧪 Sistema de Tests E2E

Este sistema de tests recorre automáticamente todas las páginas de la aplicación, detecta errores y genera reportes completos.

## 📋 Características

- ✅ Recorre automáticamente todas las páginas de la sidebar
- 🔍 Detecta errores en consola y en la página
- ⚠️ Captura advertencias
- 📊 Genera reportes detallados en JSON y HTML
- 🎯 Prueba tanto para rol Entrenador como Gimnasio
- ⏱️ Mide tiempos de carga de páginas
- 📸 Captura screenshots en caso de errores

## 🚀 Instalación

1. Instalar dependencias de Playwright:
```bash
npm install
npx playwright install
```

## 📝 Ejecutar Tests

### Test completo (recomendado)
```bash
npm run test:e2e:all-pages
```

Este comando:
- Recorre todas las páginas de la sidebar
- Prueba con ambos roles (Entrenador y Gimnasio)
- Detecta todos los errores
- Genera reportes completos

### Test con UI interactiva
```bash
npm run test:e2e:ui
```

### Test con navegador visible
```bash
npm run test:e2e:headed
```

### Todos los tests E2E
```bash
npm run test:e2e
```

## 📊 Ver Reportes

Después de ejecutar los tests, los reportes se generan en:

- **JSON**: `test-results/exhaustive-test-report.json`
- **HTML**: `test-results/report.html`
- **Texto**: `test-results/error-report.txt`

### Generar reporte visual
```bash
npm run test:report
```

Este comando genera un reporte HTML interactivo con todas las estadísticas.

## 🔍 Qué detecta el sistema

### Errores Detectados:
- ❌ Errores en la consola del navegador
- ❌ Errores de JavaScript en la página
- ❌ Páginas que no cargan (404, errores)
- ❌ Páginas sin contenido
- ❌ Problemas de navegación

### Métricas Recopiladas:
- ⏱️ Tiempo de carga de cada página
- ✅/❌ Estado de carga (éxito/fallo)
- ⚠️ Advertencias de consola
- 📁 Categorización de errores por sección

## 📁 Estructura de Archivos

```
tests/
├── e2e/
│   └── all-pages.spec.ts     # Test principal que recorre todas las páginas
└── utils/
    ├── page-navigator.ts     # Helpers para navegar y verificar páginas
    └── generate-report.js     # Script para generar reportes

test-results/                  # Reportes generados (se crea automáticamente)
├── exhaustive-test-report.json
├── report.html
└── error-report.txt
```

## 🎯 Rutas Probadas

El sistema prueba automáticamente todas las rutas definidas en la sidebar, incluyendo:

- ✅ Dashboard (Resumen General, Tareas, Objetivos)
- ✅ CRM & Clientes (Leads, Pipeline, Clientes, etc.)
- ✅ Entrenamiento (Programas, Editor, Biblioteca, etc.)
- ✅ Nutrición (Dietas, Editor, Recetario, etc.)
- ✅ Agenda & Reservas
- ✅ Finanzas
- ✅ Membresías & Planes
- ✅ Ventas / POS / Tienda
- ✅ Operaciones del Centro
- ✅ Compras
- ✅ Equipo / RRHH
- ✅ Marketing
- ✅ Programas Corporativos (B2B)
- ✅ Multisede / Franquicias
- ✅ Integraciones
- ✅ Configuración

## 🛠️ Configuración

El archivo `playwright.config.ts` contiene la configuración:
- Navegadores a probar (Chrome, Firefox, Safari)
- Timeout y retries
- Configuración del servidor de desarrollo
- Reportes generados

## 💡 Uso Avanzado

### Probar solo ciertas secciones

Edita `tests/utils/page-navigator.ts` y filtra las rutas:

```typescript
const routes = getRoutesForRole('entrenador')
  .filter(r => r.section === 'Dashboard');
```

### Agregar más verificaciones

En `tests/e2e/all-pages.spec.ts`, puedes agregar más verificaciones:

```typescript
// Verificar que un elemento específico existe
await expect(page.locator('.mi-elemento')).toBeVisible();

// Verificar que no hay errores de accesibilidad
// (requiere @axe-core/playwright)
```

## 📝 Notas

- Los tests requieren que el servidor de desarrollo esté corriendo (se inicia automáticamente)
- Se usan credenciales de prueba definidas en `src/data/users.ts`
- El tiempo total de ejecución puede ser de varios minutos para recorrer todas las páginas
- Los screenshots y videos se guardan solo en caso de fallos

## 🐛 Solución de Problemas

### Error: "No se puede conectar al servidor"
- Asegúrate de que el puerto 5173 esté disponible
- Verifica que no haya otro proceso usando ese puerto

### Tests muy lentos
- Reduce el timeout en `navigateAndVerifyPage`
- Prueba menos páginas a la vez
- Usa `test.setTimeout()` para aumentar el tiempo permitido

### Errores de login
- Verifica que las credenciales en `src/data/users.ts` sean correctas
- Revisa que el componente Login tenga los selectores correctos






















