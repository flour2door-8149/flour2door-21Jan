import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendSMS, sendEmail } from "@/lib/utils/notifications";

export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { orderId, reason } = await request.json()

        if (!reason || reason.trim().length < 10) {
            return NextResponse.json({ 
                error: 'Please provide a detailed reason (minimum 10 characters)' 
            }, { status: 400 })
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId, storeId },
            include: { user: true, address: true }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Initiate refund if paid online
        let refundStatus = 'NOT_INITIATED'
        
        if (order.paymentMethod === 'STRIPE' && order.isPaid) {
            try {
                const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
                
                // Find payment intent from order
                const sessions = await stripe.checkout.sessions.list({
                    limit: 100,
                })
                
                const session = sessions.data.find(s => 
                    s.metadata?.orderIds?.includes(orderId)
                )

                if (session && session.payment_intent) {
                    await stripe.refunds.create({
                        payment_intent: session.payment_intent,
                        reason: 'requested_by_customer'
                    })
                    refundStatus = 'REFUND_INITIATED'
                }
            } catch (refundError) {
                console.error('Refund error:', refundError)
            }
        }

        // Update order
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { 
                status: 'REJECTED',
                rejectionReason: reason,
                refundStatus,
                updatedAt: new Date()
            }
        })

        // Notify customer
        await sendSMS(
            order.address.phone,
            `Unfortunately, your order ${order.orderNumber} has been rejected. Reason: ${reason}. ${order.isPaid ? 'Refund will be processed within 5-7 business days.' : ''}`
        )

        await sendEmail(
            order.user.email,
            'Order Rejected',
            `Your order ${order.orderNumber} has been rejected. Reason: ${reason}`
        )

        return NextResponse.json({
            message: "Order rejected successfully",
            order: updatedOrder
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            error: error.message 
        }, { status: 400 })
    }
}