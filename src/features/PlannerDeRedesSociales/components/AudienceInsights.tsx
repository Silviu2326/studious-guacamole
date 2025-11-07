import React from 'react';
import { AudienceInsight } from '../api/social';
import { Card } from '../../../components/componentsreutilizables';
import { Users, TrendingUp, MapPin, Clock, Heart, Calendar } from 'lucide-react';

interface AudienceInsightsProps {
  insights: AudienceInsight;
}

export const AudienceInsights: React.FC<AudienceInsightsProps> = ({ insights }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Insights de Audiencia</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demografía */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-blue-600" />
            <h4 className="font-semibold text-gray-900">Demografía</h4>
          </div>

          {/* Grupos de edad */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Grupos de Edad</p>
            <div className="space-y-2">
              {insights.demographics.ageGroups.map((group, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{group.range} años</span>
                    <span className="text-sm font-semibold text-gray-900">{group.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Género */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Género</p>
            <div className="space-y-2">
              {insights.demographics.gender.map((g, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{g.type}</span>
                    <span className="text-sm font-semibold text-gray-900">{g.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${g.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicaciones */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Ubicaciones Principales</p>
            <div className="space-y-2">
              {insights.demographics.locations.map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{loc.city}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{loc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Comportamiento */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-green-600" />
            <h4 className="font-semibold text-gray-900">Comportamiento</h4>
          </div>

          {/* Horarios activos */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Horarios Más Activos</p>
            <div className="space-y-2">
              {insights.behavior.activeHours.map((hour, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{hour.hour}:00</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${(hour.engagement / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{hour.engagement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contenido preferido */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Contenido Preferido</p>
            <div className="space-y-2">
              {insights.behavior.preferredContent.map((content, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{content.category}</span>
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="text-red-400" />
                    <span className="text-sm font-semibold text-gray-900">{content.engagement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mejores días */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Mejores Días</p>
            <div className="space-y-2">
              {insights.behavior.bestDays.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{day.day}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{day.engagement}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Crecimiento */}
        <Card className="p-6 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-purple-600" />
            <h4 className="font-semibold text-gray-900">Crecimiento de Seguidores</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{insights.growth.newFollowers}</p>
              <p className="text-sm text-gray-600 mt-1">Nuevos Seguidores</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className="text-2xl font-bold text-red-600">{insights.growth.unfollowers}</p>
              <p className="text-sm text-gray-600 mt-1">Dejaron de Seguir</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">+{insights.growth.netGrowth}</p>
              <p className="text-sm text-gray-600 mt-1">Crecimiento Neto</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">{insights.growth.growthRate}</p>
              <p className="text-sm text-gray-600 mt-1">Tasa de Crecimiento</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

