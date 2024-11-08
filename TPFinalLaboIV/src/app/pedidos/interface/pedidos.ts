import { Clientes } from '../../clientes/interface/clientes';
import { Presupuesto } from '../../presupuestos/interface/presupuesto';

export interface Pedidos {
  id?: string;
  cliente: Clientes;
  fechaEntrada: Date;
  fechaSalidaEstimada: Date;
  fechaEntregaEfectiva?: Date;
  estado: 'activo' | 'entregado' | 'atrasado';
  presupuesto: Presupuesto;  
  marcaAuto: string;
  modeloAuto: string;
  numeroSerie: string;
  descripcion: string;
}