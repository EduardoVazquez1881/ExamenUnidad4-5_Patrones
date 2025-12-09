import { IEstados } from "@/types/IEstados";

export class Disponible implements IEstados{
    constructor(private stock: number){}


    puedeComprar(): boolean {
        return true;
    }

    obtenerColor(): string {
        return "green";
    }

    carrito(): string {
        return "Producto agregado al carrito.";
    } 
};