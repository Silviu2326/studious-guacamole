// US-18: Calculadora rápida de precios

import React, { useState } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { Sale, ServiceType, SERVICE_LABELS } from '../types';
import { Calculator, Copy, Send, Percent } from 'lucide-react';

interface PriceCalculatorModalProps {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onSendPrice: (price: number, message: string) => void;
}

interface PriceConfig {
  sessionsPerMonth?: number;
  pricePerSession?: number;
  nutritionPlan?: boolean;
  consultations?: number;
  discount?: number;
}

export const PriceCalculatorModal: React.FC<PriceCalculatorModalProps> = ({
  sale,
  isOpen,
  onClose,
  onSendPrice,
}) => {
  const [serviceType, setServiceType] = useState<ServiceType>(sale.serviceType || '1-1');
  const [config, setConfig] = useState<PriceConfig>({
    sessionsPerMonth: 4,
    pricePerSession: 60,
    nutritionPlan: false,
    consultations: 0,
    discount: 0,
  });

  const calculatePrice = (): number => {
    let basePrice = 0;

    switch (serviceType) {
      case '1-1':
        basePrice = (config.sessionsPerMonth || 0) * (config.pricePerSession || 0);
        break;
      case 'online':
        basePrice = 30 + (config.consultations || 0) * 15;
        break;
      case 'nutricion':
        basePrice = 50 + (config.consultations || 0) * 25;
        break;
      case 'combo':
        basePrice = ((config.sessionsPerMonth || 0) * (config.pricePerSession || 0)) + 50;
        if (config.nutritionPlan) basePrice += 30;
        basePrice = Math.round(basePrice * 0.8); // 20% descuento combo
        break;
      case 'grupal':
        basePrice = (config.sessionsPerMonth || 0) * 12;
        break;
    }

    if (config.discount && config.discount > 0) {
      basePrice = basePrice * (1 - config.discount / 100);
    }

    return Math.round(basePrice);
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('es-ES')}€`;
  };

  const getPriceMessage = (): string => {
    const price = calculatePrice();
    const serviceName = SERVICE_LABELS[serviceType];
    let message = `Hola ${sale.leadName.split(' ')[0]},\n\n`;
    message += `Te envío el precio para el servicio de ${serviceName}:\n\n`;
    
    switch (serviceType) {
      case '1-1':
        message += `📋 ${config.sessionsPerMonth} sesiones/mes\n`;
        message += `💶 Precio: ${formatPrice(price)}/mes\n`;
        break;
      case 'online':
        message += `📱 Plan Online\n`;
        if (config.consultations) {
          message += `Incluye ${config.consultations} consultas/mes\n`;
        }
        message += `💶 Precio: ${formatPrice(price)}/mes\n`;
        break;
      case 'nutricion':
        message += `🥗 Plan de Nutrición\n`;
        if (config.consultations) {
          message += `Incluye ${config.consultations} consultas/mes\n`;
        }
        message += `💶 Precio: ${formatPrice(price)}/mes\n`;
        break;
      case 'combo':
        message += `🔥 Combo Entrenamiento + Nutrición\n`;
        message += `📋 ${config.sessionsPerMonth} sesiones/mes\n`;
        if (config.nutritionPlan) {
          message += `🥗 Plan nutricional incluido\n`;
        }
        message += `💶 Precio: ${formatPrice(price)}/mes\n`;
        break;
      case 'grupal':
        message += `👥 Clases Grupales\n`;
        message += `📋 ${config.sessionsPerMonth} clases/mes\n`;
        message += `💶 Precio: ${formatPrice(price)}/mes\n`;
        break;
    }

    if (config.discount && config.discount > 0) {
      message += `\n🎉 Descuento aplicado: ${config.discount}%\n`;
    }

    message += `\n¿Te gustaría agendar una llamada para conocer más detalles?`;
    
    return message;
  };

  const handleCopy = () => {
    const message = getPriceMessage();
    navigator.clipboard.writeText(message);
    alert('Precio copiado al portapapeles');
  };

  const handleSend = () => {
    const price = calculatePrice();
    const message = getPriceMessage();
    onSendPrice(price, message);
    onClose();
  };

  if (!isOpen) return null;

  const finalPrice = calculatePrice();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calculadora de Precios"
      size="lg"
    >
      <div className="space-y-6">
        {/* Selector de servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Servicio
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(SERVICE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Configuración según servicio */}
        <div className="space-y-4">
          {(serviceType === '1-1' || serviceType === 'combo' || serviceType === 'grupal') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sesiones/Clases por mes
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={config.sessionsPerMonth || ''}
                onChange={(e) => setConfig({ ...config, sessionsPerMonth: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {(serviceType === '1-1' || serviceType === 'combo') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio por sesión (€)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={config.pricePerSession || ''}
                onChange={(e) => setConfig({ ...config, pricePerSession: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {(serviceType === 'online' || serviceType === 'nutricion') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultas adicionales por mes
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={config.consultations || ''}
                onChange={(e) => setConfig({ ...config, consultations: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {serviceType === 'combo' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="nutritionPlan"
                checked={config.nutritionPlan || false}
                onChange={(e) => setConfig({ ...config, nutritionPlan: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="nutritionPlan" className="text-sm font-medium text-gray-700">
                Incluir plan nutricional premium
              </label>
            </div>
          )}

          {/* Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Descuento (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={config.discount || ''}
              onChange={(e) => setConfig({ ...config, discount: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {config.discount && config.discount > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Ahorro: {formatPrice(calculatePrice() / (1 - config.discount / 100) - calculatePrice())}
              </p>
            )}
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Precio mensual</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {formatPrice(finalPrice)}
              </p>
              {config.discount && config.discount > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Con {config.discount}% de descuento aplicado
                </p>
              )}
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Vista previa del mensaje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista previa del mensaje
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {getPriceMessage()}
            </pre>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={handleCopy}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            Copiar precio
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Enviar al lead
          </Button>
        </div>
      </div>
    </Modal>
  );
};

