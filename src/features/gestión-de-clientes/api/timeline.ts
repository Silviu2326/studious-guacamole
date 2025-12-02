import { TimelineEntry, TimelinePhoto, PhysicalMeasurement } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'timeline_1',
    clienteId: 'client_1',
    date: '2024-10-28',
    type: 'measurement',
    title: 'Medición Mensual - Octubre',
    description: 'Control mensual de medidas corporales',
    measurements: [
      {
        id: 'meas_1',
        timelineEntryId: 'timeline_1',
        type: 'weight',
        value: 75.5,
        unit: 'kg',
        notes: 'Bajó 2kg desde el mes pasado',
      },
      {
        id: 'meas_2',
        timelineEntryId: 'timeline_1',
        type: 'body-fat',
        value: 18.5,
        unit: '%',
        notes: 'Mejora del 2%',
      },
      {
        id: 'meas_3',
        timelineEntryId: 'timeline_1',
        type: 'chest',
        value: 105,
        unit: 'cm',
      },
      {
        id: 'meas_4',
        timelineEntryId: 'timeline_1',
        type: 'waist',
        value: 88,
        unit: 'cm',
      },
    ],
  },
  {
    id: 'timeline_2',
    clienteId: 'client_1',
    date: '2024-10-15',
    type: 'photo',
    title: 'Fotos de Progreso - Octubre',
    description: 'Comparación de progreso mensual',
    photos: [
      {
        id: 'photo_1',
        timelineEntryId: 'timeline_2',
        url: 'https://via.placeholder.com/400x600/3B82F6/FFFFFF?text=Foto+Frontal',
        thumbnailUrl: 'https://via.placeholder.com/200x300/3B82F6/FFFFFF?text=Foto+Frontal',
        description: 'Vista frontal',
        photoType: 'front',
        uploadDate: '2024-10-15',
      },
      {
        id: 'photo_2',
        timelineEntryId: 'timeline_2',
        url: 'https://via.placeholder.com/400x600/8B5CF6/FFFFFF?text=Foto+Lateral',
        thumbnailUrl: 'https://via.placeholder.com/200x300/8B5CF6/FFFFFF?text=Foto+Lateral',
        description: 'Vista lateral',
        photoType: 'side',
        uploadDate: '2024-10-15',
      },
    ],
  },
  {
    id: 'timeline_3',
    clienteId: 'client_1',
    date: '2024-09-28',
    type: 'measurement',
    title: 'Medición Mensual - Septiembre',
    description: 'Control mensual de medidas corporales',
    measurements: [
      {
        id: 'meas_5',
        timelineEntryId: 'timeline_3',
        type: 'weight',
        value: 77.5,
        unit: 'kg',
      },
      {
        id: 'meas_6',
        timelineEntryId: 'timeline_3',
        type: 'body-fat',
        value: 20.5,
        unit: '%',
      },
      {
        id: 'meas_7',
        timelineEntryId: 'timeline_3',
        type: 'chest',
        value: 103,
        unit: 'cm',
      },
      {
        id: 'meas_8',
        timelineEntryId: 'timeline_3',
        type: 'waist',
        value: 90,
        unit: 'cm',
      },
    ],
  },
  {
    id: 'timeline_4',
    clienteId: 'client_1',
    date: '2024-09-15',
    type: 'photo',
    title: 'Fotos de Progreso - Septiembre',
    description: 'Comparación de progreso mensual',
    photos: [
      {
        id: 'photo_3',
        timelineEntryId: 'timeline_4',
        url: 'https://via.placeholder.com/400x600/10B981/FFFFFF?text=Foto+Frontal',
        thumbnailUrl: 'https://via.placeholder.com/200x300/10B981/FFFFFF?text=Foto+Frontal',
        description: 'Vista frontal',
        photoType: 'front',
        uploadDate: '2024-09-15',
      },
    ],
  },
  {
    id: 'timeline_5',
    clienteId: 'client_1',
    date: '2024-08-01',
    type: 'milestone',
    title: 'Inicio del Programa',
    description: 'Primera evaluación y establecimiento de objetivos',
    measurements: [
      {
        id: 'meas_9',
        timelineEntryId: 'timeline_5',
        type: 'weight',
        value: 80,
        unit: 'kg',
      },
      {
        id: 'meas_10',
        timelineEntryId: 'timeline_5',
        type: 'body-fat',
        value: 22,
        unit: '%',
      },
    ],
    photos: [
      {
        id: 'photo_4',
        timelineEntryId: 'timeline_5',
        url: 'https://via.placeholder.com/400x600/F59E0B/FFFFFF?text=Foto+Inicial',
        thumbnailUrl: 'https://via.placeholder.com/200x300/F59E0B/FFFFFF?text=Foto+Inicial',
        description: 'Foto inicial',
        photoType: 'front',
        uploadDate: '2024-08-01',
      },
    ],
  },
];

export const getTimelineEntries = async (clienteId: string): Promise<TimelineEntry[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_TIMELINE_ENTRIES
    .filter(entry => entry.clienteId === clienteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const createTimelineEntry = async (
  clienteId: string,
  entry: Omit<TimelineEntry, 'id' | 'clienteId'>
): Promise<TimelineEntry> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newEntry: TimelineEntry = {
    id: `timeline_${Date.now()}`,
    clienteId,
    ...entry,
  };

  MOCK_TIMELINE_ENTRIES.push(newEntry);
  return newEntry;
};

export const updateTimelineEntry = async (
  entryId: string,
  updates: Partial<TimelineEntry>
): Promise<TimelineEntry> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const index = MOCK_TIMELINE_ENTRIES.findIndex(entry => entry.id === entryId);
  if (index === -1) throw new Error('Timeline entry not found');

  MOCK_TIMELINE_ENTRIES[index] = { ...MOCK_TIMELINE_ENTRIES[index], ...updates };
  return MOCK_TIMELINE_ENTRIES[index];
};

export const deleteTimelineEntry = async (entryId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = MOCK_TIMELINE_ENTRIES.findIndex(entry => entry.id === entryId);
  if (index !== -1) {
    MOCK_TIMELINE_ENTRIES.splice(index, 1);
  }
};

export const addPhotoToTimeline = async (
  timelineEntryId: string,
  photo: Omit<TimelinePhoto, 'id' | 'timelineEntryId' | 'uploadDate'>
): Promise<TimelinePhoto> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const entry = MOCK_TIMELINE_ENTRIES.find(e => e.id === timelineEntryId);
  if (!entry) throw new Error('Timeline entry not found');

  const newPhoto: TimelinePhoto = {
    id: `photo_${Date.now()}`,
    timelineEntryId,
    uploadDate: new Date().toISOString(),
    ...photo,
  };

  if (!entry.photos) {
    entry.photos = [];
  }
  entry.photos.push(newPhoto);

  return newPhoto;
};

export const addMeasurementToTimeline = async (
  timelineEntryId: string,
  measurement: Omit<PhysicalMeasurement, 'id' | 'timelineEntryId'>
): Promise<PhysicalMeasurement> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const entry = MOCK_TIMELINE_ENTRIES.find(e => e.id === timelineEntryId);
  if (!entry) throw new Error('Timeline entry not found');

  const newMeasurement: PhysicalMeasurement = {
    id: `meas_${Date.now()}`,
    timelineEntryId,
    ...measurement,
  };

  if (!entry.measurements) {
    entry.measurements = [];
  }
  entry.measurements.push(newMeasurement);

  return newMeasurement;
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  MOCK_TIMELINE_ENTRIES.forEach(entry => {
    if (entry.photos) {
      const index = entry.photos.findIndex(p => p.id === photoId);
      if (index !== -1) {
        entry.photos.splice(index, 1);
      }
    }
  });
};

export const deleteMeasurement = async (measurementId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  MOCK_TIMELINE_ENTRIES.forEach(entry => {
    if (entry.measurements) {
      const index = entry.measurements.findIndex(m => m.id === measurementId);
      if (index !== -1) {
        entry.measurements.splice(index, 1);
      }
    }
  });
};

