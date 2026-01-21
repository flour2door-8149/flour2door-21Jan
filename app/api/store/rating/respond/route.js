import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const { ratingId, response } = await request.json()

        const rating = await prisma.rating.findUnique({
            where: { id: ratingId },
            include: { product: true }
        })

        if (rating.product.storeId !== storeId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const updatedRating = await prisma.rating.update({
            where: { id: ratingId },
            data: {
                storeResponse: response,
                respondedAt: new Date(),
                respondedBy: storeId
            }
        })

        return NextResponse.json({ 
            message: 'Response posted successfully', 
            rating: updatedRating 
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}