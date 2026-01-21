'use client'

import { useState, useEffect } from 'react'
import { MapPin, Package, CheckCircle, Clock, Navigation, Phone, User } from 'lucide-react'

export default function DeliveryDashboard() {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [currentLocation, setCurrentLocation] = useState({ lat: 19.8762, lng: 75.3433 }) // Aurangabad
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        // Mock data - replace with API
        const mockOrders = [
            {
                id: '1',
                orderNumber: 'ORD-2025-001',
                customer: { name: 'John Doe', phone: '+91 9876543210' },
                address: {
                    street: '123 Main St',
                    city: 'Aurangabad',
                    lat: 19.8760,
                    lng: 75.3433
                },
                status: 'READY_FOR_PICKUP',
                total: 450,
                store: { name: 'Flour2Door Store', lat: 19.8762, lng: 75.3435 },
                orderDate: '2025-01-21',
                items: [
                    { name: 'Wheat Flour', quantity: 2 }
                ]
            },
            {
                id: '2',
                orderNumber: 'ORD-2025-002',
                customer: { name: 'Jane Smith', phone: '+91 9876543211' },
                address: {
                    street: '456 Park Ave',
                    city: 'Aurangabad',
                    lat: 19.8770,
                    lng: 75.3440
                },
                status: 'OUT_FOR_DELIVERY',
                total: 320,
                store: { name: 'Flour2Door Store', lat: 19.8762, lng: 75.3435 },
                orderDate: '2025-01-20',
                items: [
                    { name: 'Jowar Flour', quantity: 1 }
                ]
            },
            {
                id: '3',
                orderNumber: 'ORD-2025-003',
                customer: { name: 'Bob Johnson', phone: '+91 9876543212' },
                address: {
                    street: '789 Oak Rd',
                    city: 'Aurangabad',
                    lat: 19.8750,
                    lng: 75.3420
                },
                status: 'READY_FOR_PICKUP',
                total: 590,
                store: { name: 'Flour2Door Store', lat: 19.8762, lng: 75.3435 },
                orderDate: '2025-01-20',
                items: [
                    { name: 'Multi-grain Flour', quantity: 3 }
                ]
            }
        ]
        setOrders(mockOrders)

        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => console.error('Location error:', error)
            )
        }
    }, [])

    const categorizedOrders = {
        toPickup: orders.filter(o => o.status === 'READY_FOR_PICKUP'),
        withMe: orders.filter(o => o.status === 'OUT_FOR_DELIVERY'),
        yesterdayPending: orders.filter(o => {
            const orderDate = new Date(o.orderDate)
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            return orderDate.toDateString() === yesterday.toDateString() && 
                   o.status !== 'DELIVERED'
        })
    }

    const filteredOrders = filter === 'all' 
        ? orders 
        : filter === 'pickup' 
        ? categorizedOrders.toPickup
        : filter === 'withMe'
        ? categorizedOrders.withMe
        : categorizedOrders.yesterdayPending

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => 
            o.id === orderId ? { ...o, status: newStatus } : o
        ))
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        return (R * c).toFixed(1)
    }

    const openInGoogleMaps = (lat, lng) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
                        <p className="text-sm text-gray-600">Manage your deliveries</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                            <Navigation className="text-green-600" size={20} />
                            <span className="text-sm font-medium">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Orders List */}
                <div className="w-96 bg-white border-r overflow-y-auto">
                    {/* Filter Tabs */}
                    <div className="sticky top-0 bg-white border-b p-4 space-y-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                                filter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            All Orders ({orders.length})
                        </button>
                        <button
                            onClick={() => setFilter('pickup')}
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                                filter === 'pickup' 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>To Pickup</span>
                                <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                                    {categorizedOrders.toPickup.length}
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setFilter('withMe')}
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                                filter === 'withMe' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>With Me</span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                                    {categorizedOrders.withMe.length}
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setFilter('yesterday')}
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                                filter === 'yesterday' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>Yesterday's Pending</span>
                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                    {categorizedOrders.yesterdayPending.length}
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Orders List */}
                    <div className="p-4 space-y-3">
                        {filteredOrders.map(order => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                    selectedOrder?.id === order.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {order.orderNumber}
                                        </h3>
                                        <p className="text-sm text-gray-600">{order.customer.name}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        order.status === 'READY_FOR_PICKUP'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {order.status === 'READY_FOR_PICKUP' ? 'Pickup' : 'Delivering'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <MapPin size={14} />
                                    <span className="line-clamp-1">{order.address.street}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <Package size={14} />
                                    <span>{order.items.length} items</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="font-medium text-gray-800">₹{order.total}</span>
                                </div>

                                {selectedOrder?.id === order.id && (
                                    <div className="flex gap-2 mt-3">
                                        {order.status === 'READY_FOR_PICKUP' ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')
                                                }}
                                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                            >
                                                Picked Up
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    updateOrderStatus(order.id, 'DELIVERED')
                                                }}
                                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                window.open(`tel:${order.customer.phone}`)
                                            }}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Phone size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <Package size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No orders in this category</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map View */}
                <div className="flex-1 relative">
                    {selectedOrder ? (
                        <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-8">
                            {/* Map Placeholder */}
                            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Order Details
                                    </h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedOrder.status === 'READY_FOR_PICKUP'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {selectedOrder.status === 'READY_FOR_PICKUP' ? 'Ready for Pickup' : 'Out for Delivery'}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <User className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-800">{selectedOrder.customer.name}</p>
                                            <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-800">Delivery Address</p>
                                            <p className="text-sm text-gray-600">
                                                {selectedOrder.address.street}, {selectedOrder.address.city}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Distance: {calculateDistance(
                                                    currentLocation.lat,
                                                    currentLocation.lng,
                                                    selectedOrder.address.lat,
                                                    selectedOrder.address.lng
                                                )} km away
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Package className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium text-gray-800">Items</p>
                                            {selectedOrder.items.map((item, i) => (
                                                <p key={i} className="text-sm text-gray-600">
                                                    {item.name} × {item.quantity}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => openInGoogleMaps(
                                        selectedOrder.address.lat,
                                        selectedOrder.address.lng
                                    )}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                    <Navigation size={20} />
                                    Navigate with Google Maps
                                </button>

                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800 text-center">
                                        <strong>Note:</strong> For live map integration, enable Google Maps API with your key
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MapPin size={64} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Select an order to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-t px-6 py-3">
                <div className="flex justify-around">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                            {categorizedOrders.toPickup.length}
                        </p>
                        <p className="text-xs text-gray-600">To Pickup</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {categorizedOrders.withMe.length}
                        </p>
                        <p className="text-xs text-gray-600">With Me</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.status === 'DELIVERED').length}
                        </p>
                        <p className="text-xs text-gray-600">Delivered Today</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                            {categorizedOrders.yesterdayPending.length}
                        </p>
                        <p className="text-xs text-gray-600">Yesterday Pending</p>
                    </div>
                </div>
            </div>
        </div>
    )
}