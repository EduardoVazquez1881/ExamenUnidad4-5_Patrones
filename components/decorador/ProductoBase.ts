import { IProductoDecorado } from '@/types/IDecorador';
import { IProductos } from '@/types/IProductos';

export class ProductoBase implements IProductoDecorado {
        constructor(protected producto: IProductos) {}
    
    obtenerInfoCompleta() {
        return {
            id: this.producto.id,
            nombre: this.producto.nombre,
            precioOriginal: this.producto.precio,
            precioFinal: this.getPrecioFinal(),
            descripcionCompleta: this.getDescripcionExtendida(),
            descuentosAplicados: [] as string[],
            serviciosExtra: [] as string[]
        };
    }

    getPrecioFinal(): number {
        return this.producto.precio;
    }

    getDescripcionExtendida(): string {
        return `${this.producto.nombre} - ${this.producto.descripcion} (${this.producto.categoria})`;
    }
};