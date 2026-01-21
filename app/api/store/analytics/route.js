import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const timeRange = searchParams.get('timeRange') || '7d'

        // Calculate date range
        const now = new Date()
        let startDate = new Date()
        
        switch(timeRange) {
            case '7d':
                startDate.setDate(now.getDate() - 7)
                break
            case '30d':
                startDate.setDate(now.getDate() - 30)
                break
            case '90d':
                startDate.setDate(now.getDate() - 90)
                break
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1)
                break
        }

        // Get orders
        const orders = await prisma.order.findMany({
            where: {
                storeId,
                createdAt: {
                    gte: startDate
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        // Get products
        const products = await prisma.product.findMany({
            where: { storeId }
        })

        // Get ratings
        const ratings = await prisma.rating.findMany({
            where: {
                productId: {
                    in: products.map(p => p.id)
                }
            },
            include: {
                user: true,
                product: true
            }
        })

        // Calculate metrics
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
        const totalOrders = orders.length
        const totalProducts = products.length
        
        const uniqueCustomers = new Set(orders.map(o => o.userId))
        const totalCustomers = uniqueCustomers.size

        // Sales by day
        const salesByDay = {}
        orders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0]
            if (!salesByDay[date]) {
                salesByDay[date] = { revenue: 0, orders: 0 }
            }
            salesByDay[date].revenue += order.total
            salesByDay[date].orders += 1
        })

        // Order status distribution
        const ordersByStatus = {}
        orders.forEach(order => {
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1
        })

        // Top products
        const productSales = {}
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        name: item.product.name,
                        sales: 0,
                        revenue: 0
                    }
                }
                productSales[item.productId].sales += item.quantity
                productSales[item.productId].revenue += item.price * item.quantity
            })
        })

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5)

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            totalProducts,
            totalCustomers,
            salesByDay: Object.entries(salesByDay).map(([date, data]) => ({
                date,
                ...data
            })),
            ordersByStatus: Object.entries(ordersByStatus).map(([status, count]) => ({
                name: status,
                value: count
            })),
            topProducts,
            orderHistory: orders.slice(0, 10).map(order => ({
                id: order.orderNumber,
                customer: order.user?.name || 'Guest',
                amount: order.total,
                status: order.status,
                date: order.createdAt.toISOString().split('T')[0]
            })),
            ratings
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}