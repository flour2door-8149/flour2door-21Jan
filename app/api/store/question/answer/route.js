import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Answer a question
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const { questionId, answer } = await request.json()

        const question = await prisma.productQuestion.findUnique({
            where: { id: questionId },
            include: { product: true }
        })

        if (question.product.storeId !== storeId) {
            return NextResponse.json({ error: 'Not authorized for this product' }, { status: 401 })
        }

        const updatedQuestion = await prisma.productQuestion.update({
            where: { id: questionId },
            data: {
                answer,
                answeredBy: storeId,
                answeredAt: new Date()
            }
        })

        return NextResponse.json({ 
            message: 'Answer posted successfully', 
            question: updatedQuestion 
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}