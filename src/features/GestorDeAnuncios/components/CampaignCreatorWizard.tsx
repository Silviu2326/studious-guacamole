import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Target, Users, DollarSign, Image as ImageIcon } from 'lucide-react';
import { createCampaign, CampaignDetails } from '../api/campaigns';
import { Button } from '../../../components/componentsreutilizables';

interface CampaignCreatorWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: () => void;
}

interface CampaignFormData {
  name: string;
  platform: 'meta' | 'google';
  objective: string;
  location: string;
  ageMin: number;
  ageMax: number;
  gender: string[];
  interests: string[];
  dailyBudget: number;
  startDate: string;
  endDate: string;
  headline: string;
  description: string;
  imageUrl: string;
}

const objectives = [
  { value: 'Captar Leads', label: 'Captar Leads', desc: 'Conseguir que la gente rellene un formulario' },
  { value: 'Mensajes', label: 'Recibir Mensajes', desc: 'Que contacten contigo por mensajería' },
  { value: 'Promocionar Web', label: 'Promocionar Web', desc: 'Llevar tráfico a tu página web' }
];

const defaultInterests = ['Fitness y Bienestar', 'Gimnasios', 'Comida saludable', 'Levantamiento de pesas', 'Yoga'];

export const CampaignCreatorWizard: React.FC<CampaignCreatorWizardProps> = ({
  isOpen,
  onClose,
  onCampaignCreated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    platform: 'meta',
    objective: 'Captar Leads',
    location: '',
    ageMin: 25,
    ageMax: 45,
    gender: [],
    interests: ['Fitness y Bienestar', 'Gimnasios'],
    dailyBudget: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    headline: '',
    description: '',
    imageUrl: ''
  });

  const totalSteps = 5;

  const canAdvance = () => {
    switch (currentStep) {
      case 1:
        return formData.platform && formData.objective && formData.name;
      case 2:
        return formData.location && formData.interests.length > 0;
      case 3:
        return formData.dailyBudget > 0 && formData.startDate;
      case 4:
        return formData.headline && formData.description && formData.imageUrl;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canAdvance() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canAdvance()) return;

    setIsSubmitting(true);
    try {
      await createCampaign(formData);
      onCampaignCreated();
      resetForm();
    } catch (error: any) {
      alert('Error al crear la campaña: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      platform: 'meta',
      objective: 'Captar Leads',
      location: '',
      ageMin: 25,
      ageMax: 45,
      gender: [],
      interests: ['Fitness y Bienestar', 'Gimnasios'],
      dailyBudget: 10,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      headline: '',
      description: '',
      imageUrl: ''
    });
  };

  const handleClose = () => {
    if (window.confirm('¿Seguro que quieres cerrar? Se perderán los datos no guardados.')) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleGender = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      gender: prev.gender.includes(gender)
        ? prev.gender.filter(g => g !== gender)
        : [...prev.gender, gender]
    }));
  };

  const estimatedTotal = formData.dailyBudget * 
    (formData.endDate ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Campaña</h2>
            <p className="text-sm text-gray-600 mt-1">Paso {currentStep} de {totalSteps}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <React.Fragment key={i}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  i + 1 < currentStep ? 'bg-green-100 text-green-600' :
                  i + 1 === currentStep ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {i + 1 < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`flex-1 h-1 ${
                    i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Paso 1: Objetivo y Plataforma */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Nombre de la Campaña
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Campaña Leads Locales - Enero"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Plataforma
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, platform: 'meta' }))}
                    className={`p-6 border-2 rounded-lg text-left transition ${
                      formData.platform === 'meta'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">f</span>
                      </div>
                      <span className="font-semibold">Meta (Facebook/Instagram)</span>
                    </div>
                    <p className="text-sm text-gray-600">Ideal para targeting local y engagement</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, platform: 'google' }))}
                    className={`p-6 border-2 rounded-lg text-left transition ${
                      formData.platform === 'google'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">G</span>
                      </div>
                      <span className="font-semibold">Google Ads</span>
                    </div>
                    <p className="text-sm text-gray-600">Mejor para búsquedas activas</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  ¿Qué quieres conseguir?
                </label>
                <div className="space-y-3">
                  {objectives.map((obj) => (
                    <button
                      key={obj.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, objective: obj.value }))}
                      className={`w-full p-4 border-2 rounded-lg text-left transition flex items-start gap-3 ${
                        formData.objective === obj.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">{obj.label}</div>
                        <div className="text-sm text-gray-600">{obj.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Audiencia */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ej: Madrid, España"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Edad mínima
                  </label>
                  <input
                    type="number"
                    value={formData.ageMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, ageMin: parseInt(e.target.value) }))}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Edad máxima
                  </label>
                  <input
                    type="number"
                    value={formData.ageMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, ageMax: parseInt(e.target.value) }))}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Género (opcional)
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => toggleGender('women')}
                    className={`px-4 py-2 border-2 rounded-lg transition ${
                      formData.gender.includes('women')
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Mujeres
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleGender('men')}
                    className={`px-4 py-2 border-2 rounded-lg transition ${
                      formData.gender.includes('men')
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Hombres
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Intereses
                </label>
                <div className="flex flex-wrap gap-2">
                  {defaultInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-2 border rounded-lg text-sm transition ${
                        formData.interests.includes(interest)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Presupuesto y Duración */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Presupuesto Diario (€)
                </label>
                <input
                  type="number"
                  value={formData.dailyBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyBudget: parseFloat(e.target.value) }))}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Recomendamos mínimo 10€/día para mejores resultados
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                  />
                </div>
              </div>

              {formData.endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Presupuesto Estimado</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">€{estimatedTotal.toFixed(2)}</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {formData.endDate ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 1} días × €{formData.dailyBudget}/día
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paso 4: Anuncio */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Título del Anuncio
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="Ej: Transforma tu cuerpo en 12 semanas"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Ej: Únete a nuestro programa personalizado y logra resultados reales. Tu primera consulta es gratis."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-4 pr-3 py-2.5"
                />
                {formData.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        alert('Error al cargar la imagen. Verifica la URL.');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paso 5: Resumen */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-green-900">Resumen de tu Campaña</span>
                </div>
                <p className="text-sm text-green-700">
                  Revisa los detalles antes de lanzar
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Información General</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Nombre:</span> {formData.name}</p>
                    <p><span className="font-medium">Plataforma:</span> {formData.platform === 'meta' ? 'Meta (Facebook/Instagram)' : 'Google Ads'}</p>
                    <p><span className="font-medium">Objetivo:</span> {formData.objective}</p>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Audiencia</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Ubicación:</span> {formData.location}</p>
                    <p><span className="font-medium">Edad:</span> {formData.ageMin} - {formData.ageMax} años</p>
                    {formData.gender.length > 0 && (
                      <p><span className="font-medium">Género:</span> {formData.gender.join(', ')}</p>
                    )}
                    <p><span className="font-medium">Intereses:</span> {formData.interests.join(', ')}</p>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Presupuesto</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Presupuesto diario:</span> €{formData.dailyBudget}</p>
                    <p><span className="font-medium">Duración:</span> {formData.startDate} - {formData.endDate || 'Sin fecha de fin'}</p>
                    <p><span className="font-medium">Total estimado:</span> €{estimatedTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Anuncio</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Título:</span> {formData.headline}</p>
                    <p><span className="font-medium">Descripción:</span> {formData.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="ghost"
            leftIcon={<ChevronLeft size={20} />}
          >
            Atrás
          </Button>
          <div className="text-sm text-gray-600">
            Paso {currentStep} de {totalSteps}
          </div>
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canAdvance()}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canAdvance() || isSubmitting}
              variant="primary"
            >
              {isSubmitting ? 'Creando...' : 'Lanzar Campaña'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

