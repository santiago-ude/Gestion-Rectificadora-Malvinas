
import { PresupuestoItem } from "./PresupuestoItem";

export interface Presupuesto {

   id: number;
   fecha: Date;
   descuento: number;
   items : PresupuestoItem[];

}
