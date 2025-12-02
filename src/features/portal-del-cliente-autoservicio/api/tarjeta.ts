// API para gestión de tarjetas de pago
export interface TarjetaData {
  numero: string;
  nombreTitular: string;
  fechaVencimiento: string; // MM/YY
  cvv: string;
}

export interface TarjetaActual {
  ultimosDigitos: string;
  tipo: string;
  fechaVencimiento: string;
}

const mockTarjetaActual: TarjetaActual = {
  ultimosDigitos: '4242',
  tipo: 'Visa',
  fechaVencimiento: '12/25'
};

export const tarjetaAPI = {
  async obtenerTarjetaActual(): Promise<TarjetaActual | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTarjetaActual;
  },

  async cambiarTarjeta(datos: TarjetaData): Promise<TarjetaActual> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validaciones básicas
    const numeroTarjeta = datos.numero.replace(/\s/g, '');
    
    if (numeroTarjeta.length < 13 || numeroTarjeta.length > 19) {
      throw new Error('Número de tarjeta inválido');
    }
    
    // Validar algoritmo de Luhn (simplificado)
    let suma = 0;
    let esAlterno = false;
    for (let i = numeroTarjeta.length - 1; i >= 0; i--) {
      let digito = parseInt(numeroTarjeta[i]);
      if (esAlterno) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      suma += digito;
      esAlterno = !esAlterno;
    }
    
    if (suma % 10 !== 0) {
      throw new Error('Número de tarjeta inválido');
    }
    
    // Validar fecha de vencimiento
    const [mes, ano] = datos.fechaVencimiento.split('/');
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear() % 100;
    const mesActual = fechaActual.getMonth() + 1;
    
    const añoVencimiento = parseInt(ano);
    const mesVencimiento = parseInt(mes);
    
    if (añoVencimiento < añoActual || (añoVencimiento === añoActual && mesVencimiento < mesActual)) {
      throw new Error('Tarjeta vencida');
    }
    
    // Validar CVV
    if (datos.cvv.length < 3 || datos.cvv.length > 4) {
      throw new Error('CVV inválido');
    }
    
    // Simular actualización
    const ultimosDigitos = numeroTarjeta.slice(-4);
    const tipo = numeroTarjeta.startsWith('4') ? 'Visa' : 
                 numeroTarjeta.startsWith('5') ? 'Mastercard' : 
                 numeroTarjeta.startsWith('3') ? 'American Express' : 'Otra';
    
    return {
      ultimosDigitos,
      tipo,
      fechaVencimiento: datos.fechaVencimiento
    };
  }
};

