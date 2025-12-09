import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { cantidad } = await request.json();
        const { id: productId } = await params;

        console.log('Actualizando producto:', productId, 'nueva cantidad:', cantidad);

        const pool = await connectDB();
        
        //actualizar  cantidad del producto
        const updateResult = await pool.request()
            .input('cantidad', cantidad)
            .input('id', parseInt(productId))
            .query('UPDATE productos SET cantidad = @cantidad WHERE id = @id');

        console.log('Resultado de actualización:', updateResult);

        //obtener producto actualizado
        const result = await pool.request()
            .input('id', parseInt(productId))
            .query('SELECT * FROM productos WHERE id = @id');

        return NextResponse.json(result.recordset[0], { status: 200 });
    } catch (error) {
        console.error('Error en PATCH /api/products/[id]:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el producto', details: error },
            { status: 500 }
        );
    }
}
