import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Move, Settings, Minus, Plus } from 'lucide-react';

export type TimerMode = 'stopwatch' | 'countdown' | 'interval';

export interface TimerConfig {
  mode: TimerMode;
  duration?: number; // for countdown (seconds)
  work?: number; // for interval (seconds)
  rest?: number; // for interval (seconds)
  rounds?: number; // for interval
}

interface TimerWidgetProps {
  onClose: () => void;
  initialConfig?: TimerConfig;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ onClose, initialConfig }) => {
  const [mode, setMode] = useState<TimerMode>(initialConfig?.mode || 'stopwatch');
  const [time, setTime] = useState(initialConfig?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Interval state
  const [intervalPhase, setIntervalPhase] = useState<'work' | 'rest'>('work');
  const [currentRound, setCurrentRound] = useState(1);
  const [workTime, setWorkTime] = useState(initialConfig?.work || 20);
  const [restTime, setRestTime] = useState(initialConfig?.rest || 10);
  const [totalRounds, setTotalRounds] = useState(initialConfig?.rounds || 8);
  
  // Countdown settings
  const [countdownDuration, setCountdownDuration] = useState(initialConfig?.duration || 60);

  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 100 });
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setTime(t => t + 1);
        } else if (mode === 'countdown') {
          setTime(t => {
            if (t <= 0) {
              setIsRunning(false);
              return 0;
            }
            return t - 1;
          });
        } else if (mode === 'interval') {
          setTime(t => {
            if (t <= 0) {
              // Switch phase or round
              if (intervalPhase === 'work') {
                setIntervalPhase('rest');
                return restTime;
              } else {
                if (currentRound < totalRounds) {
                  setCurrentRound(r => r + 1);
                  setIntervalPhase('work');
                  return workTime;
                } else {
                  setIsRunning(false);
                  return 0;
                }
              }
            }
            return t - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode, intervalPhase, currentRound, totalRounds, workTime, restTime]);

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setTime(0);
    } else if (mode === 'countdown') {
      setTime(countdownDuration);
    } else if (mode === 'interval') {
      setTime(workTime);
      setCurrentRound(1);
      setIntervalPhase('work');
    }
  };

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingRef.current) {
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'stopwatch') setTime(0);
    if (newMode === 'countdown') setTime(countdownDuration);
    if (newMode === 'interval') {
      setTime(workTime);
      setCurrentRound(1);
      setIntervalPhase('work');
    }
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-72 overflow-hidden"
      style={{ left: position.x, top: position.y }}
    >
      {/* Header */}
      <div 
        className="bg-gray-900 text-white p-2 flex justify-between items-center cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Move size={14} className="text-gray-400" />
          <span className="font-semibold text-xs uppercase tracking-wider">Timer</span>
        </div>
        <div className="flex items-center gap-1">
            <button onClick={() => setIsExpanded(!isExpanded)} className="hover:text-gray-300 p-1">
                <Settings size={14} />
            </button>
            <button onClick={onClose} className="hover:text-red-400 p-1">
                <X size={14} />
            </button>
        </div>
      </div>

      {/* Main Display */}
      <div className="p-4 text-center bg-gray-50">
        <div className="text-5xl font-mono font-bold text-gray-800 tracking-tight tabular-nums">
          {formatTime(time)}
        </div>
        
        {mode === 'interval' && (
          <div className="flex justify-center gap-4 mt-2 text-xs font-medium text-gray-500">
            <span className={intervalPhase === 'work' ? 'text-green-600 font-bold' : ''}>
                WORK {formatTime(workTime)}
            </span>
            <span className={intervalPhase === 'rest' ? 'text-orange-600 font-bold' : ''}>
                REST {formatTime(restTime)}
            </span>
            <span>R {currentRound}/{totalRounds}</span>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
            <button 
                onClick={() => setIsRunning(!isRunning)}
                className={`p-3 rounded-full transition-colors ${
                    isRunning ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
            >
                {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button 
                onClick={handleReset}
                className="p-3 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
                <RotateCcw size={24} />
            </button>
        </div>
      </div>

      {/* Settings / Mode Switcher */}
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between mb-3 bg-gray-100 p-1 rounded-lg">
                {(['stopwatch', 'countdown', 'interval'] as TimerMode[]).map(m => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md capitalize transition-all ${
                            mode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {mode === 'countdown' && (
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Duration</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCountdownDuration(d => Math.max(10, d - 10))} className="p-1 hover:bg-gray-100 rounded"><Minus size={12}/></button>
                        <span className="text-xs font-mono w-12 text-center">{formatTime(countdownDuration)}</span>
                        <button onClick={() => setCountdownDuration(d => d + 10)} className="p-1 hover:bg-gray-100 rounded"><Plus size={12}/></button>
                    </div>
                </div>
            )}

            {mode === 'interval' && (
                <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Work</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setWorkTime(t => Math.max(5, t - 5))} className="p-1 hover:bg-gray-100 rounded"><Minus size={12}/></button>
                            <span className="text-xs font-mono w-8 text-center">{workTime}s</span>
                            <button onClick={() => setWorkTime(t => t + 5)} className="p-1 hover:bg-gray-100 rounded"><Plus size={12}/></button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Rest</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setRestTime(t => Math.max(0, t - 5))} className="p-1 hover:bg-gray-100 rounded"><Minus size={12}/></button>
                            <span className="text-xs font-mono w-8 text-center">{restTime}s</span>
                            <button onClick={() => setRestTime(t => t + 5)} className="p-1 hover:bg-gray-100 rounded"><Plus size={12}/></button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Rounds</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setTotalRounds(r => Math.max(1, r - 1))} className="p-1 hover:bg-gray-100 rounded"><Minus size={12}/></button>
                            <span className="text-xs font-mono w-8 text-center">{totalRounds}</span>
                            <button onClick={() => setTotalRounds(r => r + 1)} className="p-1 hover:bg-gray-100 rounded"><Plus size={12}/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
