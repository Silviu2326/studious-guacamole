# Integración de Componentes de Gestión Operativa de Cobros

Este documento explica cómo los componentes `GestorCobros.tsx`, `FacturasVencidas.tsx` y `SeguimientoEstados.tsx` se integran dentro de `FacturacionManager` y el sistema de facturación.

## Componentes Implementados

### 1. GestorCobros.tsx

**Propósito:** Muestra los cobros de una factura y permite registrar pagos completos o parciales. Actualiza la factura en tiempo real tras cada operación.

**Características:**
- Visualiza historial completo de pagos de una factura
- Permite registrar nuevos pagos (completos o parciales)
- Elimina pagos registrados por error
- Muestra barra de progreso de pago
- Actualiza automáticamente el estado de la factura
- Cierra automáticamente cuando la factura está completamente pagada

**Props:**
```typescript
interface GestorCobrosProps {
  factura: Factura;
  isOpen: boolean;
  onClose: () => void;
  onCobroRegistrado?: (facturaActualizada: Factura) => void;
}
```

**Ejemplo de integración en FacturacionManager:**

```tsx
import { GestorCobros } from './GestorCobros';

// En el estado del componente
const [mostrarGestorCobros, setMostrarGestorCobros] = useState(false);
const [facturaParaCobros, setFacturaParaCobros] = useState<Factura | null>(null);

// En las acciones de la tabla
<button
  onClick={() => {
    setFacturaParaCobros(factura);
    setMostrarGestorCobros(true);
  }}
  title="Gestión de cobros"
>
  <DollarSign className="w-4 h-4" />
</button>

// Renderizar el componente
{facturaParaCobros && (
  <GestorCobros
    factura={facturaParaCobros}
    isOpen={mostrarGestorCobros}
    onClose={() => {
      setMostrarGestorCobros(false);
      setFacturaParaCobros(null);
    }}
    onCobroRegistrado={(facturaActualizada) => {
      // Actualizar la lista de facturas
      loadFacturas();
      // Opcionalmente actualizar la factura seleccionada
      setFacturaParaCobros(facturaActualizada);
    }}
  />
)}
```

**Integración en modal de detalle:**

También se puede integrar dentro del modal de detalle de factura para tener acceso directo a la gestión de cobros:

```tsx
<Modal title={`Detalle: ${facturaSeleccionada.numero}`}>
  {/* Información de la factura */}
  
  <div className="mt-4">
    <Button onClick={() => {
      setMostrarDetalle(false);
      setFacturaParaCobros(facturaSeleccionada);
      setMostrarGestorCobros(true);
    }}>
      <DollarSign className="w-4 h-4 mr-2" />
      Gestionar Cobros
    </Button>
  </div>
</Modal>
```

---

### 2. FacturasVencidas.tsx

**Propósito:** Lista facturas vencidas con filtros por antigüedad y riesgo. Acciones: abrir ficha, registrar pago rápido, marcar en seguimiento.

**Características:**
- Lista todas las facturas vencidas con saldo pendiente
- Filtros por antigüedad (menos de 7 días, 7-15, 15-30, más de 30)
- Filtros por nivel de riesgo (bajo, medio, alto)
- Búsqueda por número de factura o cliente
- Estadísticas rápidas (total vencidas, monto total, promedio días, alto riesgo)
- Acciones rápidas: ver detalle, pago rápido, gestión de cobros, marcar seguimiento

**Props:**
```typescript
interface FacturasVencidasProps {
  onFacturaSeleccionada?: (factura: Factura) => void;
  onRefresh?: () => void;
}
```

**Ejemplo de integración como tab en FacturacionManager:**

```tsx
import { FacturasVencidas } from './FacturasVencidas';

// En el estado del componente
const [tabActiva, setTabActiva] = useState('todas');

// En el render
<div className="tabs">
  <button onClick={() => setTabActiva('todas')}>Todas</button>
  <button onClick={() => setTabActiva('vencidas')}>Vencidas</button>
</div>

{tabActiva === 'vencidas' && (
  <FacturasVencidas
    onFacturaSeleccionada={(factura) => {
      // Abrir detalle de factura
      setFacturaSeleccionada(factura);
      setShowDetailModal(true);
    }}
    onRefresh={loadFacturas}
  />
)}
```

**Ejemplo de integración como sección independiente:**

```tsx
// En una página dedicada a facturas vencidas
export const FacturasVencidasPage: React.FC = () => {
  return (
    <div className="container">
      <FacturasVencidas
        onFacturaSeleccionada={(factura) => {
          // Navegar a detalle o abrir modal
          navigate(`/facturas/${factura.id}`);
        }}
        onRefresh={() => {
          // Refrescar datos globales si es necesario
        }}
      />
    </div>
  );
};
```

**Cálculo de riesgo:**
- **Alto:** Más de 30 días vencidos O monto > 10,000
- **Medio:** 15-30 días vencidos O monto > 5,000
- **Bajo:** Menos de 15 días vencidos Y monto <= 5,000

---

### 3. SeguimientoEstados.tsx

**Propósito:** Muestra un timeline pequeño de cambios de estado para una factura. Útil para ver el historial de transiciones de estado.

**Características:**
- Timeline visual de eventos (creación, pagos, cambios de estado)
- Versión compacta para espacios reducidos
- Versión completa con detalles
- Muestra estado actual destacado
- Resumen de pagos registrados

**Props:**
```typescript
interface SeguimientoEstadosProps {
  factura: Factura;
  compacto?: boolean; // Si es true, muestra versión compacta
  className?: string;
}
```

**Ejemplo de integración en modal de detalle:**

```tsx
import { SeguimientoEstados } from './SeguimientoEstados';

<Modal title={`Detalle: ${facturaSeleccionada.numero}`}>
  {/* Información básica de la factura */}
  <div className="grid grid-cols-2 gap-4">
    {/* ... campos de la factura ... */}
  </div>
  
  {/* Timeline de estados */}
  <div className="mt-6">
    <SeguimientoEstados factura={facturaSeleccionada} />
  </div>
</Modal>
```

**Ejemplo de versión compacta:**

```tsx
// En una tarjeta o lista compacta
<Card>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <h3>Información de la Factura</h3>
      {/* ... */}
    </div>
    <div>
      <SeguimientoEstados factura={factura} compacto={true} />
    </div>
  </div>
</Card>
```

**Eventos mostrados en el timeline:**
1. Creación de la factura (estado: pendiente)
2. Cada pago registrado (con estado resultante: parcialmentePagada o pagada)
3. Estado actual de la factura (destacado)

---

## Flujo de Integración Completo

### Escenario 1: Usuario ve factura vencida y quiere gestionar el pago

1. **FacturacionManager** muestra lista de facturas
2. Usuario hace clic en "Ver detalle" de una factura vencida
3. Se abre modal con información básica + **SeguimientoEstados** (timeline)
4. Usuario hace clic en "Gestionar Cobros"
5. Se abre **GestorCobros** con historial de pagos
6. Usuario registra un pago parcial
7. **GestorCobros** actualiza la factura automáticamente
8. Se cierra **GestorCobros** y se actualiza el modal de detalle
9. **SeguimientoEstados** muestra el nuevo evento de pago

### Escenario 2: Usuario quiere ver todas las facturas vencidas

1. **FacturacionManager** tiene tab "Vencidas"
2. Usuario cambia al tab y se muestra **FacturasVencidas**
3. **FacturasVencidas** carga y muestra todas las facturas vencidas con filtros
4. Usuario aplica filtro por riesgo "Alto"
5. Usuario hace clic en "Pago Rápido" de una factura
6. Se abre **ModalPagoRapido** (ya existente)
7. Usuario registra el pago
8. **FacturasVencidas** se actualiza automáticamente
9. La factura desaparece de la lista si está completamente pagada

### Escenario 3: Usuario quiere ver historial completo de una factura

1. Usuario abre detalle de factura desde cualquier lugar
2. Modal muestra información básica
3. **SeguimientoEstados** muestra timeline completo:
   - Fecha de creación
   - Cada pago registrado con fecha y monto
   - Estado actual
4. Usuario puede ver la progresión: pendiente → parcialmentePagada → pagada

---

## APIs Utilizadas

Todos los componentes utilizan las APIs centralizadas:

- **cobrosAPI** (`src/features/facturacion-cobros/api/cobros.ts`)
  - `getCobrosPorFactura(facturaId)`
  - `registrarCobro(facturaId, datosCobro)`
  - `eliminarCobro(cobroId)`

- **facturasAPI** (`src/features/facturacion-cobros/api/facturas.ts`)
  - `getFacturaById(facturaId)`
  - `getFacturas(filtros)`

- **facturasVencidasAPI** (`src/features/facturacion-cobros/api/facturasVencidas.ts`)
  - `getFacturasVencidas(filtros)`
  - `marcarComoEnSeguimiento(facturaId)`

- **paymentStatusUtils** (`src/features/facturacion-cobros/utils/paymentStatus.ts`)
  - `esFacturaVencida(estado, fechaVencimiento)`
  - `calcularEstadoFactura(saldoPendiente, total, fechaVencimiento)`

---

## Mejores Prácticas

1. **Actualización de estado:** Siempre usar `onCobroRegistrado` o `onRefresh` para actualizar listas padre después de operaciones
2. **Manejo de errores:** Todos los componentes manejan errores internamente y muestran mensajes al usuario
3. **Carga de datos:** Los componentes cargan sus propios datos cuando se montan (useEffect)
4. **Optimización:** Usar `useMemo` para cálculos costosos (filtros, estadísticas)
5. **Accesibilidad:** Todos los botones tienen títulos descriptivos y iconos claros

---

## Próximos Pasos

Para mejorar la integración, se pueden considerar:

1. Agregar **GestorCobros** como botón en la tabla de facturas
2. Agregar **SeguimientoEstados** compacto en cada fila de la tabla
3. Crear un dashboard que combine **FacturasVencidas** con métricas
4. Agregar notificaciones cuando se registran pagos importantes
5. Implementar exportación de reportes desde **FacturasVencidas**

