// app/admin/revenue/page.jsx
'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import Image from "next/image"
import { TrendingUp, DollarSign, ShoppingCart, Package, ArrowUpDown } from "lucide-react"

export default function AdminRevenue() {
    const { getToken } = useAuth()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
    
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState(null)
    const [sortBy, setSortBy] = useState('revenue') // revenue, orders, products
    const [sortOrder, setSortOrder] = useState('desc')

    const fetchData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setDashboardData(data.dashboardData)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    const getSortedStores = () => {
        if (!dashboardData) return []
        const stores = [...dashboardData.storeRevenue]
        stores.sort((a, b) => {
            let aVal, bVal
            if (sortBy === 'revenue') {
                aVal = a.revenue
                bVal = b.revenue
            } else if (sortBy === 'orders') {
                aVal = a.totalOrders
                bVal = b.totalOrders
            } else if (sortBy === 'products') {
                aVal = a.totalProducts
                bVal = b.totalProducts
            }
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
        })
        return stores
    }

    if (loading) return <Loading />

    const sortedStores = getSortedStores()

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl mb-6">Store <span className="text-slate-800 font-medium">Revenue</span></h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">
                                {currency}{parseFloat(dashboardData.revenue).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total Orders</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">
                                {dashboardData.totalOrders}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ShoppingCart className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total Products</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">
                                {dashboardData.totalProducts}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Package className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Active Stores</p>
                            <p className="text-2xl font-bold text-slate-800 mt-1">
                                {dashboardData.totalStores}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <TrendingUp className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Revenue Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">Detailed Store Performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left">Store</th>
                                <th className="px-4 py-3 text-left">Username</th>
                                <th 
                                    className="px-4 py-3 text-right cursor-pointer hover:bg-slate-100"
                                    onClick={() => handleSort('products')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Products
                                        <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-right cursor-pointer hover:bg-slate-100"
                                    onClick={() => handleSort('orders')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Orders
                                        <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-right cursor-pointer hover:bg-slate-100"
                                    onClick={() => handleSort('revenue')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Revenue
                                        <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-center">Avg Order</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {sortedStores.map((store, index) => (
                                <tr key={store.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Image 
                                                    src={store.logo} 
                                                    alt={store.name} 
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                                {index < 3 && (
                                                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-medium text-slate-800">{store.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">@{store.username}</td>
                                    <td className="px-4 py-4 text-right font-medium">{store.totalProducts}</td>
                                    <td className="px-4 py-4 text-right font-medium">{store.totalOrders}</td>
                                    <td className="px-4 py-4 text-right">
                                        <span className="font-semibold text-green-600">
                                            {currency}{store.revenue.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {currency}{store.totalOrders > 0 
                                            ? (store.revenue / store.totalOrders).toFixed(2) 
                                            : '0.00'}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            store.isActive 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {store.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 mt-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Category Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(dashboardData.categoryBreakdown).map(([category, data]) => (
                        <div key={category} className="border rounded-lg p-4">
                            <p className="text-sm text-slate-500 mb-2">{category}</p>
                            <div className="flex items-baseline gap-2 mb-1">
                                <p className="text-2xl font-bold text-slate-800">{data.count}</p>
                                <p className="text-sm text-slate-500">products</p>
                            </div>
                            <p className="text-xs text-slate-400">{data.stores} stores</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}