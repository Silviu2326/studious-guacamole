import { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, Rocket, Trophy, Target, ChevronRight, UserPlus, User, X } from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { AdvocacyMoment, EngagementProgram, TeamMemberOwner } from '../types';
import { getAvailableTeamMembers, assignProgramOwner, removeProgramOwner, setPrograms } from '../api/programOwners';

interface AdvocacyProgramsProps {
  programs: EngagementProgram[];
  advocacyMoments: AdvocacyMoment[];
  loading?: boolean;
  onProgramUpdate?: (program: EngagementProgram) => void;
}

export function AdvocacyPrograms({ programs, advocacyMoments, loading, onProgramUpdate }: AdvocacyProgramsProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMemberOwner[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<EngagementProgram | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    // Sincronizar programas con la API
    setPrograms(programs);
    loadTeamMembers();
  }, [programs]);

  const loadTeamMembers = useCallback(async () => {
    try {
      const members = await getAvailableTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error cargando team members:', error);
    }
  }, []);

  const handleAssignOwner = useCallback(async (program: EngagementProgram, ownerId: string) => {
    setAssigning(true);
    try {
      const updatedProgram = await assignProgramOwner(program.id, ownerId);
      if (onProgramUpdate) {
        onProgramUpdate(updatedProgram);
      }
      setIsAssignModalOpen(false);
      setSelectedProgram(null);
    } catch (error) {
      console.error('Error asignando owner:', error);
    } finally {
      setAssigning(false);
    }
  }, [onProgramUpdate]);

  const handleRemoveOwner = useCallback(async (program: EngagementProgram) => {
    setAssigning(true);
    try {
      const updatedProgram = await removeProgramOwner(program.id);
      if (onProgramUpdate) {
        onProgramUpdate(updatedProgram);
      }
    } catch (error) {
      console.error('Error removiendo owner:', error);
    } finally {
      setAssigning(false);
    }
  }, [onProgramUpdate]);

  const getOwnerDisplay = (program: EngagementProgram) => {
    if (program.assignedOwner) {
      return program.assignedOwner.name + (program.assignedOwner.role ? ` (${program.assignedOwner.role})` : '');
    }
    if (typeof program.owner === 'string') {
      return program.owner;
    }
    return program.owner.name;
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Engagement Hub
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Orquesta tus programas de comunidad, fidelización y advocacy con claridad sobre KPIs,
                responsables e impacto.
              </p>
            </div>
            <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              Playbooks
            </Badge>
          </header>

          <div className="mt-6 space-y-4">
            {(loading ? Array.from({ length: 3 }) : programs).map((program, index) => (
              <article
                key={program?.id ?? index}
                className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
              >
                {program ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {program.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{program.description}</p>
                      </div>
                      <Badge variant="blue" size="sm" className="inline-flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" />
                        {program.kpi}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Owner: {getOwnerDisplay(program)}
                          </span>
                          {program.assignedOwner && (
                            <button
                              onClick={() => handleRemoveOwner(program)}
                              className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                              title="Remover owner"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span>Progreso: {program.progress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-slate-200/70 dark:bg-slate-800/60 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              program.trend === 'positive'
                                ? 'bg-emerald-500'
                                : program.trend === 'negative'
                                  ? 'bg-rose-500'
                                  : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, program.progress)}%` }}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProgram(program);
                            setIsAssignModalOpen(true);
                          }}
                          className="text-xs px-2 py-1 h-auto"
                          title="Asignar owner"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ProgramSkeleton />
                )}
              </article>
            ))}
          </div>
        </Card>

      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Momentos de advocacy
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mantén vivo el momentum generando hitos sociales y celebraciones con tu comunidad.
            </p>
          </div>
          <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Historias
          </Badge>
        </header>

        <div className="mt-6 grow">
          <ul className="space-y-4">
            {(loading ? Array.from({ length: 4 }) : advocacyMoments).map((moment, index) => (
              <li
                key={moment?.id ?? index}
                className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-gradient-to-r from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
              >
                {moment ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-900/5 dark:bg-white/10">
                          <CalendarCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {moment.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Due: {moment.dueDate} · Owner: {moment.owner}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={moment.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Tipo: {moment.type}</span>
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        {moment.impact}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <MomentSkeleton />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-end">
          <Button variant="secondary" className="inline-flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Lanzar nuevo playbook
          </Button>
        </div>
      </Card>
    </div>

    {/* Modal para asignar owner */}
    {isAssignModalOpen && selectedProgram && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/60 p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Asignar Owner
            </h3>
            <button
              onClick={() => {
                setIsAssignModalOpen(false);
                setSelectedProgram(null);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Programa: <span className="font-semibold">{selectedProgram.title}</span>
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleAssignOwner(selectedProgram, member.id)}
                disabled={assigning}
                className="w-full text-left p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {member.name}
                    </p>
                    {member.role && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

interface StatusBadgeProps {
  status: AdvocacyMoment['status'];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    'planificado': { label: 'Planificado', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
    'en curso': { label: 'En curso', className: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' },
    'completado': { label: 'Completado', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[status].className}`}>
      {map[status].label}
    </span>
  );
}

function ProgramSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-3 w-56 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
        <div className="h-5 w-20 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-3 w-20 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
    </div>
  );
}

function MomentSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div>
            <div className="h-4 w-36 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="mt-2 h-3 w-44 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="h-5 w-20 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-3 w-32 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}









