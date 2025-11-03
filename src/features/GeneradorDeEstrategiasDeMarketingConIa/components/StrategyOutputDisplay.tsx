import React from 'react';
import { StrategyOutput, ContentPlanWeek, CampaignElement } from '../api/strategies';
import { Calendar, CheckCircle2, Users, FileText, Lightbulb, Loader2 } from 'lucide-react';

interface StrategyOutputDisplayProps {
  strategyData: StrategyOutput;
  isLoading?: boolean;
}

/**
 * Muestra la estrategia generada por la IA de una manera estructurada y legible.
 */
export const StrategyOutputDisplay: React.FC<StrategyOutputDisplayProps> = ({
  strategyData,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Resumen de la Estrategia</h3>
        <p className="text-gray-700 leading-relaxed">{strategyData.summary}</p>
      </div>

      {/* Plan de Contenido */}
      {strategyData.contentPlan && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Plan de Contenido</h3>
          </div>
          
          <div className="space-y-6">
            {strategyData.contentPlan.weeks.map((week: ContentPlanWeek) => (
              <div key={week.weekNumber} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Semana {week.weekNumber} {week.theme && `- ${week.theme}`}
                </h4>
                <div className="space-y-3">
                  {week.days.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{day.day}</span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                          {day.format}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{day.topic}</p>
                      {day.description && (
                        <p className="text-sm text-gray-600 mb-2">{day.description}</p>
                      )}
                      {day.copy && (
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-700 italic">"{day.copy}"</p>
                        </div>
                      )}
                      {day.hashtags && day.hashtags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {day.hashtags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaña */}
      {strategyData.campaign && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              {strategyData.campaign.name}
            </h3>
            <span className="ml-auto text-sm text-gray-600">
              Timeline: {strategyData.campaign.timeline}
            </span>
          </div>
          
          <div className="space-y-4">
            {strategyData.campaign.elements.map((element: CampaignElement, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">{element.title}</h4>
                  <span className="ml-auto px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded capitalize">
                    {element.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {element.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estrategias de Retención */}
      {strategyData.retentionStrategies && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Estrategias de Retención</h3>
          </div>
          
          <div className="space-y-4">
            {strategyData.retentionStrategies.map((strategy, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{strategy.title}</h4>
                <p className="text-gray-700 mb-3">{strategy.description}</p>
                <ul className="space-y-2">
                  {strategy.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ideas de Colaboración */}
      {strategyData.collaborationIdeas && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Ideas de Colaboración</h3>
          </div>
          
          <div className="space-y-4">
            {strategyData.collaborationIdeas.map((idea, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Colaboración con {idea.partner}
                </h4>
                <p className="text-gray-700 mb-3">{idea.idea}</p>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Beneficios:</p>
                  <ul className="space-y-1">
                    {idea.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {strategyData.recommendations && strategyData.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
          <ul className="space-y-2">
            {strategyData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Próximos Pasos */}
      {strategyData.nextSteps && strategyData.nextSteps.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Pasos</h3>
          <ul className="space-y-2">
            {strategyData.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


