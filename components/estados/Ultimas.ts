import { IEstados } from "@/types/IEstados";

export class Ultimas implements IEstados{
    constructor(private stock: number){}
    puedeComprar(): boolean {
        return true;
    }
    obtenerColor(): string {
        return "orange";
    }
    carrito(): string {
        return `Ultimas ${this.stock} unidades disponibles. ¡Apresúrate!`;
    }
};