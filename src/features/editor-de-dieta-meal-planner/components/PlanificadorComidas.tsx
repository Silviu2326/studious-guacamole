import React, { useState } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { type Dieta, type Comida, type DiaPlan } from '../api/editor';
import { calcularTotalesDia, validarBalanceNutricional } from '../api/planificador';
import { ds } from '../../adherencia/ui/ds';

interface PlanificadorComidasProps {
  dieta: Dieta;
  onComidaAgregada?: (dia: Date, comida: Comida) => void;
}

export const PlanificadorComidas: React.FC<PlanificadorComidasProps> = ({
  dieta,
  onComidaAgregada,
}) => {
  const [semana, setSemana] = useState(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes de esta semana
    return lunes;
  });

  const [diasPlan, setDiasPlan] = useState<DiaPlan[]>(() => {
    const dias: DiaPlan[] = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(semana);
      fecha.setDate(semana.getDate() + i);
      dias.push({
        fecha,
        comidas: [],
        totalCalorias: 0,
        totalProteinas: 0,
        totalCarbohidratos: 0,
        totalGrasas: 0,
      });
    }
    return dias;
  });

  const agregarComidaADia = (fecha: Date, comida: Comida) => {
    setDiasPlan((dias) =>
      dias.map((dia) => {
        if (dia.fecha.toDateString() === fecha.toDateString()) {
          const nuevasComidas = [...dia.comidas, comida];
          const totales = calcularTotalesDia(nuevasComidas);
          return {
            ...dia,
            comidas: nuevasComidas,
            ...totales,
          };
        }
        return dia;
      })
    );
    onComidaAgregada?.(fecha, comida);
  };

  const eliminarComida = (fecha: Date, comidaId: string) => {
    setDiasPlan((dias) =>
      dias.map((dia) => {
        if (dia.fecha.toDateString() === fecha.toDateString()) {
          const nuevasComidas = dia.comidas.filter((c) => c.id !== comidaId);
          const totales = calcularTotalesDia(nuevasComidas);
          return {
            ...dia,
            comidas: nuevasComidas,
            ...totales,
          };
        }
        return dia;
      })
    );
  };

  const obtenerDiaSemana = (fecha: Date) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[fecha.getDay()];
  };

  const validarDia = (dia: DiaPlan) => {
    if (!dieta.macros) return null;
    return validarBalanceNutricional(
      {
        calorias: dia.totalCalorias,
        proteinas: dia.totalProteinas,
        carbohidratos: dia.totalCarbohidratos,
        grasas: dia.totalGrasas,
      },
      dieta.macros
    );
  };

  const columnas = [
    {
      key: 'fecha',
      label: 'Día',
      render: (dia: DiaPlan) => (
        <div>
          <div className="font-medium text-gray-900">
            {obtenerDiaSemana(dia.fecha)}
          </div>
          <div className="text-sm text-gray-500">
            {dia.fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      ),
    },
    {
      key: 'comidas',
      label: 'Comidas',
      render: (dia: DiaPlan) => (
        <div className="space-y-1">
          {dia.comidas.length > 0 ? (
            dia.comidas.map((comida) => (
              <div key={comida.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{comida.nombre}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => eliminarComida(dia.fecha, comida.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm">Sin comidas</span>
          )}
        </div>
      ),
    },
    {
      key: 'macros',
      label: 'Macronutrientes',
      render: (dia: DiaPlan) => (
        <div className="text-sm space-y-1">
          <div className="text-gray-700 dark:text-gray-300">
            <strong>{dia.totalCalorias}</strong> kcal
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            P: {dia.totalProteinas}g | C: {dia.totalCarbohidratos}g | G: {dia.totalGrasas}g
          </div>
        </div>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (dia: DiaPlan) => {
        const validacion = validarDia(dia);
        if (!validacion) return null;
        return (
          <div>
            {validacion.balanceado ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Balanceado
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                Ajustar
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Planificador de Comidas Semanal
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const anterior = new Date(semana);
              anterior.setDate(semana.getDate() - 7);
              setSemana(anterior);
            }}
          >
            Semana Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const siguiente = new Date(semana);
              siguiente.setDate(semana.getDate() + 7);
              setSemana(siguiente);
            }}
          >
            Siguiente Semana
          </Button>
        </div>
      </div>

      <Table
        columns={columnas}
        data={diasPlan}
        emptyMessage="No hay días planificados"
      />

      {dieta.macros && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm font-semibold text-blue-900 mb-2">
            Objetivos Diarios
          </div>
          <div className="text-sm text-blue-700">
            {dieta.macros.calorias} kcal | {dieta.macros.proteinas}g P | {dieta.macros.carbohidratos}g C | {dieta.macros.grasas}g G
          </div>
        </div>
      )}
    </Card>
  );
};

