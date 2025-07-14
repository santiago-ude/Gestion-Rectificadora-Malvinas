import { Clientes } from '../../clientes/interface/clientes';
import { Presupuesto } from '../../presupuestos/interface/presupuesto';

export interface Pedidos {
  id?: Number;
  cliente: Clientes;
  fechaEntrada: Date;
  fechaSalidaEstimada: Date;
  fechaEntregaEfectiva?: Date | null;
  estado: 'activo' | 'entregado' | 'atrasado';
  presupuesto: Presupuesto;  
  marcaAuto: string;
  modeloAuto: string;
  numeroSerie: string;
  descripcion: string;
}