import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Update inventory (restock)
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { productId, quantity, type, reason } = await request.json()

        const product = await prisma.product.findFirst({
            where: { id: productId, storeId }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Update stock
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                stock: type === 'add' 
                    ? { increment: quantity }
                    : { decrement: quantity },
                lastRestocked: type === 'add' ? new Date() : product.lastRestocked
            }
        })

        // Record in history
        await prisma.inventoryHistory.create({
            data: {
                productId,
                storeId,
                quantity: type === 'add' ? quantity : -quantity,
                type: type === 'add' ? 'restock' : 'adjustment',
                reason