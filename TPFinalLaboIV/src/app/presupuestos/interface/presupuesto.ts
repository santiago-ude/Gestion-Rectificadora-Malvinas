import { Item } from "./item";

export interface Presupuesto {

    id: string | null;
    fecha: Date;
    descuento: number;
    items: Item[];
    total: Number;

}
