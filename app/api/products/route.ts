import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import type { IProductos } from "@/types/IProductos";

export async function GET() {
    try {
        // Conectar a la base de datos usando tu Singleton
        const pool = await connectDB();
        const result = await pool.request().query('select * from productos;');
        const productos: IProductos[] = result.recordset;        
        return NextResponse.json(productos, { status: 200 });
    } catch (error) {
        console.error('Error en GET /api/repository:', error);
    }
}
