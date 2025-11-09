---
title: Integraciones entre los módulos Ventas & Leads y Clientes 360
---

# Estrategias para conectar @VentasYLeads con @Clientes360

## 1. Flujo de alta automatizado
- **Descripción:** Cuando un lead se convierte en cliente en @VentasYLeads, se genera automáticamente su ficha en @Clientes360.
- **Implementación sugerida:** webhook o evento interno `leadConverted` que dispare la creación de `ClientProfile` con los campos clave (plan contratado, origen de lead, vendedor responsable).
- **Beneficio:** Evita duplicación de datos y asegura que ventas y operaciones trabajen sobre la misma información desde el primer día.

## 2. Sincronización de estado y pipeline
- **Descripción:** Los cambios de etapa en el pipeline de @VentasYLeads (negociación, cerrado, perdido) se reflejan en los estados de cliente dentro de @Clientes360.
- **Implementación sugerida:** mapear estados y actualizar `ClientStatus` mediante un job diario o eventos en tiempo real.
- **Beneficio:** Permite al equipo de customer success priorizar onboarding o retención con base en la evolución comercial.

## 3. Segmentos compartidos
- **Descripción:** Reutilizar segmentos creados en @VentasYLeads (ej. leads de campañas específicas) como listas dinámicas en @Clientes360.
- **Implementación sugerida:** endpoint compartido `POST /segments/share` que sincronice los criterios y etiquetas.
- **Beneficio:** Alinea las campañas de captación con las acciones de engagement y retención posteriores.

## 4. Enriquecimiento de datos en la ficha 360
- **Descripción:** Mostrar en la ficha del cliente los datos comerciales históricos: interacciones de ventas, productos ofrecidos, objeciones.
- **Implementación sugerida:** panel embebido que consuma `SalesActivity` desde @VentasYLeads y lo renderice como timeline adicional.
- **Beneficio:** Ofrece al equipo de atención contexto completo antes de contactar al cliente.

## 5. Alertas cruzadas
- **Descripción:** Generar alertas en @VentasYLeads cuando @Clientes360 detecta riesgo alto o baja satisfacción, y viceversa.
- **Implementación sugerida:** sistema de notificaciones central que acepte triggers desde ambos módulos y los rote al equipo responsable.
- **Beneficio:** Activa oportunidades de upsell o rescate a partir de señales operativas y comerciales combinadas.

## 6. Panel unificado de performance
- **Descripción:** Dashboard que combine KPIs de adquisición (conversiones, costo de lead) con métricas de retención (MRR, churn) en una sola vista.
- **Implementación sugerida:** vista compartida en Analytics que consuma datasets de ambos módulos y permita filtrado por campaña o segmento.
- **Beneficio:** Facilita decisiones estratégicas basadas en todo el ciclo de vida del cliente.

## 7. Integración de campañas
- **Descripción:** Lanzar campañas desde @VentasYLeads usando segmentos enriquecidos con datos de uso y satisfacción desde @Clientes360.
- **Implementación sugerida:** sincronizar atributos como riesgo, NPS y valor de vida en el almacén de leads para poder segmentar campañas.
- **Beneficio:** Mejora la personalización y efectividad de las campañas de reconversión o upsell.

## 8. Handoff estructurado
- **Descripción:** Checklist automático que guía al equipo cuando un lead pasa a cliente, asegurando que @Clientes360 reciba toda la info necesaria.
- **Implementación sugerida:** workflow con pasos obligatorios (documentación, preferencias, objetivos) antes de marcar el trato como ganado.
- **Beneficio:** Reduce errores en la transición de ventas a operaciones y acelera el onboarding.

## 9. Scoring conjunto
- **Descripción:** Combinar lead scoring de @VentasYLeads con un health score de @Clientes360 para priorizar acciones comerciales.
- **Implementación sugerida:** modelo que mezcle atributos de venta (engagement, interés) con operativos (asistencia, riesgo) y exponga el score en ambos módulos.
- **Beneficio:** Permite detectar clientes listos para un upgrade o leads que requieren intervención urgente.

## 10. Automatización de reactivación
- **Descripción:** Cuando un cliente cae en baja en @Clientes360, reingresa automáticamente como lead caliente en @VentasYLeads con contexto de offboarding.
- **Implementación sugerida:** trigger `clientChurned` que crea/actualiza el registro en el pipeline con notas de motivos de baja y ofertas sugeridas.
- **Beneficio:** Cierra el loop de gestión y aumenta la tasa de recuperación de clientes perdidos.


