import { IEstados } from "@/types/IEstados";
import { Ultimas } from "./estados/Ultimas";
import { Agotado } from "./estados/Agotado";
import { Disponible } from "./estados/Disponible";

import { IProductos } from "@/types/IProductos";

export class ProductoConEstado {
    private estado: IEstados;

    constructor(private producto: IProductos) {
        this.estado = this.definirEstado(producto.cantidad);
    }

    private definirEstado(stock: number): IEstados {
        if (stock > 10) {
            return new Disponible(stock);
        } else if (stock > 0 && stock <= 10) {
            return new Ultimas(stock);
        } else {
            return new Agotado(stock);
        }
    }

    actualizarStock(nuevaCantidad: number) {
        this.producto.cantidad = nuevaCantidad;
        this.estado = this.definirEstado(nuevaCantidad);
    }

    puedeComprar(): boolean {
        return this.estado.puedeComprar();
    }

    obtenerColor(): string {
        return this.estado.obtenerColor();
    }
    carrito(): string {
        return this.estado.carrito();
    }

}