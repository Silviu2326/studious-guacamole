import React from 'react';
import { Building2, Award, MapPin, Phone, Users, Target } from 'lucide-react';
import { Card, Input, Textarea } from '../../../components/componentsreutilizables';
import { GeneralProfileFormData, ProfileType } from '../types';

interface BusinessProfileCardProps {
  formData: GeneralProfileFormData;
  onFieldChange: (fieldName: keyof GeneralProfileFormData, value: any) => void;
  profileType: ProfileType;
}

export const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({
  formData,
  onFieldChange,
  profileType,
}) => {
  const isGym = profileType === 'gym';

  return (
    <Card padding="none">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
          {isGym ? (
            <Building2 className="w-6 h-6 text-blue-600" />
          ) : (
            <Award className="w-6 h-6 text-blue-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {isGym ? 'Información del Centro' : 'Información Personal'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={isGym ? 'Nombre del Centro' : 'Nombre Comercial'}
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder={isGym ? 'Ej: FitZone Central' : 'Ej: Laura Montes Fitness'}
            leftIcon={<Building2 className="w-4 h-4" />}
          />

          <Input
            label="Teléfono"
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            placeholder="+34 123 456 789"
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        {isGym && (
          <Input
            label="Dirección"
            value={formData.address || ''}
            onChange={(e) => onFieldChange('address', e.target.value)}
            placeholder="Calle Falsa 123, Madrid"
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        )}

        <Textarea
          label={isGym ? 'Descripción del Centro' : 'Descripción y Especialidades'}
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder={isGym 
            ? 'Describe tu gimnasio, servicios, instalaciones...' 
            : 'Describe tus servicios, especialidades y experiencia...'}
          rows={4}
          maxLength={500}
          showCount
        />

        {isGym && (
          <Input
            label="Aforo Máximo"
            type="number"
            value={formData.maxCapacity?.toString() || ''}
            onChange={(e) => onFieldChange('maxCapacity', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="150"
            leftIcon={<Users className="w-4 h-4" />}
            helperText="Número máximo de personas que pueden estar en el centro simultáneamente"
          />
        )}

        {!isGym && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target size={16} className="inline mr-1" />
              Especialidades
            </label>
            <Input
              value={(formData.specialties || []).join(', ')}
              onChange={(e) => {
                const specialties = e.target.value
                  .split(',')
                  .map(s => s.trim())
                  .filter(s => s.length > 0);
                onFieldChange('specialties', specialties);
              }}
              placeholder="Ej: CrossFit, Rehabilitación, Nutrición"
              helperText="Separa las especialidades con comas"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

