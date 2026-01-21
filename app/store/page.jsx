'use client'
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon, Download, Users } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'

export default function Dashboard() {
    const {getToken} = useAuth()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        totalCustomers: 0,
        salesChart: []
    })

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/dashboard', {headers: { Authorization: `Bearer ${token}` }})
            setData(data.dashboardData)
        } catch (error) {
            toast.error("Failed to load dashboard data")
        } finally {
            setLoading(false)
        }
    }

    const exportData = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.salesChart);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales History");
        XLSX.writeFile(workbook, "store_analytics.xlsx");
    }

    useEffect(() => { fetchDashboardData() }, [])

    if (loading) return <Loading />

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="flex items-center gap-5 border border-slate-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon size={26} className="text-white" />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <b className="text-2xl font-bold text-slate-800">{value}</b>
            </div>
        </div>
    )

    return (
        <div className="mb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl text-slate-600">Seller <span className="text-slate-900 font-bold">Dashboard</span></h1>
                <button onClick={exportData} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm shadow-sm">
                    <Download size={18}/> Export Excel
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Revenue" value={`${currency}${data.totalEarnings}`} icon={CircleDollarSignIcon} color="bg-green-500" />
                <StatCard title="Total Orders" value={data.totalOrders} icon={TagsIcon} color="bg-blue-500" />
                <StatCard title="Products" value={data.totalProducts} icon={ShoppingBasketIcon} color="bg-purple-500" />
                <StatCard title="Customers" value={data.totalCustomers} icon={Users} color="bg-orange-500" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
                <h3 className="text-lg font-bold mb-6 text-slate-700">Sales Overview (Last 7 Days)</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.salesChart}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}