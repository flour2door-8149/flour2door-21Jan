import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        // Get Orders
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: { user: true }
        })

        // Get Products Count
        const products = await prisma.product.count({ where: { storeId } })

        // Calculate Totals
        const totalEarnings = orders
            .filter(o => o.isPaid)
            .reduce((acc, order) => acc + order.total, 0)

        // Unique Customers
        const uniqueCustomers = new Set(orders.map(o => o.userId)).size

        // Chart Data (Last 7 days)
        const salesChart = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toLocaleDateString()
            
            const dayRevenue = orders
                .filter(o => new Date(o.createdAt).toLocaleDateString() === dateStr && o.isPaid)
                .reduce((acc, o) => acc + o.total, 0)
            
            return { date: dateStr.slice(0, 5), revenue: dayRevenue } // Returns "MM/DD"
        }).reverse()

        const dashboardData = {
            totalProducts: products,
            totalEarnings,
            totalOrders: orders.length,
            totalCustomers: uniqueCustomers,
            salesChart
        }

        return NextResponse.json({ dashboardData });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}