import { IProductos } from "./IProductos";

export interface IProductoDecorado {
    original: IProductos;
    base: any;
    conDescuentoNavidad: any;
};