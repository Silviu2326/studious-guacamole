import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface ReproductorVideoProps {
  videoUrl?: string;
  titulo?: string;
  className?: string;
}

export const ReproductorVideo: React.FC<ReproductorVideoProps> = ({
  videoUrl,
  titulo,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  if (!videoUrl) {
    return (
      <Card padding="lg" className={className}>
        <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay video disponible
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className={`overflow-hidden ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto max-h-96 object-contain bg-black"
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={toggleMute}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
            
            {titulo && (
              <p className={`${ds.typography.bodySmall} text-white font-medium`}>
                {titulo}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

