import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, BarChart2, AlertTriangle, TrendingUp, Send, Bot, PieChart as PieChartIcon, Activity, Info, AlertCircle, CheckCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

export const FitCoachPanel: React.FC = () => {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false); // Controls drawer on mobile/tablet
  const [activeTab, setActiveTab] = useState('Chat'); // Default active tab
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Estoy analizando el programa de María López. ¿En qué puedo ayudarte?', isUser: false },
    { id: 2, text: 'Optimiza la semana 1', isUser: true },
    { id: 3, text: 'He analizado la Semana 1 y encontré 3 oportunidades de mejora: 1. Balance Push/Pull. 2. Volumen de Core. 3. Distribución de RPE.', isUser: false },
    { id: 4, text: '¿Quieres que aplique todas las mejoras?', isUser: false },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      level: 'critical',
      title: 'Progresión de volumen excesiva',
      message: 'Sem 2 -> Sem 3: +18% de volumen. Recomendado: máximo +10% semanal.',
      action: {
        label: 'Ajustar automáticamente',
        handler: () => console.log('Ajustando volumen...'),
      },
    },
    {
      id: '2',
      level: 'warning',
      title: 'Desequilibrio Push/Pull',
      message: 'Ratio actual: 65/35 (recomendado: 55/45).',
      action: {
        label: 'Ver sugerencias',
        handler: () => console.log('Ver sugerencias push/pull...'),
      },
    },
    {
      id: '3',
      level: 'info',
      title: 'Día domingo vacío',
      message: 'El día domingo no tiene asignación. ¿Deseas agregar descanso activo?',
      action: {
        label: 'Agregar descanso',
        handler: () => console.log('Agregando descanso...'),
      },
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      // Close mobile panel if screen becomes desktop-sized while open
      if (window.innerWidth >= 768 && isMobilePanelOpen) {
        setIsMobilePanelOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobilePanelOpen]);

  // Mock Data for Insights
  const weeklyVolumeData = [
    { name: 'Sem 1', volume: 180 },
    { name: 'Sem 2', volume: 195 },
    { name: 'Sem 3', volume: 210 },
    { name: 'Sem 4', volume: 140 },
  ];

  const muscleDistributionData = [
    { name: 'Upper', value: 50 },
    { name: 'Lower', value: 50 },
  ];

  const movementPatternsData = [
    { subject: 'Push', A: 65, fullMark: 100 },
    { subject: 'Pull', A: 35, fullMark: 100 },
    { subject: 'Squat', A: 80, fullMark: 100 },
    { subject: 'Hinge', A: 70, fullMark: 100 },
    { subject: 'Carry', A: 40, fullMark: 100 },
  ];

  // Colors from spec
  const COLORS = {
    primary: '#1E3A8A', // Azul oscuro
    secondary: '#3B82F6', // Azul claro
    success: '#10B981', // Verde
    warning: '#F59E0B', // Naranja
    error: '#EF4444', // Rojo
    chartColors: ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444'],
  };

  const hasData = true; // Toggle this to test Empty State

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string = inputMessage) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), text: text, isUser: true }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      
      // Simulate Action Card for specific input
      if (text.toLowerCase().includes('balance') || text.toLowerCase().includes('push')) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            id: Date.now() + 1, 
            text: 'He analizado el balance de tu programa y detecté una oportunidad de mejora importante.', 
            isUser: false,
            actionCard: {
              title: 'Desbalance Push/Pull',
              description: 'Ratio actual 3:1. Se recomienda acercarse a 1:1 para prevenir lesiones.',
              actions: [
                { label: 'Corregir (+Remo)', onClick: () => alert('Acción ejecutada: Agregando ejercicios de remo...') },
                { label: 'Ignorar', onClick: () => alert('Alerta ignorada') }
              ]
            }
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now() + 1, text: 'Entendido. Estoy procesando tu solicitud para optimizar el programa.', isUser: false },
        ]);
      }
    }, 1500);
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const SuggestionChip: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
    <button
      onClick={onClick}
      className="border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap"
    >
      {text}
    </button>
  );

  const suggestions = [
    'Optimiza la semana 1',
    'Sugiere ejercicios para el lunes',
    '¿Está bien balanceado el programa?',
    'Crea un día de pierna',
  ];

  interface ActionCardProps {
    title: string;
    description: string;
    actions: { label: string; onClick: () => void }[];
  }

  const ActionCard: React.FC<ActionCardProps> = ({ title, description, actions }) => (
    <div className="card bg-white border border-gray-200 p-3 rounded-lg shadow-sm mt-2 mb-1">
      <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
        <AlertTriangle size={14} className="text-orange-500" />
        {title}
      </h4>
      <p className="text-xs text-gray-600 mb-3 mt-1">{description}</p>
      <div className="flex gap-2">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              idx === 0 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  const MessageBubble: React.FC<{ message: any }> = ({ message }) => {
    return (
      <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        {!message.isUser && (
          <div className="flex-shrink-0 mr-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Bot size={18} />
            </div>
          </div>
        )}
        <div className="flex flex-col max-w-[80%]">
          <div
            className={`
              p-3 text-sm shadow-sm
              ${message.isUser
                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
                : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none border border-gray-200'}
            `}
          >
            {message.text}
          </div>
          {message.actionCard && (
            <ActionCard 
              title={message.actionCard.title} 
              description={message.actionCard.description} 
              actions={message.actionCard.actions} 
            />
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'Chat', label: 'Chat', icon: MessageSquare },
    { id: 'Insights', label: 'Insights', icon: BarChart2 },
    { id: 'Alertas', label: 'Alertas', icon: AlertTriangle, count: alerts.length },
    { id: 'Metricas', label: 'Métricas', icon: TrendingUp },
  ];

  const panelWidthClass = isDesktopCollapsed ? 'w-12' : 'w-80'; // 48px vs 320px
  const maxWidthClass = isDesktopCollapsed ? '' : 'max-w-[400px]'; // Max width for ultrawide monitors

  const getAlertStyle = (level: string) => {
    switch (level) {
      case 'critical':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconColor: 'text-red-500', icon: AlertCircle };
      case 'warning':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', iconColor: 'text-yellow-500', icon: AlertTriangle };
      case 'info':
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-500', icon: Info };
    }
  };

  return (
    <>
      {isMobilePanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobilePanelOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    <aside
      role="region"
      aria-label="FitCoach Panel"
      className={`
        fixed inset-y-0 right-0 z-50 w-full md:w-80 lg:w-96 xl:max-w-[400px] // Base width for drawer and desktop
        flex flex-col h-full bg-white border-l border-gray-200 shadow-lg // Common styles
        transform transition-transform duration-300 ease-in-out
        ${isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full'} // Slide-in/out for mobile/tablet
        md:relative md:translate-x-0 md:shadow-none // Desktop overrides for positioning
        ${isDesktopCollapsed ? 'md:w-12' : 'md:w-80'} // Desktop collapse/expand
      `}
    >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                {!isDesktopCollapsed && <h3 className="text-lg font-semibold">FitCoach</h3>}

                {/* Desktop Collapse Button */}
                <button 
                  onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                  className="p-1 rounded-md hover:bg-gray-100 hidden md:block"
                  aria-label={isDesktopCollapsed ? "Expand FitCoach Panel" : "Collapse FitCoach Panel"}
                >
                  {isDesktopCollapsed ? '>' : '<'} {/* Simple arrow icons */}
                </button>

                {/* Mobile Close Button (Drawer) */}
                <button 
                  onClick={() => setIsMobilePanelOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 md:hidden"
                  aria-label="Close FitCoach Panel"
                >
                  X
                </button>
              </div>
            </div>
      
            {/* Tab Navigation or Collapsed Icons */}
            <div role="tablist" aria-label="FitCoach Tabs" className={`flex-shrink-0 ${isDesktopCollapsed ? 'flex-col' : 'flex-row'} flex border-b border-gray-200`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      // On desktop, expand if collapsed; on mobile, ensure drawer is open
                      if (isDesktopCollapsed) setIsDesktopCollapsed(false);
                      if (!isMobilePanelOpen) setIsMobilePanelOpen(true); // Open drawer on mobile/tablet if not already open
                    }}
                    className={`
                      ${isDesktopCollapsed ? 'py-4 flex flex-col items-center' : 'flex-1 py-3 px-1 relative'}
                      flex items-center justify-center text-sm font-medium
                      ${activeTab === tab.id
                        ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' // Active tab style
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                      ${isDesktopCollapsed ? '' : 'border-b-2'}
                      focus:outline-none transition-all duration-200 ease-in-out
                    `}
                    title={tab.label}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`${tab.id.toLowerCase()}-panel`}
                  >
                    <div className="relative">
                      <Icon size={isDesktopCollapsed ? 24 : 18} />
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {tab.count}
                        </span>
                      )}
                    </div>
                    {!isDesktopCollapsed && <span className="ml-2">{tab.label}</span>}
                  </button>
                );
              })}
            </div>
      
            {/* Body Scrollable - This will contain the tabs content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {(!isDesktopCollapsed || isMobilePanelOpen) && ( // Content visible if not desktop-collapsed OR if mobile drawer is open
                <>
                  {activeTab === 'Chat' && (
                    <div
                      id="chat-panel"
                      role="tabpanel"
                      aria-labelledby="Chat-tab"
                      className="flex-1 overflow-y-auto p-4 space-y-4"
                      aria-live="polite" // Announce new messages
                    >
                      {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                      {isTyping && (
                        <div className="flex justify-start mb-4">
                          <div className="flex-shrink-0 mr-2">
                             <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                              <Bot size={18} />
                            </div>
                          </div>
                           <div className="bg-gray-100 text-gray-500 text-xs italic p-3 rounded-2xl rounded-tl-none border border-gray-200">
                            Escribiendo...
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                                    )}
                                    
                                    {activeTab === 'Insights' && (
                                      <div 
                                        id="insights-panel"
                                        role="tabpanel"
                                        aria-labelledby="Insights-tab"
                                        className="flex-1 overflow-y-auto p-4 space-y-6"
                                      >
                                        <div className="mb-4">
                                          <h4 className="text-lg font-bold text-gray-900 mb-1">Insights del Programa</h4>
                                          <p className="text-xs text-gray-500">Análisis en tiempo real de tu programación</p>
                                        </div>
                  
                                        {!hasData ? (
                                          <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                            <Activity className="w-12 h-12 text-gray-300 mb-3" />
                                            <h5 className="text-sm font-medium text-gray-900">Sin datos suficientes</h5>
                                            <p className="text-xs text-gray-500 mt-1">Agrega ejercicios al calendario para generar insights y gráficas.</p>
                                          </div>
                                        ) : (
                                          <>
                                            {/* 1. Volumen Semanal */}
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Volumen Semanal (Series)</h5>
                                              <div className="h-40 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                  <BarChart data={weeklyVolumeData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                                    <Tooltip 
                                                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '12px' }}
                                                      cursor={{ fill: '#F3F4F6' }}
                                                    />
                                                    <Bar dataKey="volume" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                                                  </BarChart>
                                                </ResponsiveContainer>
                                              </div>
                                              <div className="mt-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                                                <TrendingUp size={14} />
                                                <span>Progresión: +8% vs sem anterior</span>
                                              </div>
                                            </div>
                  
                                            {/* 2. Distribución Muscular */}
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Balance Muscular</h5>
                                              <div className="h-40 w-full flex">
                                                <div className="w-1/2 h-full relative">
                                                  <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                      <Pie
                                                        data={muscleDistributionData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={30}
                                                        outerRadius={50}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                      >
                                                        {muscleDistributionData.map((entry, index) => (
                                                          <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                                                        ))}
                                                      </Pie>
                                                    </PieChart>
                                                  </ResponsiveContainer>
                                                  {/* Center Label */}
                                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="text-xs font-bold text-gray-700">50/50</span>
                                                  </div>
                                                </div>
                                                <div className="w-1/2 flex flex-col justify-center space-y-2 pl-2">
                                                  <div className="flex items-center text-xs">
                                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.chartColors[0] }}></div>
                                                    <span className="text-gray-600">Upper (50%)</span>
                                                  </div>
                                                  <div className="flex items-center text-xs">
                                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.chartColors[1] }}></div>
                                                    <span className="text-gray-600">Lower (50%)</span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="mt-1 text-xs text-gray-500 text-center italic">
                                                Balance óptimo logrado
                                              </div>
                                            </div>
                  
                                            {/* 3. Patrones de Movimiento */}
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Patrones de Movimiento</h5>
                                              <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={movementPatternsData}>
                                                    <PolarGrid stroke="#E5E7EB" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#4B5563' }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                    <Radar
                                                      name="Programa Actual"
                                                      dataKey="A"
                                                      stroke={COLORS.secondary}
                                                      fill={COLORS.secondary}
                                                      fillOpacity={0.4}
                                                    />
                                                    <Tooltip contentStyle={{ fontSize: '12px' }}/>
                                                  </RadarChart>
                                                </ResponsiveContainer>
                                              </div>
                                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 flex items-start gap-2">
                                                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                                                <span>Desbalance Push/Pull detectado (65/35). Se recomienda agregar tracción.</span>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                  
                                    {activeTab === 'Alertas' && (
                                      <div 
                                        id="alertas-panel"
                                        role="tabpanel"
                                        aria-labelledby="Alertas-tab"
                                        className="flex-1 overflow-y-auto p-4 space-y-4"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                           <h4 className="text-lg font-bold text-gray-900">Alertas y Sugerencias</h4>
                                           {alerts.length > 0 && (
                                             <button 
                                               onClick={() => setAlerts([])}
                                               className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                             >
                                               Limpiar todas
                                             </button>
                                           )}
                                        </div>
                                        
                                        {alerts.length === 0 ? (
                                           <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                                            <h5 className="text-sm font-medium text-gray-900">Todo se ve bien</h5>
                                            <p className="text-xs text-gray-500 mt-1">No se han detectado problemas en tu programa.</p>
                                          </div>
                                        ) : (
                                          alerts.map((alert) => {
                                            const styles = getAlertStyle(alert.level);
                                            const AlertIcon = styles.icon;
                                            
                                            return (
                                              <div key={alert.id} className={`p-4 rounded-lg border ${styles.bg} ${styles.border} ${styles.text} shadow-sm`}>
                                                <div className="flex items-start gap-3">
                                                  <AlertIcon className={`flex-shrink-0 w-5 h-5 ${styles.iconColor}`} />
                                                  <div className="flex-1">
                                                    <h5 className="text-sm font-bold mb-1">{alert.title}</h5>
                                                    <p className="text-xs opacity-90 mb-3 leading-relaxed">{alert.message}</p>
                                                    <div className="flex gap-2">
                                                      {alert.action && (
                                                        <button 
                                                          onClick={alert.action.handler}
                                                          className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 shadow-sm transition-colors"
                                                        >
                                                          {alert.action.label}
                                                        </button>
                                                      )}
                                                      <button 
                                                        onClick={() => dismissAlert(alert.id)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                                      >
                                                        Ignorar
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                        )}
                                      </div>
                                    )}
                                    {activeTab === 'Metricas' && (
                                      <div 
                                        id="metricas-panel"
                                        role="tabpanel"
                                        aria-labelledby="Metricas-tab"
                                        className="flex-1 overflow-y-auto p-4 space-y-6"
                                      >
                                        <div className="mb-4">
                                          <h4 className="text-lg font-bold text-gray-900 mb-1">Métricas del Programa</h4>
                                          <p className="text-xs text-gray-500">Datos numéricos y comparativas históricas</p>
                                        </div>
                  
                                        {/* Summary Cards (KPIs) */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Volumen Total</p>
                                            <h3 className="text-3xl font-bold text-indigo-600 mt-1">25.3K <span className="text-xl font-normal text-gray-500">kg</span></h3>
                                          </div>
                                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Tonelaje Estimado</p>
                                            <h3 className="text-3xl font-bold text-indigo-600 mt-1">18.7K <span className="text-xl font-normal text-gray-500">kg</span></h3>
                                          </div>
                                        </div>
                  
                                        {/* Comparativa con Mesociclos Anteriores */}
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Comparativa Mesociclos Anteriores</h5>
                                          <div className="space-y-4">
                                            {[
                                              { name: 'Mesociclo Base (Jul-Sep)', volume: '22K kg', tonnage: '16K kg', rpe: 7.2, progress: '+5%' },
                                              { name: 'Mesociclo Int. (Abr-Jun)', volume: '20K kg', tonnage: '14K kg', rpe: 6.8, progress: '+2%' },
                                              { name: 'Mesociclo Inicial (Ene-Mar)', volume: '18K kg', tonnage: '12K kg', rpe: 6.5, progress: '+0%' },
                                            ].map((meso, index) => (
                                              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                                <p className="text-sm font-medium text-gray-900">{meso.name}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                                                  <span>Volumen: <span className="font-semibold">{meso.volume}</span></span>
                                                  <span>Tonelaje: <span className="font-semibold">{meso.tonnage}</span></span>
                                                  <span>RPE Prom: <span className="font-semibold">{meso.rpe}</span></span>
                                                  <span className={`font-semibold ${meso.progress.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                    {meso.progress}
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                  
                                        {/* Other Metrics Section (Example) */}
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Adherencia al Objetivo</h5>
                                          <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex justify-between">
                                              <span>Frecuencia:</span>
                                              <span className="font-medium text-green-600">4x/sem ✅</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Intensidad:</span>
                                              <span className="font-medium text-green-600">RPE 7-8 ✅</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Cardio/HIIT:</span>
                                              <span className="font-medium text-green-600">2x/sem ✅</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Déficit Calórico:</span>
                                              <span className="font-medium text-yellow-600">No especificado ⚠️</span>
                                            </div>
                                          </div>
                                          <p className="text-sm font-bold text-gray-900 mt-4 text-center">Score de adherencia: <span className="text-green-600">85/100 ✅</span></p>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                        {/* Footer - For chat input or other fixed elements */}
                        {(!isDesktopCollapsed || isMobilePanelOpen) && activeTab === 'Chat' && ( // Only show chat input in Chat tab when panel is open
                          <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
                            <div className="mb-3 flex flex-wrap gap-2">
                              {suggestions.map((suggestion, index) => (
                                <SuggestionChip key={index} text={suggestion} onClick={() => handleSendMessage(suggestion)} />
                              ))}
                            </div>
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="Escribe tu pregunta o comando..."
                                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSendMessage();
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleSendMessage()}
                                className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <Send size={20} />
                              </button>
                            </div>
                          </div>
                        )}
                    </aside>
                  </>
  );
};


