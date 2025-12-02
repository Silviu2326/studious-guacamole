const fs = require('fs');
const path = require('path');

const modulosJson = JSON.parse(fs.readFileSync('modulos.json', 'utf8'));
const featuresDir = 'src/features';

const modulosEnJson = modulosJson.modulos.map(m => m.modulo);
const modulosEnFeatures = fs.readdirSync(featuresDir).filter(item => {
  const itemPath = path.join(featuresDir, item);
  return fs.statSync(itemPath).isDirectory();
});

// Mapeo manual de nombres que pueden diferir
const mapeoNombres = {
  'campanas-outreach': 'campaas-outreach',
  'catalogo-planes': 'catlogo-de-planes-bonos',
  'catalogo-productos': 'catlogo-de-productos',
  'gestión-de-clientes': 'gestin-de-clientes'
};

const creados = [];
const faltantes = [];

modulosEnJson.forEach(moduloJson => {
  let encontrado = false;
  let nombreEncontrado = '';
  
  // Buscar coincidencia exacta
  if (modulosEnFeatures.includes(moduloJson)) {
    encontrado = true;
    nombreEncontrado = moduloJson;
  } else {
    // Buscar en el mapeo inverso
    for (const [feature, json] of Object.entries(mapeoNombres)) {
      if (json === moduloJson && modulosEnFeatures.includes(feature)) {
        encontrado = true;
        nombreEncontrado = feature;
        break;
      }
    }
    
    // Buscar coincidencia parcial (sin guiones, sin acentos)
    if (!encontrado) {
      const normalizadoJson = moduloJson.replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]/g, '');
      const encontradoFeature = modulosEnFeatures.find(f => {
        const normalizadoFeature = f.replace(/[áàäâ]/g, 'a')
          .replace(/[éèëê]/g, 'e')
          .replace(/[íìïî]/g, 'i')
          .replace(/[óòöô]/g, 'o')
          .replace(/[úùüû]/g, 'u')
          .replace(/ñ/g, 'n')
          .replace(/[^a-z0-9]/g, '');
        return normalizadoJson === normalizadoFeature;
      });
      if (encontradoFeature) {
        encontrado = true;
        nombreEncontrado = encontradoFeature;
      }
    }
  }
  
  if (encontrado) {
    creados.push({ json: moduloJson, feature: nombreEncontrado });
  } else {
    faltantes.push(moduloJson);
  }
});

console.log('=== MÓDULOS CREADOS ===');
console.log('Total:', creados.length);
creados.forEach((c, i) => {
  const igual = c.json === c.feature ? '' : ' → ' + c.feature;
  console.log('  ' + (i + 1) + '. ' + c.json + igual);
});

console.log('\n=== MÓDULOS FALTANTES ===');
console.log('Total:', faltantes.length);
faltantes.forEach((f, i) => {
  const modulo = modulosJson.modulos.find(m => m.modulo === f);
  const espec = modulo.moduloespecificaciones.substring(0, 70);
  console.log('  ' + (i + 1) + '. ' + f);
  console.log('     Tipo: ' + espec);
});

console.log('\n=== RESUMEN ===');
console.log('Total en modulos.json:', modulosEnJson.length);
console.log('Total creados:', creados.length);
console.log('Total faltantes:', faltantes.length);
console.log('Progreso:', ((creados.length / modulosEnJson.length) * 100).toFixed(1) + '%');

console.log('\n=== FALTANTES POR TIPO ===');
const porTipo = {};
faltantes.forEach(f => {
  const modulo = modulosJson.modulos.find(m => m.modulo === f);
  let tipo = '';
  if (modulo.moduloespecificaciones.includes('Solo gimnasio')) {
    tipo = 'Solo Gimnasio';
  } else if (modulo.moduloespecificaciones.includes('Solo entrenador')) {
    tipo = 'Solo Entrenador';
  } else if (modulo.moduloespecificaciones.includes('adaptarse')) {
    tipo = 'Adaptable por Rol';
  } else {
    tipo = 'Mismo para Ambos';
  }
  porTipo[tipo] = (porTipo[tipo] || []);
  porTipo[tipo].push(f);
});

Object.entries(porTipo).forEach(([tipo, modulos]) => {
  console.log('\n  ' + tipo + ' (' + modulos.length + '):');
  modulos.forEach(m => console.log('    - ' + m));
});


