import React from 'react';

interface TitledInputSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Componente de UI reutilizable para una sección del formulario del wizard.
 */
export const TitledInputSection: React.FC<TitledInputSectionProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
















