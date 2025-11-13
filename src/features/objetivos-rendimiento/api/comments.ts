import { ObjectiveKPIComment, Mention } from '../types';

interface AddCommentParams {
  objectiveId?: string;
  kpiId?: string;
  content: string;
  mentions?: Mention[];
  parentCommentId?: string;
}

export const getComments = async (
  objectiveId?: string,
  kpiId?: string
): Promise<ObjectiveKPIComment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const key = objectiveId ? `objective-comments-${objectiveId}` : `kpi-comments-${kpiId}`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    return JSON.parse(saved);
  }
  
  return [];
};

export const addComment = async (params: AddCommentParams): Promise<ObjectiveKPIComment> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const comment: ObjectiveKPIComment = {
    id: `comment-${Date.now()}`,
    objectiveId: params.objectiveId,
    kpiId: params.kpiId,
    content: params.content,
    mentions: params.mentions || [],
    createdBy: 'current-user-id', // En producción, usar el ID del usuario actual
    createdByName: 'Usuario Actual', // En producción, usar el nombre del usuario actual
    createdAt: new Date().toISOString(),
    replies: [],
    parentCommentId: params.parentCommentId,
  };

  const key = params.objectiveId
    ? `objective-comments-${params.objectiveId}`
    : `kpi-comments-${params.kpiId}`;
  
  const existingComments = await getComments(params.objectiveId, params.kpiId);

  if (params.parentCommentId) {
    // Es una respuesta, agregar al comentario padre
    const updatedComments = existingComments.map((c) => {
      if (c.id === params.parentCommentId) {
        return {
          ...c,
          replies: [...(c.replies || []), comment],
        };
      }
      return c;
    });
    localStorage.setItem(key, JSON.stringify(updatedComments));
  } else {
    // Es un comentario nuevo
    localStorage.setItem(key, JSON.stringify([...existingComments, comment]));
  }

  // También actualizar en el objetivo/KPI
  if (params.objectiveId) {
    const saved = localStorage.getItem('objectives-data');
    if (saved) {
      const objectives = JSON.parse(saved);
      const index = objectives.findIndex((obj: any) => obj.id === params.objectiveId);
      if (index !== -1) {
        objectives[index].comments = [...(objectives[index].comments || []), comment];
        localStorage.setItem('objectives-data', JSON.stringify(objectives));
      }
    }
  } else if (params.kpiId) {
    const saved = localStorage.getItem('kpis-data');
    if (saved) {
      const kpis = JSON.parse(saved);
      const index = kpis.findIndex((kpi: any) => kpi.id === params.kpiId);
      if (index !== -1) {
        kpis[index].comments = [...(kpis[index].comments || []), comment];
        localStorage.setItem('kpis-data', JSON.stringify(kpis));
      }
    }
  }

  return comment;
};

export const updateComment = async (
  commentId: string,
  content: string
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Buscar en todos los objetivos y KPIs
  const objectivesKey = 'objectives-data';
  const kpisKey = 'kpis-data';

  // Actualizar en objetivos
  const objectivesSaved = localStorage.getItem(objectivesKey);
  if (objectivesSaved) {
    const objectives = JSON.parse(objectivesSaved);
    let updated = false;

    objectives.forEach((obj: any) => {
      if (obj.comments) {
        obj.comments = obj.comments.map((c: ObjectiveKPIComment) => {
          if (c.id === commentId) {
            updated = true;
            return { ...c, content, updatedAt: new Date().toISOString() };
          }
          // Buscar en respuestas
          if (c.replies) {
            c.replies = c.replies.map((r: ObjectiveKPIComment) => {
              if (r.id === commentId) {
                updated = true;
                return { ...r, content, updatedAt: new Date().toISOString() };
              }
              return r;
            });
          }
          return c;
        });
      }
    });

    if (updated) {
      localStorage.setItem(objectivesKey, JSON.stringify(objectives));
    }
  }

  // Actualizar en KPIs
  const kpisSaved = localStorage.getItem(kpisKey);
  if (kpisSaved) {
    const kpis = JSON.parse(kpisSaved);
    let updated = false;

    kpis.forEach((kpi: any) => {
      if (kpi.comments) {
        kpi.comments = kpi.comments.map((c: ObjectiveKPIComment) => {
          if (c.id === commentId) {
            updated = true;
            return { ...c, content, updatedAt: new Date().toISOString() };
          }
          // Buscar en respuestas
          if (c.replies) {
            c.replies = c.replies.map((r: ObjectiveKPIComment) => {
              if (r.id === commentId) {
                updated = true;
                return { ...r, content, updatedAt: new Date().toISOString() };
              }
              return r;
            });
          }
          return c;
        });
      }
    });

    if (updated) {
      localStorage.setItem(kpisKey, JSON.stringify(kpis));
    }
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Buscar en todos los objetivos y KPIs
  const objectivesKey = 'objectives-data';
  const kpisKey = 'kpis-data';

  // Actualizar en objetivos
  const objectivesSaved = localStorage.getItem(objectivesKey);
  if (objectivesSaved) {
    const objectives = JSON.parse(objectivesSaved);
    let updated = false;

    objectives.forEach((obj: any) => {
      if (obj.comments) {
        const beforeLength = obj.comments.length;
        obj.comments = obj.comments.filter((c: ObjectiveKPIComment) => {
          if (c.id === commentId) {
            updated = true;
            return false;
          }
          // Buscar en respuestas
          if (c.replies) {
            c.replies = c.replies.filter((r: ObjectiveKPIComment) => r.id !== commentId);
            if (c.replies.length !== (obj.comments.find((oc: ObjectiveKPIComment) => oc.id === c.id)?.replies?.length || 0)) {
              updated = true;
            }
          }
          return true;
        });
      }
    });

    if (updated) {
      localStorage.setItem(objectivesKey, JSON.stringify(objectives));
    }
  }

  // Actualizar en KPIs
  const kpisSaved = localStorage.getItem(kpisKey);
  if (kpisSaved) {
    const kpis = JSON.parse(kpisSaved);
    let updated = false;

    kpis.forEach((kpi: any) => {
      if (kpi.comments) {
        kpi.comments = kpi.comments.filter((c: ObjectiveKPIComment) => {
          if (c.id === commentId) {
            updated = true;
            return false;
          }
          // Buscar en respuestas
          if (c.replies) {
            c.replies = c.replies.filter((r: ObjectiveKPIComment) => r.id !== commentId);
            if (c.replies.length !== (kpi.comments.find((kc: ObjectiveKPIComment) => kc.id === c.id)?.replies?.length || 0)) {
              updated = true;
            }
          }
          return true;
        });
      }
    });

    if (updated) {
      localStorage.setItem(kpisKey, JSON.stringify(kpis));
    }
  }
};

