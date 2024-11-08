export interface Pedidos {
<<<<<<< HEAD
}
=======
  id: string;
  cliente: Clientes;  
  fechaEntrada: Date;
  fechaSalidaEstimada: Date;
  fechaEntregaEfectiva?: Date;
  estado: 'activo' | 'entregado' | 'atrasado';
  presupuesto?: Presupuesto;
  marcaAuto: string;
  modeloAuto: string;
  numeroSerie: string;
  descripcion: string;
}
>>>>>>> parent of 64eef990 (cambios en pedidos)
