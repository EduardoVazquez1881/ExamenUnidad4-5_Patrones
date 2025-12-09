// components/carrito/ProductoCarrito.ts
import { ICarritoItem } from '@/types/ICarritoItems';
import { IProductos } from '@/types/IProductos';

export class ProductoCarrito implements ICarritoItem {
  constructor(
    private producto: IProductos,
    private cantidad: number = 1
  ) {}

  getId(): string {
    return `producto_${this.producto.id}`;
  }

  getNombre(): string {
    return `${this.producto.nombre} (x${this.cantidad})`;
  }

  getPrecio(): number {
    return this.producto.precio * this.cantidad;
  }

  getDescripcion(): string {
    return `${this.producto.descripcion} - ${this.cantidad} unidad(es)`;
  }

  getTipo(): string {
    return 'producto';
  }

  // Métodos específicos de producto
  incrementarCantidad(): void {
    this.cantidad++;
  }

  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  getCantidad(): number {
    return this.cantidad;
  }

  getProductoOriginal(): IProductos {
    return this.producto;
  }
}