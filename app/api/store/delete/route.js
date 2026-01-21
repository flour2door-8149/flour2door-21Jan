import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Request store deletion
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const { reason } = await request.json()

        // Check for pending orders
        const pendingOrders = await prisma.order.count({
            where: {
                storeId,
                status: {
                    notIn: ['DELIVERED', 'REJECTED', 'CANCELLED']
                }
            }
        })

        if (pendingOrders > 0) {
            return NextResponse.json({ 
                error: `Cannot delete store with ${pendingOrders} pending orders. Please complete or cancel all orders first.` 
            }, { status: 400 })
        }

        // Create deletion request
        const deletionRequest = await prisma.storeDeletionRequest.create({
            data: {
                storeId,
                reason
            }
        })

        return NextResponse.json({ 
            message: 'Store deletion request submitted. Admin will review it shortly.',
            request: deletionRequest
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}