import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Textarea, 
  Tabs, 
  Table,
  TableWithActions, 
  Modal, 
  Tooltip, 
  MetricCards 
} from './index';
import { ds } from '../../features/adherencia/ui/ds';

// Iconos de ejemplo (puedes reemplazar con tus iconos reales)
const HomeIcon = () => <span>🏠</span>;
const SettingsIcon = () => <span>⚙️</span>;
const UsersIcon = () => <span>👥</span>;
const ChartIcon = () => <span>📊</span>;
const SearchIcon = () => <span>🔍</span>;
const FilterIcon = () => <span>🔽</span>;

export const ExamplePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  // Datos de ejemplo para la tabla
  const tableData = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', status: 'Activo', role: 'Admin' },
    { id: 2, name: 'María García', email: 'maria@email.com', status: 'Inactivo', role: 'Usuario' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', status: 'Activo', role: 'Moderador' },
  ];

  const tableColumns = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Estado', 
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Activo' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'role', label: 'Rol' },
  ];

  const tableActions = [
    {
      label: 'Editar',
      icon: <span className="text-lg">✏️</span>,
      variant: 'ghost' as const,
      onClick: (row: any) => console.log('Editar:', row),
    },
    {
      label: 'Ver',
      icon: <span className="text-lg">👁️</span>,
      variant: 'ghost' as const,
      onClick: (row: any) => console.log('Ver:', row),
    },
    {
      label: 'Eliminar',
      icon: <span className="text-lg">🗑️</span>,
      variant: 'destructive' as const,
      onClick: (row: any) => console.log('Eliminar:', row),
    },
  ];

  // Datos de ejemplo para métricas
  const metricsData = [
    {
      id: '1',
      title: 'Usuarios Activos',
      value: '1,234',
      subtitle: 'Este mes',
      trend: { value: 12, direction: 'up' as const, label: 'vs mes anterior' },
      icon: <UsersIcon />,
      color: 'success' as const,
    },
    {
      id: '2',
      title: 'Ventas',
      value: '$45,678',
      trend: { value: 5, direction: 'down' as const },
      icon: <ChartIcon />,
      color: 'primary' as const,
    },
    {
      id: '3',
      title: 'Conversiones',
      value: '23.5%',
      trend: { value: 2, direction: 'up' as const },
      icon: <ChartIcon />,
      color: 'info' as const,
    },
    {
      id: '4',
      title: 'Errores',
      value: '12',
      trend: { value: 8, direction: 'down' as const },
      icon: <ChartIcon />,
      color: 'error' as const,
    },
  ];

  const tabItems = [
    { id: 'buttons', label: 'Botones', icon: <HomeIcon /> },
    { id: 'forms', label: 'Formularios', icon: <SettingsIcon /> },
    { id: 'data', label: 'Datos', icon: <ChartIcon /> },
    { id: 'overlays', label: 'Overlays', icon: <UsersIcon /> },
  ];

  const selectOptions = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F0F23] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className={`${ds.typography.display} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            🧩 Biblioteca de Componentes
          </h1>
          <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Ejemplos de todos los componentes reutilizables basados en la guía de estilos v2.0
          </p>
        </div>

        {/* Navegación por pestañas */}
        <Card>
          <Tabs
            items={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="pills"
            fullWidth
          />
        </Card>

        {/* Contenido de las pestañas */}
        {activeTab === 'buttons' && (
          <div className="space-y-8">
            {/* Botones - Variantes */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Botones - Variantes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Primary</h3>
                  <div className="space-y-2">
                    <Button variant="primary" size="sm">Pequeño</Button>
                    <Button variant="primary" size="md">Mediano</Button>
                    <Button variant="primary" size="lg">Grande</Button>
                    <Button variant="primary" fullWidth>Ancho completo</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Secondary</h3>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm">Pequeño</Button>
                    <Button variant="secondary" size="md">Mediano</Button>
                    <Button variant="secondary" size="lg">Grande</Button>
                    <Button variant="secondary" fullWidth>Ancho completo</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Ghost</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm">Pequeño</Button>
                    <Button variant="ghost" size="md">Mediano</Button>
                    <Button variant="ghost" size="lg">Grande</Button>
                    <Button variant="ghost" fullWidth>Ancho completo</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Destructive</h3>
                  <div className="space-y-2">
                    <Button variant="destructive" size="sm">Pequeño</Button>
                    <Button variant="destructive" size="md">Mediano</Button>
                    <Button variant="destructive" size="lg">Grande</Button>
                    <Button variant="destructive" fullWidth>Ancho completo</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Botones - Estados */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Botones - Estados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Normal</h3>
                  <div className="space-y-2">
                    <Button variant="primary">Botón Normal</Button>
                    <Button variant="secondary">Botón Normal</Button>
                    <Button variant="ghost">Botón Normal</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Loading</h3>
                  <div className="space-y-2">
                    <Button variant="primary" loading>Cargando...</Button>
                    <Button variant="secondary" loading>Cargando...</Button>
                    <Button variant="ghost" loading>Cargando...</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Disabled</h3>
                  <div className="space-y-2">
                    <Button variant="primary" disabled>Deshabilitado</Button>
                    <Button variant="secondary" disabled>Deshabilitado</Button>
                    <Button variant="ghost" disabled>Deshabilitado</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cards */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Cards - Variantes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="default" padding="md">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                    Card Default
                  </h3>
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Esta es una card con estilo por defecto.
                  </p>
                </Card>

                <Card variant="hover" padding="md">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                    Card Hover
                  </h3>
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Esta card tiene efectos de hover.
                  </p>
                </Card>

                <Card variant="elevated" padding="md">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                    Card Elevated
                  </h3>
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Esta card tiene mayor elevación.
                  </p>
                </Card>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-8">
            {/* Inputs */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Campos de Entrada
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre completo"
                  placeholder="Ingresa tu nombre"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  error="Email inválido"
                  helperText="Ingresa un email válido"
                />

                <Input
                  label="Búsqueda"
                  placeholder="Buscar..."
                  leftIcon={<SearchIcon />}
                  rightIcon={<FilterIcon />}
                />

                <Select
                  label="Selecciona una opción"
                  options={selectOptions}
                  placeholder="Elige una opción..."
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                />
              </div>

              <div className="mt-6">
                <Textarea
                  label="Comentarios"
                  placeholder="Escribe tus comentarios aquí..."
                  rows={4}
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  showCount
                  maxLength={500}
                  helperText="Máximo 500 caracteres"
                />
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-8">
            {/* Métricas */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Tarjetas de Métricas
              </h2>
              <MetricCards data={metricsData} columns={4} />
            </Card>

            {/* Tabla Básica */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Tabla Básica
              </h2>
              <Table
                data={tableData}
                columns={tableColumns}
                onSort={(column, direction) => console.log('Sort:', column, direction)}
              />
            </Card>

            {/* Tabla con Acciones */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Tabla con Acciones
              </h2>
              <TableWithActions
                data={tableData}
                columns={tableColumns}
                actions={tableActions}
                onSort={(column, direction) => console.log('Sort:', column, direction)}
              />
            </Card>
          </div>
        )}

        {activeTab === 'overlays' && (
          <div className="space-y-8">
            {/* Modales */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Modales y Overlays
              </h2>
              <div className="flex space-x-4">
                <Button onClick={() => setShowModal(true)}>
                  Abrir Modal
                </Button>
                <Button variant="destructive" onClick={() => setShowConfirmModal(true)}>
                  Modal de Confirmación
                </Button>
              </div>
            </Card>

            {/* Tooltips */}
            <Card>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
                Tooltips
              </h2>
              <div className="flex space-x-4">
                <Tooltip content="Este es un tooltip en la parte superior" position="top">
                  <Button variant="secondary">Tooltip Arriba</Button>
                </Tooltip>

                <Tooltip content="Este es un tooltip en la parte inferior" position="bottom">
                  <Button variant="secondary">Tooltip Abajo</Button>
                </Tooltip>

                <Tooltip content="Este es un tooltip a la izquierda" position="left">
                  <Button variant="secondary">Tooltip Izquierda</Button>
                </Tooltip>

                <Tooltip content="Este es un tooltip a la derecha" position="right">
                  <Button variant="secondary">Tooltip Derecha</Button>
                </Tooltip>
              </div>
            </Card>
          </div>
        )}

        {/* Modales */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Modal de Ejemplo"
          size="lg"
          footer={
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowModal(false)}>
                Confirmar
              </Button>
            </div>
          }
        >
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            Este es un ejemplo de modal con contenido personalizado. Puedes incluir cualquier componente aquí.
          </p>
          <Input
            label="Campo de ejemplo"
            placeholder="Escribe algo..."
          />
        </Modal>

        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirmar Acción"
          size="sm"
          footer={
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => setShowConfirmModal(false)}>
                Eliminar
              </Button>
            </div>
          }
        >
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            ¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.
          </p>
        </Modal>
      </div>
    </div>
  );
};
