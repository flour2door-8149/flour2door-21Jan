import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if(!storeId) return NextResponse.json({error: 'not authorized'}, { status: 401 } )

        // Get products owned by store
        const products = await prisma.product.findMany({ where: { storeId }, select: { id: true } })
        const productIds = products.map(p => p.id)

        const reviews = await prisma.rating.findMany({
            where: { productId: { in: productIds } },
            include: { user: true, product: { select: { name: true, images: true } } },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ reviews })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if(!storeId) return NextResponse.json({error: 'not authorized'}, { status: 401 } )

        const { reviewId, response } = await request.json()

        await prisma.rating.update({
            where: { id: reviewId },
            data: { 
                storeResponse: response,
                respondedAt: new Date()
            }
        })

        return NextResponse.json({ message: "Reply posted" })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}