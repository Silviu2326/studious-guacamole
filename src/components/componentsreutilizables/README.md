# 🧩 Biblioteca de Componentes Reutilizables

Esta biblioteca contiene componentes reutilizables basados en la guía de estilos v2.0, diseñados para ser consistentes, accesibles y modernos.

## 📦 Componentes Disponibles

### 1. **Button** - Botones con variantes
```tsx
import { Button } from './ui/componentsreutilizables';

// Variantes
<Button variant="primary">Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="ghost">Fantasma</Button>
<Button variant="destructive">Destructivo</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>
<Button size="lg">Grande</Button>

// Estados
<Button loading>Cargando...</Button>
<Button disabled>Deshabilitado</Button>
<Button fullWidth>Ancho completo</Button>
```

### 2. **Card** - Tarjetas con variantes
```tsx
import { Card } from './ui/componentsreutilizables';

// Variantes
<Card variant="default">Contenido</Card>
<Card variant="hover">Con hover</Card>
<Card variant="elevated">Elevada</Card>

// Padding
<Card padding="sm">Padding pequeño</Card>
<Card padding="md">Padding mediano</Card>
<Card padding="lg">Padding grande</Card>

// Interactiva
<Card onClick={() => console.log('clicked')}>
  Card clickeable
</Card>
```

### 3. **Input** - Campos de entrada
```tsx
import { Input } from './ui/componentsreutilizables';

// Básico
<Input label="Nombre" placeholder="Ingresa tu nombre" />

// Con validación
<Input 
  label="Email" 
  type="email"
  error="Email inválido"
  helperText="Ingresa un email válido"
/>

// Con iconos
<Input 
  label="Búsqueda"
  leftIcon={<SearchIcon />}
  rightIcon={<FilterIcon />}
/>
```

### 4. **Select** - Selectores desplegables
```tsx
import { Select } from './ui/componentsreutilizables';

const options = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
  { value: '3', label: 'Opción 3' },
];

<Select 
  label="Selecciona una opción"
  options={options}
  placeholder="Elige..."
  error="Selección requerida"
/>
```

### 5. **Textarea** - Áreas de texto
```tsx
import { Textarea } from './ui/componentsreutilizables';

<Textarea 
  label="Comentarios"
  placeholder="Escribe aquí..."
  rows={4}
  showCount
  maxLength={500}
  helperText="Máximo 500 caracteres"
/>
```

### 6. **Tabs** - Navegación por pestañas
```tsx
import { Tabs } from './ui/componentsreutilizables';

const tabItems = [
  { id: 'tab1', label: 'Pestaña 1', icon: <HomeIcon /> },
  { id: 'tab2', label: 'Pestaña 2', icon: <SettingsIcon /> },
  { id: 'tab3', label: 'Pestaña 3', disabled: true },
];

<Tabs 
  items={tabItems}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="pills"
  fullWidth
/>
```

### 7. **Table** - Tablas con acciones
```tsx
import { Table } from './ui/componentsreutilizables';

const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Estado', render: (value) => <Badge>{value}</Badge> },
];

const actions = [
  {
    label: 'Editar',
    icon: <EditIcon />,
    variant: 'ghost' as const,
    onClick: (row) => handleEdit(row),
  },
  {
    label: 'Eliminar',
    icon: <DeleteIcon />,
    variant: 'destructive' as const,
    onClick: (row) => handleDelete(row),
  },
];

<Table 
  data={users}
  columns={columns}
  actions={actions}
  onSort={handleSort}
  loading={isLoading}
/>
```

### 8. **Modal** - Ventanas modales
```tsx
import { Modal, ConfirmModal } from './ui/componentsreutilizables';

// Modal básico
<Modal 
  isOpen={isOpen}
  onClose={onClose}
  title="Título del Modal"
  size="lg"
>
  <p>Contenido del modal</p>
</Modal>

// Modal de confirmación
<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleConfirm}
  title="Confirmar acción"
  message="¿Estás seguro de que quieres continuar?"
  variant="destructive"
/>
```

### 9. **Tooltip** - Información contextual
```tsx
import { Tooltip } from './ui/componentsreutilizables';

<Tooltip 
  content="Información adicional"
  position="top"
  delay={300}
>
  <Button>Hover me</Button>
</Tooltip>
```

### 10. **MetricCards** - Tarjetas de métricas
```tsx
import { MetricCards } from './ui/componentsreutilizables';

const metrics = [
  {
    id: '1',
    title: 'Usuarios Activos',
    value: '1,234',
    subtitle: 'Este mes',
    trend: { value: 12, direction: 'up', label: 'vs mes anterior' },
    icon: <UsersIcon />,
    color: 'success' as const,
  },
  {
    id: '2',
    title: 'Ventas',
    value: '$45,678',
    trend: { value: 5, direction: 'down' },
    icon: <DollarIcon />,
    color: 'primary' as const,
  },
];

<MetricCards 
  data={metrics}
  columns={4}
/>
```

## 🎨 Características de Diseño

### **Colores Semánticos**
- **Primary**: `#6366F1` - Acciones principales
- **Success**: `#10B981` - Estados exitosos
- **Warning**: `#F59E0B` - Advertencias
- **Error**: `#EF4444` - Errores
- **Info**: `#3B82F6` - Información

### **Tipografía**
- **Display**: 48px, 36px, 30px
- **Headings**: 24px, 20px
- **Body**: 18px, 16px, 14px
- **Caption**: 12px, 10px

### **Espaciado (Sistema 8px)**
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px

### **Radios de Borde**
- **sm**: 6px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px
- **2xl**: 24px

## 🌙 Modo Oscuro

Todos los componentes incluyen soporte automático para modo oscuro usando las clases de Tailwind `dark:`.

## ♿ Accesibilidad

- **WCAG 2.1 AA**: Contraste mínimo 4.5:1
- **Focus visible**: Estados de focus claramente visibles
- **Navegación por teclado**: Soporte completo para teclado
- **Screen readers**: Labels y roles semánticos apropiados
- **Tamaños táctiles**: Mínimo 44px para elementos interactivos

## 🚀 Uso Rápido

```tsx
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Textarea, 
  Tabs, 
  Table, 
  Modal, 
  Tooltip, 
  MetricCards 
} from './ui/componentsreutilizables';

// Usa los componentes directamente en tu aplicación
```
