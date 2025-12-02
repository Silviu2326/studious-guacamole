# Caja & Bancos - Feature Documentation

## Descripción

Sistema completo de gestión de caja física y bancos para gimnasios. Proporciona funcionalidades para el control de efectivo, arqueo de caja, conciliación bancaria y gestión de movimientos financieros.

## Características Principales

### 🏦 Gestión de Caja
- **Arqueo de Caja Física**: Control diario de efectivo en caja
- **Registro de Movimientos**: Ingresos y egresos con categorización
- **Control de Diferencias**: Identificación automática de discrepancias
- **Múltiples Métodos de Pago**: Efectivo, tarjeta, transferencia

### 💳 Conciliación Bancaria
- **Importación de Movimientos**: Carga masiva desde archivos CSV/Excel
- **Conciliación Automática**: Identificación de movimientos coincidentes
- **Gestión de Diferencias**: Resolución de discrepancias bancarias
- **Múltiples Cuentas**: Soporte para diferentes bancos y cuentas

### 📊 Reportes y Estadísticas
- **Métricas en Tiempo Real**: Saldos, ingresos, egresos
- **Estadísticas Diarias**: Análisis de movimientos por día
- **Tendencias**: Comparación con períodos anteriores
- **Alertas**: Notificaciones por diferencias significativas

## Estructura de Archivos

```
src/features/caja-bancos/
├── components/
│   ├── CajaManager.tsx              # Componente principal de gestión de caja
│   ├── MovimientosList.tsx          # Lista de movimientos con filtros
│   ├── NuevoMovimientoModal.tsx     # Modal para crear movimientos
│   ├── ArqueoCajaModal.tsx          # Modal para arqueo de caja
│   ├── ConciliacionBancaria.tsx     # Componente de conciliación bancaria
│   ├── ImportarMovimientosModal.tsx # Modal para importar movimientos
│   ├── NuevaConciliacionModal.tsx   # Modal para crear conciliaciones
│   └── index.ts                     # Exportaciones de componentes
├── hooks/
│   └── useCajaBancos.ts            # Hook personalizado para estado
├── services/
│   ├── cajaService.ts              # Servicio para operaciones de caja
│   └── bancosService.ts            # Servicio para operaciones bancarias
├── types/
│   └── index.ts                    # Definiciones de tipos TypeScript
├── page.tsx                        # Página principal
├── index.ts                        # Exportaciones principales
└── README.md                       # Esta documentación
```

## Componentes Principales

### CajaManager
Componente principal para la gestión de caja física.

**Características:**
- Dashboard con métricas en tiempo real
- Lista de movimientos con filtros avanzados
- Creación de nuevos movimientos
- Arqueo de caja paso a paso

### ConciliacionBancaria
Componente para la conciliación de movimientos bancarios.

**Características:**
- Importación masiva de movimientos
- Conciliación automática y manual
- Gestión de diferencias
- Múltiples cuentas bancarias

## Tipos de Datos

### MovimientoCaja
```typescript
interface MovimientoCaja {
  id: string;
  fecha: Date;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  categoria: string;
  descripcion?: string;
  usuario: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
}
```

### ArqueoCaja
```typescript
interface ArqueoCaja {
  id: string;
  fecha: Date;
  usuario: string;
  montoSistema: number;
  montoFisico: number;
  diferencia: number;
  billetes: Record<string, number>;
  monedas: Record<string, number>;
  observaciones?: string;
  estado: 'abierto' | 'cerrado' | 'revisado';
}
```

### MovimientoBancario
```typescript
interface MovimientoBancario {
  id: string;
  fecha: Date;
  banco: string;
  cuenta: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  concepto: string;
  referencia?: string;
  conciliado: boolean;
  fechaConciliacion?: Date;
}
```

## Servicios

### CajaService
Maneja todas las operaciones relacionadas con la caja física:
- `obtenerMovimientos()`: Obtiene movimientos con filtros
- `crearMovimiento()`: Crea un nuevo movimiento
- `obtenerArqueos()`: Obtiene historial de arqueos
- `crearArqueo()`: Realiza un nuevo arqueo
- `calcularSaldoCaja()`: Calcula el saldo actual

### BancosService
Maneja las operaciones bancarias y conciliación:
- `obtenerMovimientosBancarios()`: Obtiene movimientos bancarios
- `importarMovimientosBancarios()`: Importa desde archivo
- `crearConciliacion()`: Crea nueva conciliación
- `marcarConciliado()`: Marca movimiento como conciliado

## Hook Personalizado

### useCajaBancos
Hook que centraliza toda la lógica de estado y operaciones:

```typescript
const {
  // Estados
  movimientos,
  arqueos,
  movimientosBancarios,
  conciliaciones,
  loading,
  error,
  
  // Funciones de caja
  cargarMovimientos,
  crearMovimiento,
  crearArqueo,
  
  // Funciones bancarias
  cargarMovimientosBancarios,
  importarMovimientosBancarios,
  crearConciliacion,
  
  // Estadísticas
  obtenerEstadisticasDiarias,
  obtenerEstadisticasBancarias
} = useCajaBancos();
```

## Uso

### Importar la página principal
```typescript
import { CajaBancosPage } from '@/features/caja-bancos';

// En tu router
<Route path="/caja-bancos" component={CajaBancosPage} />
```

### Usar componentes individuales
```typescript
import { CajaManager, ConciliacionBancaria } from '@/features/caja-bancos';

function MiComponente() {
  return (
    <div>
      <CajaManager />
      <ConciliacionBancaria />
    </div>
  );
}
```

### Usar el hook
```typescript
import { useCajaBancos } from '@/features/caja-bancos';

function MiComponente() {
  const { movimientos, crearMovimiento, loading } = useCajaBancos();
  
  // Tu lógica aquí
}
```

## Configuración

La feature utiliza datos mock para desarrollo. Para producción, actualizar los servicios para conectar con APIs reales:

1. Actualizar `cajaService.ts` con endpoints reales
2. Actualizar `bancosService.ts` con endpoints reales
3. Configurar autenticación en los hooks
4. Ajustar tipos según la API backend

## Características Técnicas

- **TypeScript**: Tipado completo para mejor desarrollo
- **Componentes Reutilizables**: Usa el sistema de componentes existente
- **Responsive**: Diseño adaptable a diferentes pantallas
- **Dark Mode**: Soporte completo para tema oscuro
- **Accesibilidad**: Componentes accesibles con ARIA
- **Performance**: Lazy loading y optimizaciones

## Próximas Mejoras

- [ ] Integración con TPV real
- [ ] Reportes PDF exportables
- [ ] Notificaciones push
- [ ] Integración con sistemas contables
- [ ] API de conciliación automática
- [ ] Dashboard de analytics avanzado