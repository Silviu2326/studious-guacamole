import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, BarChart2, AlertTriangle, TrendingUp, Send, Bot, Info, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { useUIContext } from '../context/UIContext';
import { useProgramContext } from '../context/ProgramContext';
import { useFitCoach, ActionCardData } from '../hooks/useFitCoach';
import { useValidation } from '../hooks/useValidation';
import { InsightsPanel } from './panels/InsightsPanel';
import { ClientProgressPanel } from './panels/ClientProgressPanel';
import { FatigueChart } from './visualizations/FatigueChart';

export const FitCoachPanel: React.FC = () => {
  const { isFitCoachOpen, fitCoachActiveTab, setFitCoachActiveTab } = useUIContext();
  const { program } = useProgramContext();
  const { messages, alerts: fitCoachAlerts, isTyping, sendMessage, dismissAlert, setAlerts } = useFitCoach();
  const { alerts: validationAlerts } = useValidation();

  const allAlerts = [
    ...validationAlerts.map(va => ({
      id: va.id,
      level: va.severity === 'suggestion' ? 'info' : va.severity as 'critical' | 'warning' | 'info',
      title: va.title,
      message: va.message,
      action: va.actionLabel ? { label: va.actionLabel, handler: () => console.log('Action:', va.actionType) } : undefined,
      isValidation: true
    })),
    ...fitCoachAlerts
  ];

  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(fitCoachActiveTab || 'Chat');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resizing Logic
  const sidebarRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
          const rect = sidebarRef.current.getBoundingClientRect();
          // Calculate width from the right edge (Right Anchor)
          const newWidth = rect.right - mouseMoveEvent.clientX;
          if (newWidth > 300 && newWidth < 800) {
              setWidth(newWidth);
          }
      }
  }, [isResizing]);

  useEffect(() => {
      if (isResizing) {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
      }
      return () => {
          window.removeEventListener("mousemove", resize);
          window.removeEventListener("mouseup", stopResizing);
      };
  }, [isResizing, resize, stopResizing]);

  const weeks = program?.weeks || [];

  useEffect(() => {
    if (isFitCoachOpen) {
      if (window.innerWidth < 768) {
        setIsMobilePanelOpen(true);
      }
    } else {
      setIsMobilePanelOpen(false);
    }
  }, [isFitCoachOpen]);

  useEffect(() => {
    setActiveTab(fitCoachActiveTab || 'Chat');
  }, [fitCoachActiveTab]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string = inputMessage) => {
    if (!text.trim()) return;
    sendMessage(text);
    setInputMessage('');
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

  const ActionCard: React.FC<ActionCardData> = ({ title, description, actions }) => (
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
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${action.type === 'primary' || (!action.type && idx === 0)
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
    { id: 'Progreso', label: 'Progreso', icon: TrendingUp },
    { id: 'Alertas', label: 'Alertas', icon: AlertTriangle, count: allAlerts.length },
    { id: 'Metricas', label: 'Métricas', icon: Activity },
  ];

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
      ref={sidebarRef}
      id="tour-fitcoach-panel"
      role="region"
      aria-label="FitCoach Panel"
      className={`
        fixed inset-y-0 right-0 z-50 w-full // Base width for drawer
        ${(!isFitCoachOpen && !isMobilePanelOpen) ? 'hidden' : 'flex'} flex-col h-full bg-white border-l border-gray-200 shadow-lg // Common styles
        transform transition-transform duration-300 ease-in-out
        ${isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full'} // Slide-in/out for mobile/tablet
        md:relative md:translate-x-0 md:shadow-none // Desktop overrides for positioning
        ${isDesktopCollapsed ? 'md:w-12' : ''} // Desktop collapse/expand
        group
      `}
      style={!isDesktopCollapsed && !isMobilePanelOpen ? { width: `${width}px` } : {}}
    >
      {/* Resize Handle (Left Edge) */}
      {!isDesktopCollapsed && (
         <div
            className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-indigo-400 z-50 transition-colors opacity-0 group-hover:opacity-100"
            onMouseDown={startResizing}
         />
      )}

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
      <div role="tablist" aria-label="FitCoach Tabs" className={`flex-shrink-0 ${isDesktopCollapsed ? 'flex flex-col' : 'grid grid-cols-5 gap-0.5 p-1'} border-b border-gray-200`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setFitCoachActiveTab(tab.id);
                // On desktop, expand if collapsed; on mobile, ensure drawer is open
                if (isDesktopCollapsed) setIsDesktopCollapsed(false);
                if (!isMobilePanelOpen) setIsMobilePanelOpen(true); // Open drawer on mobile/tablet if not already open
              }}
              className={`
                      ${isDesktopCollapsed ? 'py-4 flex flex-col items-center w-full' : 'flex flex-col items-center justify-center py-2 px-1 rounded'}
                      text-xs font-medium transition-all duration-200 ease-in-out relative
                      ${activeTab === tab.id
                  ? 'text-indigo-700 bg-indigo-50' // Active tab style
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                    `}
              title={tab.label}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id.toLowerCase()}-panel`}
            >
              <div className="relative mb-0.5">
                <Icon size={isDesktopCollapsed ? 24 : 16} />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </div>
              {!isDesktopCollapsed && <span className="truncate w-full text-center">{tab.label}</span>}
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
                className="flex-1 overflow-y-auto p-4"
              >
                <InsightsPanel />

                {/* Re-adding FatigueChart here as it was part of Insights but not strictly the Radar Chart */}
                <div className="mt-6">
                  <FatigueChart weeks={weeks} />
                </div>
              </div>
            )}

            {activeTab === 'Progreso' && (
               <div
                  id="progreso-panel"
                  role="tabpanel"
                  aria-labelledby="Progreso-tab"
                  className="flex-1 flex flex-col overflow-hidden"
               >
                  <ClientProgressPanel />
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
                  {fitCoachAlerts.length > 0 && (
                    <button
                      onClick={() => setAlerts([])}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Limpiar sugerencias
                    </button>
                  )}
                </div>

                {allAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                    <h5 className="text-sm font-medium text-gray-900">Todo se ve bien</h5>
                    <p className="text-xs text-gray-500 mt-1">No se han detectado problemas en tu programa.</p>
                  </div>
                ) : (
                  allAlerts.map((alert) => {
                    const styles = getAlertStyle(alert.level);
                    const AlertIcon = styles.icon;
                    // Check if it's a validation alert to disable dismiss
                    const isValidation = (alert as any).isValidation;

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
                              {!isValidation && (
                                <button
                                  onClick={() => dismissAlert(alert.id)}
                                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                  Ignorar
                                </button>
                              )}
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