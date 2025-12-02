export interface FotoComida {
  id?: string;
  checkInId: string;
  clienteId: string;
  fecha: string;
  tipoComida: 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack';
  url: string;
  thumbnail?: string;
  descripcion?: string;
  evaluacionEntrenador?: 'cumple' | 'parcial' | 'no_cumple';
  createdAt?: string;
}

// Mock data
const fotosComidaMock: FotoComida[] = [
  {
    id: '1',
    checkInId: '1',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'desayuno',
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    descripcion: 'Avena con frutas y proteína',
    evaluacionEntrenador: 'cumple',
  },
  {
    id: '2',
    checkInId: '2',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'almuerzo',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    descripcion: 'Pollo con arroz integral y ensalada',
    evaluacionEntrenador: 'cumple',
  },
  {
    id: '3',
    checkInId: '4',
    clienteId: 'cliente1',
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'cena',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    descripcion: 'Salmón con verduras al vapor',
    evaluacionEntrenador: 'parcial',
  },
];

export async function subirFotoComida(file: File, checkInId: string, clienteId: string, tipoComida: string): Promise<FotoComida | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaFoto: FotoComida = {
    id: Date.now().toString(),
    checkInId,
    clienteId,
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: tipoComida as any,
    url: URL.createObjectURL(file),
    descripcion: file.name,
  };
  fotosComidaMock.push(nuevaFoto);
  return nuevaFoto;
}

export async function getFotosComida(clienteId: string, fecha?: string): Promise<FotoComida[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let resultado = fotosComidaMock.filter(f => f.clienteId === clienteId);
  
  if (fecha) {
    resultado = resultado.filter(f => f.fecha === fecha);
  }
  
  return resultado;
}

export async function getFotosPorCheckIn(checkInId: string): Promise<FotoComida[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return fotosComidaMock.filter(f => f.checkInId === checkInId);
}

export async function getFotosPorTipoComida(
  clienteId: string, 
  tipoComida: string, 
  fechaExcluida?: string
): Promise<FotoComida[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let resultado = fotosComidaMock.filter(
    f => f.clienteId === clienteId && f.tipoComida === tipoComida
  );
  
  if (fechaExcluida) {
    resultado = resultado.filter(f => f.fecha !== fechaExcluida);
  }
  
  // Ordenar por fecha descendente (más recientes primero)
  resultado.sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return fechaB - fechaA;
  });
  
  return resultado;
}

export async function evaluarFoto(fotoId: string, evaluacion: 'cumple' | 'parcial' | 'no_cumple', comentario?: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = fotosComidaMock.findIndex(f => f.id === fotoId);
  if (index === -1) return false;
  
  fotosComidaMock[index].evaluacionEntrenador = evaluacion;
  if (comentario) {
    fotosComidaMock[index].descripcion = comentario;
  }
  return true;
}

export async function eliminarFotoComida(fotoId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = fotosComidaMock.findIndex(f => f.id === fotoId);
  if (index === -1) return false;
  
  fotosComidaMock.splice(index, 1);
  return true;
}

