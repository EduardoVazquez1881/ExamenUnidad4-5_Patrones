export interface IProductoDecorado {
    obtenerInfoCompleta(): {
        id: number;
        nombre: string;
        precioOriginal: number;
        precioFinal: number;
        descripcionCompleta: string;
        descuentosAplicados: string[];
        serviciosExtra: string[];
    };
    getPrecioFinal(): number;
    getDescripcionExtendida(): string;
}