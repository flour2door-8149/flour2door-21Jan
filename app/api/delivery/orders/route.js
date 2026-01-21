import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get delivery boy's assigned orders
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user?.isDeliveryBoy) {
            return NextResponse.json({ error: 'Not authorized as delivery boy' }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { deliveryBoyId: userId },
                    { 
                        status: 'READY_FOR_PICKUP',
                        deliveryBoyId: null 
                    }
                ]
            },
            include: {
                orderItems: { include: { product: true } },
                address: true,
                user: true,
                store: true
            },
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({ orders })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// Update delivery status
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { orderId, action, location } = await request.json()
        
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user?.isDeliveryBoy) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        let updateData = {}

        switch(action) {
            case 'PICKUP':
                updateData = {
                    status: 'OUT_FOR_DELIVERY',
                    deliveryBoyId: userId,
                    pickedUpAt: new Date()
                }
                break
            case 'DELIVER':
                updateData = {
                    status: 'DELIVERED',
                    deliveredAt: new Date()
                }
                break
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: updateData
        })

        // Update delivery boy location if provided
        if (location) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    currentLocation: location,
                    deliveryStatus: 'BUSY'
                }
            })
        }

        return NextResponse.json({ message: 'Status updated', order })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}