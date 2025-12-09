'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShoppingCart, X } from 'lucide-react';
import { IProductos } from '@/types/IProductos';
import { DescuentosNavidad } from '@/components/decorador/Descuentos';
import { ProductoBase } from '@/components/decorador/ProductoBase';
import { IProductoDecorado as ProductoDecorado } from '@/types/IProductoDecorado';
import { ProductoConEstado } from '@/components/ProductoConEstado';
import { ProductCard } from '@/components/UI/ProductCard';



export default function DatabaseTestComponent() {
  const [productos, setProductos] = useState<IProductos[]>([]);
  const [productosDecorados, setProductosDecorados] = useState<ProductoDecorado[]>([]);
  const [productosLoading, setProductosLoading] = useState(false);
  const [productosError, setProductosError] = useState<string | null>(null);
  const [productosConEstado, setProductosConEstado] = useState<ProductoConEstado[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [carrito, setCarrito] = useState<Map<number, { producto: IProductos; cantidad: number; precioFinal: number }>>(new Map());
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const agregarAlCarrito = (producto: IProductos) => {
    // Obtener el precio con descuento del decorador
    const productoDecorado = productosDecorados.find(p => p.original.id === producto.id);
    const precioFinal = productoDecorado?.conDescuentoNavidad.precioFinal || producto.precio;
    
    setCarrito(prev => {
      const nuevoCarrito = new Map(prev);
      const itemExistente = nuevoCarrito.get(producto.id);
      
      // Validar que no se exceda el stock disponible
      if (itemExistente && itemExistente.cantidad >= producto.cantidad) {
        return prev; // No agregar si ya alcanzó el máximo
      }
      
      if (nuevoCarrito.has(producto.id)) {
        const item = nuevoCarrito.get(producto.id)!;
        nuevoCarrito.set(producto.id, { ...item, cantidad: item.cantidad + 1 });
      } else {
        nuevoCarrito.set(producto.id, { producto, cantidad: 1, precioFinal });
      }
      return nuevoCarrito;
    });
  };

  const removerDelCarrito = (productoId: number) => {
    setCarrito(prev => {
      const nuevoCarrito = new Map(prev);
      nuevoCarrito.delete(productoId);
      return nuevoCarrito;
    });
  };

  const totalCarrito = Array.from(carrito.values()).reduce(
    (total, item) => total + (item.precioFinal * item.cantidad),
    0
  );

  const procesarCompra = async () => {
    if (carrito.size === 0) return;

    try {
      // Actualizar la cantidad de cada producto en la BD
      const actualizaciones = Array.from(carrito.values()).map(async (item) => {
        const nuevaCantidad = item.producto.cantidad - item.cantidad;
        
        console.log('Actualizando producto ID:', item.producto.id, 'Nueva cantidad:', nuevaCantidad);
        
        const response = await fetch(`/api/products/${item.producto.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cantidad: nuevaCantidad })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error en respuesta:', errorData);
          throw new Error(`Error al actualizar producto: ${JSON.stringify(errorData)}`);
        }
        return response.json();
      });

      await Promise.all(actualizaciones);

      //limpiar el carrito
      setCarrito(new Map());
      setMostrarCarrito(false);
      //rrecargar productos actualizados
      await consultarProductos();

      alert('¡Compra realizada con éxito!');
    } catch (error) {
      console.error('Error al procesar compra:', error);
      alert(`Error al procesar la compra: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const consultarProductos = async () => {
    try {
      setProductosLoading(true);
      setProductosError(null);
      
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: IProductos[] = await response.json();
      setProductos(data);

      //bbtener categorías unicas
      const categoriasUnicas = Array.from(new Set(data.map(p => p.categoria)));
      setCategorias(categoriasUnicas);

      //decorador d productos
      const decorados = data.map(prod => {
        const productoBase = new ProductoBase(prod);
        const desNavidad = new DescuentosNavidad(prod);
        return {
          original: prod,
          base: productoBase.obtenerInfoCompleta(),
          conDescuentoNavidad: desNavidad.obtenerInfoCompleta()
        };
      });

      const productosConEstado = data.map(prod => new ProductoConEstado(prod)); 

      //actualizar el usestate
      setProductosConEstado(productosConEstado);

      console.log('Productos con estado:', productosConEstado);
      
      setProductosDecorados(decorados);
      console.log('Productos decorados:', decorados);

    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setProductosError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setProductosLoading(false);
    }
  };

  useEffect(() => {
    consultarProductos();
  }, []);

  // Función para obtener productos por categoría
  const productosPorCategoria = (categoria: string) => {
    return productos.filter(p => p.categoria === categoria);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 text-center">
            Tienda de Productos
          </h1>
          <p className="text-gray-300 text-sm sm:text-base text-center">
            Descubre nuestros mejores productos
          </p>
        </div>
        
        {/* Loading */}
        {productosLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin text-white w-8 h-8" />
            <span className="ml-3 text-white">Cargando productos...</span>
          </div>
        )}

        {/* Error */}
        {productosError && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-sm">
            {productosError}
          </div>
        )}
        
        {/* Categorías */}
        {!productosLoading && !productosError && categorias.length > 0 && (
          <div className="space-y-12">
            {categorias.map((categoria) => (
              <div key={categoria} className="space-y-4">
                {/* Título de categoría */}
                <div className="border-b border-white/20 pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white capitalize flex items-center gap-3 flex-wrap">
                    {categoria}
                    {categoria.toLowerCase() === 'electronica' && (
                      <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full">
                        Oferta por Navidad
                      </span>
                    )}
                    <span className="text-sm text-gray-400 font-normal">
                      ({productosPorCategoria(categoria).length} productos)
                    </span>
                  </h2>
                </div>

                {/* Grid de productos por categoría */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {productosPorCategoria(categoria).map((producto) => {
                    const cantidadEnCarrito = carrito.get(producto.id)?.cantidad || 0;
                    const puedeAgregar = cantidadEnCarrito < producto.cantidad;
                    
                    return (
                      <ProductCard 
                        key={producto.id}
                        producto={producto}
                        productoDecorado={productosDecorados.find(p => p.original.id === producto.id)}
                        onAgregarAlCarrito={() => puedeAgregar && agregarAlCarrito(producto)}
                        deshabilitado={!puedeAgregar}
                        cantidadEnCarrito={cantidadEnCarrito}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin productos */}
        {!productosLoading && !productosError && productos.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-300 text-lg">No hay productos disponibles</p>
          </div>
        )}
      </div>

      {/* Carrito flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
          className="relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
        >
          <ShoppingCart size={24} />
          {carrito.size > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {carrito.size}
            </span>
          )}
        </button>

        {mostrarCarrito && (
          <div className="absolute bottom-20 right-0 w-80 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Mi Carrito</h3>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {carrito.size === 0 ? (
              <p className="text-gray-300 text-center py-8">Tu carrito está vacío</p>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-2 mb-4">
                  {Array.from(carrito.values()).map((item) => {
                    const tieneDescuento = item.precioFinal < item.producto.precio;
                    
                    return (
                      <div key={item.producto.id} className="bg-white/5 rounded-lg p-2 flex justify-between items-center border border-white/10">
                        <div className="flex-grow">
                          <p className="text-white text-sm font-semibold line-clamp-1">{item.producto.nombre}</p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-gray-400">x{item.cantidad}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              item.producto.cantidad > 10 
                                ? 'bg-green-500/30 text-green-400' 
                                : item.producto.cantidad > 0 
                                ? 'bg-yellow-500/30 text-yellow-400' 
                                : 'bg-red-500/30 text-red-400'
                            }`}>
                              {item.producto.cantidad > 0 ? 'Disponible' : 'Agotado'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            {tieneDescuento && (
                              <p className="text-gray-400 text-xs line-through">${item.producto.precio.toFixed(2)}</p>
                            )}
                            <p className={`font-bold text-sm ${tieneDescuento ? 'text-green-400' : 'text-green-400'}`}>
                              ${(item.precioFinal * item.cantidad).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removerDelCarrito(item.producto.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-white font-bold mb-3">
                    <span>Total:</span>
                    <span className="text-green-400">${totalCarrito.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={procesarCompra}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition-all">
                    Pagar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}