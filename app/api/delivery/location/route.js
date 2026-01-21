import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Update delivery boy's location
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { lat, lng } = await request.json()

        await prisma.user.update({
            where: { id: userId },
            data: {
                currentLocation: {
                    lat,
                    lng,
                    timestamp: new Date().toISOString()
                }
            }
        })

        return NextResponse.json({ message: 'Location updated' })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// Get delivery boy locations (for store to track)
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        
        // Verify store owner
        const store = await prisma.store.findUnique({
            where: { userId }
        })

        if (!store) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        // Get all delivery boys with current orders
        const deliveryBoys = await prisma.user.findMany({
            where: {
                isDeliveryBoy: true,
                deliveryOrders: {
                    some: {
                        storeId: store.id,
                        status: 'OUT_FOR_DELIVERY'
                    }
                }
            },
            select: {
                id: true,
                name: true,
                currentLocation: true,
                deliveryStatus: true,
                deliveryOrders: {
                    where: {
                        storeId: store.id,
                        status: 'OUT_FOR_DELIVERY'
                    },
                    include: {
                        address: true
                    }
                }
            }
        })

        return NextResponse.json({ deliveryBoys })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}