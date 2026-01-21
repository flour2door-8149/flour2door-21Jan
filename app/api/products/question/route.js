import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Ask a question
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const { productId, question } = await request.json()

        const newQuestion = await prisma.productQuestion.create({
            data: {
                productId,
                userId,
                question
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            }
        })

        return NextResponse.json({ 
            message: 'Question posted successfully', 
            question: newQuestion 
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// Get questions for a product
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        const questions = await prisma.productQuestion.findMany({
            where: { 
                productId,
                isPublic: true
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ questions })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}