import imagekit from "@/configs/imageKit"
import prisma from "@/lib/prisma"
import authSeller from "@/middlewares/authSeller"
import {getAuth} from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

// POST (Add Product)
export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if(!storeId) return NextResponse.json({error: 'not authorized'}, { status: 401 } )

        const formData = await request.formData()
        const name = formData.get("name")
        const description = formData.get("description")
        const mrp = Number(formData.get("mrp"))
        const price = Number(formData.get("price"))
        const category = formData.get("category")
        const stock = Number(formData.get("stock") || 0) // Capture Stock
        const images = formData.getAll("images")

        if(!name || !description || !mrp || !price || !category || images.length < 1){
            return NextResponse.json({error: 'missing product details'}, { status: 400 } )
        }

        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({ file: buffer, fileName: image.name, folder: "products" })
            return imagekit.url({ path: response.filePath, transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: '1024' }] })
        }))

        await prisma.product.create({
             data: { name, description, mrp, price, category, stock, images: imagesUrl, storeId }
        })
         return NextResponse.json({message: "Product added successfully"})
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// GET Products
export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if(!storeId) return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        const products = await prisma.product.findMany({ where: { storeId }})
        return NextResponse.json({products})
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// PUT (Update Product)
export async function PUT(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if(!storeId) return NextResponse.json({error: 'not authorized'}, { status: 401 } )

        const body = await request.json()
        const { id, name, description, mrp, price, stock } = body

        await prisma.product.update({
            where: { id, storeId },
            data: { name, description, mrp, price, stock }
        })

        return NextResponse.json({ message: "Product updated" })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// DELETE Product
export async function DELETE(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if(!storeId) return NextResponse.json({error: 'not authorized'}, { status: 401 } )

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        await prisma.product.delete({ where: { id, storeId } })

        return NextResponse.json({ message: "Product deleted" })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}