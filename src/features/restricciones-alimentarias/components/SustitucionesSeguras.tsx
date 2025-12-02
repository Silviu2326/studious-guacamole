import { useState } from 'react';
import { Input } from '../../componentsreutilizables/Input';
import { Button } from '../../componentsreutilizables/Button';
import { Table } from '../../componentsreutilizables/Table';
import * as api from '../api/validacion';

export function SustitucionesSeguras() {
  const [ingrediente, setIngrediente] = useState('');
  const [alternativas, setAlternativas] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-end">
        <div className="flex-1">
          <Input label="Ingrediente restringido" value={ingrediente} onChange={setIngrediente} placeholder="p.ej., gluten" />
        </div>
        <Button onClick={async () => setAlternativas(await api.getSustituciones(ingrediente))}>Buscar alternativas</Button>
      </div>
      <Table
        columns={[{ key: 'alt', header: 'Alternativa segura' }]}
        data={alternativas.map((alt) => ({ alt }))}
      />
    </div>
  );
}


