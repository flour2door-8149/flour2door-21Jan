import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get deletion requests
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const requests = await prisma.storeDeletionRequest.findMany({
            where: { status: 'pending' },
            include: {
                store: {
                    include: {
                        user: true,
                        Product: true,
                        Order: true
                    }
                }
            },
            orderBy: { requestedAt: 'desc' }
        })

        return NextResponse.json({ requests })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// Approve/reject deletion
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const { requestId, status } = await request.json()

        const deletionRequest = await prisma.storeDeletionRequest.findUnique({
            where: { id: requestId }
        })

        if (status === 'approved') {
            // Delete all store data
            await prisma.store.delete({
                where: { id: deletionRequest.storeId }
            })
        }

        await prisma.storeDeletionRequest.update({
            where: { id: requestId },
            data: {
                status,
                processedAt: new Date(),
                processedBy: userId
            }
        })

        return NextResponse.json({ 
            message: `Store deletion ${status}` 
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}