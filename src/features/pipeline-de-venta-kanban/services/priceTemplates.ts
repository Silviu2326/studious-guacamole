// US-17: Plantillas de precios por tipo de servicio

import { ServiceType, SERVICE_LABELS } from '../types';

export interface PriceTemplate {
  id: string;
  serviceType: ServiceType;
  title: string;
  content: string;
  basePrice: number;
  variables: {
    name: string;
    description: string;
    default: string | number;
  }[];
}

const PRICE_TEMPLATES: PriceTemplate[] = [
  {
    id: 'template-1-1',
    serviceType: '1-1',
    title: 'Entrenamiento Personal 1:1',
    basePrice: 60,
    content: `Hola {{leadName}},

Te envío la información sobre nuestros planes de entrenamiento personal 1:1:

📋 **PLAN BÁSICO** ({{sessions}} sesiones/mes)
- Sesiones individuales personalizadas
- Plan de entrenamiento adaptado a tus objetivos
- Seguimiento y ajustes mensuales
- Acceso a app de entrenamiento

💶 **Precio: {{price}}€/mes**

📋 **PLAN PREMIUM** ({{sessionsPremium}} sesiones/mes)
- Todo lo del plan básico
- Análisis de composición corporal mensual
- Consultas de nutrición básica

💶 **Precio: {{pricePremium}}€/mes**

¿Te gustaría agendar una llamada para conocer más sobre nuestros servicios?

¡Un saludo!
{{trainerName}}`,
    variables: [
      { name: 'leadName', description: 'Nombre del lead', default: '' },
      { name: 'sessions', description: 'Sesiones/mes básico', default: 4 },
      { name: 'price', description: 'Precio básico', default: 240 },
      { name: 'sessionsPremium', description: 'Sesiones/mes premium', default: 8 },
      { name: 'pricePremium', description: 'Precio premium', default: 480 },
      { name: 'trainerName', description: 'Tu nombre', default: 'Entrenador' },
    ],
  },
  {
    id: 'template-online',
    serviceType: 'online',
    title: 'Plan de Entrenamiento Online',
    basePrice: 30,
    content: `Hola {{leadName}},

Te envío información sobre nuestro Plan de Entrenamiento Online:

📱 **PLAN ONLINE BÁSICO**
- Plan de entrenamiento personalizado
- Videos con ejercicios explicados
- Seguimiento semanal vía app
- Ajustes según tu progreso
- Acceso a comunidad privada

💶 **Precio: {{price}}€/mes**

📱 **PLAN ONLINE PREMIUM**
- Todo lo del plan básico
- Consultas de videollamada mensuales
- Plan nutricional personalizado
- Análisis de progreso detallado

💶 **Precio: {{pricePremium}}€/mes**

¿Te interesa conocer más detalles?

¡Un saludo!
{{trainerName}}`,
    variables: [
      { name: 'leadName', description: 'Nombre del lead', default: '' },
      { name: 'price', description: 'Precio básico', default: 30 },
      { name: 'pricePremium', description: 'Precio premium', default: 59 },
      { name: 'trainerName', description: 'Tu nombre', default: 'Entrenador' },
    ],
  },
  {
    id: 'template-nutricion',
    serviceType: 'nutricion',
    title: 'Plan de Nutrición',
    basePrice: 50,
    content: `Hola {{leadName}},

Te envío información sobre nuestros planes de nutrición:

🥗 **PLAN NUTRICIÓN BÁSICO**
- Plan nutricional personalizado
- Análisis de composición corporal inicial
- Revisión mensual y ajustes
- Recetas y menús semanales
- Seguimiento vía app

💶 **Precio: {{price}}€/mes**

🥗 **PLAN NUTRICIÓN PREMIUM**
- Todo lo del plan básico
- Consultas nutricionales semanales
- Plan de suplementación
- Análisis de progreso detallado

💶 **Precio: {{pricePremium}}€/mes**

¿Te gustaría agendar una consulta inicial?

¡Un saludo!
{{trainerName}}`,
    variables: [
      { name: 'leadName', description: 'Nombre del lead', default: '' },
      { name: 'price', description: 'Precio básico', default: 50 },
      { name: 'pricePremium', description: 'Precio premium', default: 99 },
      { name: 'trainerName', description: 'Tu nombre', default: 'Entrenador' },
    ],
  },
  {
    id: 'template-combo',
    serviceType: 'combo',
    title: 'Combo Entrenamiento + Nutrición',
    basePrice: 80,
    content: `Hola {{leadName}},

Te envío información sobre nuestro COMBO Entrenamiento + Nutrición:

🔥 **COMBO BÁSICO**
- {{sessions}} sesiones de entrenamiento personal/mes
- Plan nutricional personalizado
- Seguimiento y ajustes mensuales
- Acceso a app completa

💶 **Precio: {{price}}€/mes** (Ahorra 20% vs contratar por separado)

🔥 **COMBO PREMIUM**
- {{sessionsPremium}} sesiones de entrenamiento personal/mes
- Plan nutricional premium
- Consultas semanales
- Análisis de composición corporal mensual
- Plan de suplementación

💶 **Precio: {{pricePremium}}€/mes** (Ahorra 25% vs contratar por separado)

¿Te gustaría agendar una llamada para conocer más?

¡Un saludo!
{{trainerName}}`,
    variables: [
      { name: 'leadName', description: 'Nombre del lead', default: '' },
      { name: 'sessions', description: 'Sesiones/mes básico', default: 4 },
      { name: 'price', description: 'Precio combo básico', default: 280 },
      { name: 'sessionsPremium', description: 'Sesiones/mes premium', default: 8 },
      { name: 'pricePremium', description: 'Precio combo premium', default: 550 },
      { name: 'trainerName', description: 'Tu nombre', default: 'Entrenador' },
    ],
  },
  {
    id: 'template-grupal',
    serviceType: 'grupal',
    title: 'Clases Grupales',
    basePrice: 25,
    content: `Hola {{leadName}},

Te envío información sobre nuestras clases grupales:

👥 **CLASES GRUPALES**
- Clases de alta intensidad (HIIT)
- Grupos reducidos (máx. 8 personas)
- Variedad de horarios
- Ambiente motivador y divertido

💶 **Precio: {{price}}€/mes** ({{sessions}} clases/mes)

💶 **Precio por clase: {{pricePerClass}}€** (pack de 10 clases)

¿Te gustaría probar una clase gratuita?

¡Un saludo!
{{trainerName}}`,
    variables: [
      { name: 'leadName', description: 'Nombre del lead', default: '' },
      { name: 'sessions', description: 'Clases/mes', default: 8 },
      { name: 'price', description: 'Precio mensual', default: 25 },
      { name: 'pricePerClass', description: 'Precio por clase', default: 12 },
      { name: 'trainerName', description: 'Tu nombre', default: 'Entrenador' },
    ],
  },
];

export class PriceTemplateService {
  static getTemplates(): PriceTemplate[] {
    return PRICE_TEMPLATES;
  }

  static getTemplateByServiceType(serviceType: ServiceType): PriceTemplate | undefined {
    return PRICE_TEMPLATES.find(t => t.serviceType === serviceType);
  }

  static getTemplate(id: string): PriceTemplate | undefined {
    return PRICE_TEMPLATES.find(t => t.id === id);
  }

  static replaceVariables(template: PriceTemplate, variables: Record<string, string | number>): string {
    let content = template.content;
    template.variables.forEach(variable => {
      const value = variables[variable.name] !== undefined 
        ? variables[variable.name] 
        : variable.default;
      content = content.replace(new RegExp(`{{${variable.name}}}`, 'g'), String(value));
    });
    return content;
  }
}

