import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { PostCard } from './PostCard';
import { getTestimonialSummary, getReferralSummary, TestimonialSummary, ReferralSummary } from '../api/community';
import { Quote, UserPlus, TrendingUp, Calendar } from 'lucide-react';

/**
 * Panel de resumen de Testimonios y Referidos
 * 
 * Muestra:
 * - Número de nuevos testimonios en la última semana/30 días
 * - Número de posts de referidos en el mismo periodo
 * - Lista corta (3-5) de testimonios destacados
 */
export const TestimonialsAndReferralsPanel: React.FC = () => {
  const [testimonialSummary, setTestimonialSummary] = useState<TestimonialSummary | null>(null);
  const [referralSummary, setReferralSummary] = useState<ReferralSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      setLoading(true);
      const [testimonials, referrals] = await Promise.all([
        getTestimonialSummary(),
        getReferralSummary()
      ]);
      setTestimonialSummary(testimonials);
      setReferralSummary(referrals);
    } catch (error) {
      console.error('Error al cargar resúmenes de testimonios y referidos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="text-center text-gray-600 py-8">Cargando resúmenes...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Actividad de Testimonios y Referidos
        </h3>
        <p className="text-sm text-gray-600">
          Resumen de la actividad reciente de testimonios y referidos en la comunidad
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Testimonios */}
        <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Quote size={20} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Testimonios</h4>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Última semana</span>
              </div>
              <span className="text-lg font-bold text-purple-700">
                {testimonialSummary?.totalLastWeek || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp size={16} />
                <span>Últimos 30 días</span>
              </div>
              <span className="text-lg font-bold text-purple-700">
                {testimonialSummary?.totalLast30Days || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Referidos */}
        <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus size={20} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Referidos</h4>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Última semana</span>
              </div>
              <span className="text-lg font-bold text-green-700">
                {referralSummary?.totalLastWeek || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp size={16} />
                <span>Últimos 30 días</span>
              </div>
              <span className="text-lg font-bold text-green-700">
                {referralSummary?.totalLast30Days || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios Destacados */}
      {testimonialSummary && testimonialSummary.featured.length > 0 && (
        <div className="mt-6">
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Quote size={18} className="text-purple-600" />
            Testimonios Destacados
          </h4>
          <div className="space-y-3">
            {testimonialSummary.featured.slice(0, 5).map((testimonial) => (
              <div key={testimonial.id} className="transform transition-all hover:scale-[1.01]">
                <PostCard 
                  post={testimonial}
                  onReact={() => {}}
                  onComment={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {(!testimonialSummary || testimonialSummary.featured.length === 0) && 
       (!referralSummary || referralSummary.featured.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Quote size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Aún no hay testimonios o referidos en la comunidad</p>
        </div>
      )}
    </Card>
  );
};

export default TestimonialsAndReferralsPanel;

