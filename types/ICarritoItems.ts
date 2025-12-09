export interface ICarritoItem {
  getId(): string;
  getNombre(): string;
  getPrecio(): number;
  getDescripcion(): string;
  getTipo(): string;
  agregar?(item: ICarritoItem): void;
  remover?(itemId: string): void;
  obtenerHijos?(): ICarritoItem[];
}