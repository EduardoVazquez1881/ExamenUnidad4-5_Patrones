import {ProductoBase} from './ProductoBase';

export class DescuentosNavidad extends ProductoBase {
    private descuento: number = 15;
    private nombreDescuento: string = "Descuento de Navidad";

    getPrecioFinal(): number {
        // Solo aplicar descuento a electrónica
        if (this.producto.categoria.toLowerCase() !== 'electronica') {
            return this.producto.precio;
        }

        const precioBase = this.producto.precio;
        const descuento = precioBase * (this.descuento / 100);
        return precioBase - descuento;
    }
    
    getDescripcionExtendida(): string {
        const baseDesc = super.getDescripcionExtendida();
        if (this.producto.categoria.toLowerCase() !== 'electronica') {
            return baseDesc;
        }
        return `${baseDesc} | ${this.nombreDescuento} aplicado: -${this.descuento}%`;
    }
    
    obetenerInfoCompleta() {
        const infoBase = super.obtenerInfoCompleta();
        if (this.producto.categoria.toLowerCase() === 'electronica') {
            const value: string = `${this.nombreDescuento} (-${this.descuento}%)`
            infoBase.descuentosAplicados.push(value);
        }
        return infoBase;
    }
}