import Image from 'next/image';
import { IProductos } from '@/types/IProductos';
import { IProductoDecorado } from '@/types/IProductoDecorado';

interface ProductCardProps {
  producto: IProductos;
  productoDecorado?: IProductoDecorado;
  onAgregarAlCarrito?: () => void;
  deshabilitado?: boolean;
  cantidadEnCarrito?: number;
}

export function ProductCard({ producto, productoDecorado, onAgregarAlCarrito, deshabilitado, cantidadEnCarrito }: ProductCardProps) {
  return (
    <div 
      className="group flex flex-col h-full bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
    >
      {/* Imagen */}
      <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
        {producto.imagen && (
          <Image 
            src={producto.imagen} 
            alt={producto.nombre} 
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-grow p-4">
        {/* Categoría */}
        <span className="inline-block bg-purple-600/50 text-purple-200 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 w-fit">
          {producto.categoria}
        </span>

        {/* Nombre - altura fija */}
        <h3 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors h-10">
          {producto.nombre}
        </h3>

        {/* Descripción - altura fija */}
        <p className="text-gray-300 text-xs mb-3 line-clamp-2 h-8 flex-grow">
          {producto.descripcion}
        </p>

        {/* Footer con precio y stock - siempre al final */}
        <div className="pt-3 border-t border-white/10 mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div className="flex-1">
              <p className="text-gray-400 text-xs mb-0.5">Precio</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {productoDecorado && 
                  productoDecorado.conDescuentoNavidad.precioFinal !== producto.precio ? (
                  <>
                    <span className="text-xs font-bold text-gray-400 line-through">
                      ${producto.precio.toFixed(2)}
                    </span>
                    <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      ${productoDecorado.conDescuentoNavidad.precioFinal.toFixed(2)}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      -15%
                    </span>
                  </>
                ) : (
                  <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    ${producto.precio.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right ml-2">
              <p className="text-gray-400 text-xs mb-0.5">Stock</p>
              <p className={`font-semibold text-xs px-2 py-1 rounded ${
                producto.cantidad > 10 ? 'bg-green-500/30 text-green-400' : 
                producto.cantidad > 0 ? 'bg-yellow-500/30 text-yellow-400' : 
                'bg-red-500/30 text-red-400'
              }`}>
                {producto.cantidad}
              </p>
            </div>
          </div>
        </div>

        {/* Botón */}
        <button 
          onClick={onAgregarAlCarrito}
          disabled={producto.cantidad === 0 || deshabilitado}
          className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-1.5 rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
          {producto.cantidad === 0 
            ? 'Sin stock' 
            : deshabilitado 
            ? `Máximo en carrito (${cantidadEnCarrito})` 
            : cantidadEnCarrito && cantidadEnCarrito > 0 
            ? `Agregar más (${cantidadEnCarrito} en carrito)` 
            : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
