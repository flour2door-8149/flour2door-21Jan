import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deductInventory } from "@/lib/utils/inventory";
import { sendSMS, sendEmail } from "@/lib/utils/notifications";

export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { orderId } = await request.json()

        const order = await prisma.order.findUnique({
            where: { id: orderId, storeId },
            include: { 
                orderItems: { include: { product: true } },
                user: true,
                address: true
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        if (order.status !== 'ORDER_PLACED') {
            return NextResponse.json({ 
                error: 'Order already processed' 
            }, { status: 400 })
        }

        // Deduct inventory
        await deductInventory(order.orderItems, storeId)

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { 
                status: 'ACCEPTED',
                updatedAt: new Date()
            }
        })

        // Send confirmation to customer
        await sendSMS(
            order.address.phone,
            `Your order ${order.orderNumber} has been accepted and is being prepared. Thank you for shopping with Flour2Door!`
        )

        await sendEmail(
            order.user.email,
            'Order Accepted',
            `Your order ${order.orderNumber} has been accepted.`
        )

        return NextResponse.json({
            message: "Order accepted successfully",
            order: updatedOrder
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            error: error.message 
        }, { status: 400 })
    }
}