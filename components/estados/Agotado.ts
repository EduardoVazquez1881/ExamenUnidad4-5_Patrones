import { IEstados } from "@/types/IEstados";

export class Agotado implements IEstados{
    constructor(private stock: number){}
    puedeComprar(): boolean {
        return false;
    }
    obtenerColor(): string {
        return "red";
    }
    carrito(): string {
        return "Producto agotado.";
    }
};