import { Item } from "./item";

export interface Presupuesto {

    id?: Number;
    fecha: Date;
    descuento: number;
    items: Item[];
    total: number

}
