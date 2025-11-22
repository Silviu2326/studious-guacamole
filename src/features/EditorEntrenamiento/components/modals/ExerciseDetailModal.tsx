import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Info, 
  History, 
  Repeat, 
  Dumbbell, 
  Calendar, 
  TrendingUp,
  Heart,
  Share2,
  Upload,
  Video,
  X,
  Check,
  FileVideo
} from 'lucide-react';
import { Modal } from '../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../components/componentsreutilizables/Button';
import { Badge } from '../../../../components/componentsreutilizables/Badge';
import { Tabs } from '../../../../components/componentsreutilizables/Tabs';
import { useUIContext } from '../../context/UIContext';

// Mock extended data since the base type is simple
interface ExerciseExtendedDetails {
  instructions: string[];
  muscles: { name: string; role: 'primary' | 'secondary' }[];
  alternatives: { id: string; name: string; reason: string }[];
  history: { date: string; weight: string; reps: string; rpe: number }[];
}

const MOCK_DETAILS: Record<string, ExerciseExtendedDetails> = {
  'default': {
    instructions: [
      "Colócate en la posición inicial asegurando una postura estable.",
      "Inicia el movimiento controlando la fase excéntrica.",
      "Mantén la tensión en el grupo muscular objetivo.",
      "Expira al realizar el esfuerzo máximo (fase concéntrica).",
      "Vuelve a la posición inicial de forma controlada."
    ],
    muscles: [
      { name: "Pectoral Mayor", role: "primary" },
      { name: "Tríceps Braquial", role: "secondary" },
      { name: "Deltoides Anterior", role: "secondary" }
    ],
    alternatives: [
      { id: 'alt1', name: 'Dumbbell Press', reason: 'Mayor rango de movimiento' },
      { id: 'alt2', name: 'Push-ups', reason: 'Opción con peso corporal' },
      { id: 'alt3', name: 'Machine Press', reason: 'Mayor estabilidad' }
    ],
    history: [
      { date: '15 Nov 2023', weight: '80kg', reps: '4x8', rpe: 8 },
      { date: '10 Nov 2023', weight: '77.5kg', reps: '4x8', rpe: 7.5 },
      { date: '05 Nov 2023', weight: '75kg', reps: '4x8', rpe: 8 },
      { date: '01 Nov 2023', weight: '75kg', reps: '4x6', rpe: 7 }
    ]
  }
};

export const ExerciseDetailModal: React.FC = () => {
  const { 
    isExerciseDetailModalOpen, 
    setExerciseDetailModalOpen, 
    selectedExercise 
  } = useUIContext();
  
  const [activeTab, setActiveTab] = useState('info');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Custom Video Upload State
  const [customVideo, setCustomVideo] = useState<string | null>(null);
  const [customVideoName, setCustomVideoName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes or exercise changes
  useEffect(() => {
    if (!isExerciseDetailModalOpen) {
      // Optional: cleanup object URL to avoid memory leaks if we were persisting across sessions differently
      // But here we might want to keep it if the user re-opens the same exercise. 
      // For simplicity in this prototype, we'll keep it until component unmount or explicit removal.
    }
  }, [isExerciseDetailModalOpen]);

  if (!selectedExercise) return null;

  // In a real app, we would fetch these details based on selectedExercise.id
  // For now, we use mock data
  const details = MOCK_DETAILS[selectedExercise.id] || MOCK_DETAILS['default'];

  const handleClose = () => {
    setExerciseDetailModalOpen(false);
  };

  const tabItems = [
    { id: 'info', label: 'Info', icon: <Info size={16} /> },
    { id: 'history', label: 'Historial', icon: <History size={16} /> },
    { id: 'alternatives', label: 'Alternativas', icon: <Repeat size={16} /> },
    { id: 'custom-video', label: 'Video Personalizado', icon: <Video size={16} /> },
  ];

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'video/mp4' || file.type === 'video/quicktime' || file.type === 'video/webm') {
      setIsUploading(true);
      setUploadProgress(0);
      setCustomVideoName(file.name);
      
      // Simulate upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setCustomVideo(URL.createObjectURL(file));
            return 100;
          }
          return prev + 15; // Fast simulation
        });
      }, 300);
    } else {
      alert("Por favor sube un archivo de video válido (.mp4, .mov, .webm)");
    }
  };

  const removeCustomVideo = () => {
    setCustomVideo(null);
    setCustomVideoName(null);
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const renderVideo = () => (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6 group">
      {customVideo ? (
         <video 
           src={customVideo} 
           className="w-full h-full" 
           controls 
           autoPlay 
           muted // Muted autoplay usually works better
         />
      ) : selectedExercise.videoUrl ? (
        <iframe 
          src={selectedExercise.videoUrl.replace('watch?v=', 'embed/')} 
          className="w-full h-full" 
          title={selectedExercise.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-400">
          <Play size={48} className="mb-2 opacity-50" />
          <span className="text-sm">Vista previa no disponible</span>
        </div>
      )}
      
      {customVideo && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <Video size={12} /> Video Personalizado
        </div>
      )}
    </div>
  );

  const renderInfoTab = () => (
    <div className="space-y-6 pt-4">
      {/* Muscles & Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedExercise.tags.map(tag => (
          <Badge 
            key={tag.id} 
            variant={tag.category === 'muscle' ? 'blue' : 'gray'}
            className="capitalize"
          >
            {tag.label}
          </Badge>
        ))}
      </div>

      {/* Instructions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Info size={16} /> Instrucciones
        </h3>
        <ol className="space-y-3">
          {details.instructions.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Muscles Visual (Mock) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Dumbbell size={16} /> Músculos Implicados
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase block mb-1">Primarios</span>
              <div className="flex flex-wrap gap-2">
                {details.muscles.filter(m => m.role === 'primary').map(m => (
                  <Badge key={m.name} variant="blue" size="sm">{m.name}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase block mb-1">Secundarios</span>
              <div className="flex flex-wrap gap-2">
                {details.muscles.filter(m => m.role === 'secondary').map(m => (
                  <Badge key={m.name} variant="gray" size="sm">{m.name}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">Últimas Sesiones</h3>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <TrendingUp size={14} className="text-green-500" />
          Progreso: +5% último mes
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Peso</th>
              <th className="px-4 py-3">Series/Reps</th>
              <th className="px-4 py-3 text-right">RPE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {details.history.map((session, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-gray-900 font-medium flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {session.date}
                </td>
                <td className="px-4 py-3 text-gray-700">{session.weight}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{session.reps}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium
                    ${session.rpe >= 9 ? 'bg-red-100 text-red-700' : 
                      session.rpe >= 7 ? 'bg-orange-100 text-orange-700' : 
                      'bg-green-100 text-green-700'}`}>
                    {session.rpe}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="ghost" className="w-full text-xs text-gray-500 h-8">Ver historial completo</Button>
    </div>
  );

  const renderAlternativesTab = () => (
    <div className="space-y-4 pt-4">
      <p className="text-sm text-gray-500 mb-2">
        Ejercicios similares que trabajan los mismos grupos musculares:
      </p>
      <div className="grid gap-3">
        {details.alternatives.map((alt) => (
          <div key={alt.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                <Repeat size={20} />
              </div>
              <div>
                <div className="font-medium text-gray-900">{alt.name}</div>
                <div className="text-xs text-gray-500">{alt.reason}</div>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
              Sustituir
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomVideoTab = () => (
    <div className="space-y-6 pt-4">
      <p className="text-sm text-gray-600">
        Sube tu propio video de ejecución para este ejercicio. Este video reemplazará al predeterminado para este cliente.
      </p>

      {!customVideo && !isUploading && (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept="video/mp4,video/quicktime,video/webm" 
            onChange={handleChange}
          />
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <Upload size={24} />
          </div>
          <h4 className="text-gray-900 font-medium mb-1">Haz clic o arrastra tu video aquí</h4>
          <p className="text-xs text-gray-500 max-w-[200px]">
            Soporta MP4, MOV o WebM (max. 50MB)
          </p>
        </div>
      )}

      {isUploading && (
        <div className="border rounded-xl p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                <FileVideo size={20} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{customVideoName}</div>
                <div className="text-xs text-gray-500">Subiendo... {uploadProgress}%</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {customVideo && !isUploading && (
        <div className="border rounded-xl p-4 bg-green-50 border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded flex items-center justify-center">
                <Check size={20} />
              </div>
              <div>
                <div className="text-sm font-medium text-green-900">Video subido correctamente</div>
                <div className="text-xs text-green-700">{customVideoName}</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeCustomVideo}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X size={16} className="mr-1" /> Eliminar
            </Button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
        <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800">
          <span className="font-semibold block mb-1">Consejo Profesional:</span>
          Los videos personalizados aumentan la adherencia al plan en un 40%. Asegúrate de tener buena iluminación y que el ángulo permita ver la técnica completa.
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isExerciseDetailModalOpen}
      onClose={handleClose}
      title={selectedExercise.name}
      size="lg"
      footer={
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-600 bg-red-50 hover:bg-red-100" : "text-gray-500 hover:text-gray-700"}
            >
              <Heart size={16} className={isFavorite ? "fill-current mr-2" : "mr-2"} />
              {isFavorite ? 'Favorito' : 'Guardar'}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Share2 size={16} className="mr-2" /> Compartir
            </Button>
          </div>
          <Button onClick={handleClose} variant="primary">
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-[600px] max-h-[70vh]">
        <div className="p-0 flex-shrink-0">
          {renderVideo()}
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col px-1">
          <Tabs 
            items={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="w-full"
          />
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
            {activeTab === 'info' && renderInfoTab()}
            {activeTab === 'history' && renderHistoryTab()}
            {activeTab === 'alternatives' && renderAlternativesTab()}
            {activeTab === 'custom-video' && renderCustomVideoTab()}
          </div>
        </div>
      </div>
    </Modal>
  );
};
