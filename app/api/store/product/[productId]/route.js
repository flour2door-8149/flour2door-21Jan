import imagekit from "@/configs/imageKit"
import prisma from "@/lib/prisma"
import authSeller from "@/middlewares/authSeller"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Update product with images
export async function PUT(request, { params }) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { productId } = params
        const formData = await request.formData()

        const product = await prisma.product.findFirst({
            where: { id: productId, storeId }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Get form data
        const name = formData.get("name")
        const description = formData.get("description")
        const mrp = Number(formData.get("mrp"))
        const price = Number(formData.get("price"))
        const category = formData.get("category")
        const stock = Number(formData.get("stock"))
        const newImages = formData.getAll("newImages")
        const existingImages = JSON.parse(formData.get("existingImages") || "[]")

        let finalImages = [...existingImages]

        // Upload new images if provided
        if (newImages.length > 0) {
            const uploadedImages = await Promise.all(
                newImages.map(async (image) => {
                    if (image.size === 0) return null
                    
                    const buffer = Buffer.from(await image.arrayBuffer())
                    const response = await imagekit.upload({
                        file: buffer,
                        fileName: image.name,
                        folder: "products",
                    })
                    
                    return imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: 'auto' },
                            { format: 'webp' },
                            { width: '1024' }
                        ]
                    })
                })
            )

            finalImages = [...existingImages, ...uploadedImages.filter(Boolean)]
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                mrp,
                price,
                category,
                stock,
                images: finalImages,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({
            message: 'Product updated successfully',
            product: updatedProduct
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// Delete product
export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { productId } = params

        const product = await prisma.product.findFirst({
            where: { id: productId, storeId }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        await prisma.product.delete({
            where: { id: productId }
        })

        return NextResponse.json({
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}