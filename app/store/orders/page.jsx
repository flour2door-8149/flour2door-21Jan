'use client'
import { useEffect, useState } from "react"
import { Bell, Download, Eye, X, MessageSquare } from "lucide-react"
import { downloadInvoice, printInvoice } from '@/lib/pdf/invoiceGenerator'
import { printPackingSlip } from '@/lib/pdf/packingSlipGenerator'
import { exportOrdersToExcel } from '@/lib/export/excelExport'

export default function StoreOrdersEnhanced() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [showRejectModal, setShowRejectModal] = useState(null)
    const [filter, setFilter] = useState('all')
    const [notification, setNotification] = useState(false)

    const currency = '$'

    const orderStatuses = {
        'ORDER_PLACED': { label: 'Order Placed', color: 'bg-blue-100 text-blue-800' },
        'ACCEPTED': { label: 'Accepted', color: 'bg-green-100 text-green-800' },
        'PROCESSING': { label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
        'READY_FOR_PICKUP': { label: 'Ready for Pickup', color: 'bg-purple-100 text-purple-800' },
        'OUT_FOR_DELIVERY': { label: 'Out for Delivery', color: 'bg-indigo-100 text-indigo-800' },
        'DELIVERED': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
        'REJECTED': { label: 'Rejected', color: 'bg-red-100 text-red-800' },
        'REFUND_INITIATED': { label: 'Refund Initiated', color: 'bg-orange-100 text-orange-800' },
        'REFUNDED': { label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
    }

    const fetchOrders = async () => {
        setLoading(true)
        // Mock data
        const mockOrders = [
            {
                id: '1',
                orderNumber: 'ORD-2025-001',
                customer: { name: 'John Doe', phone: '+91 9876543210', email: 'john@example.com' },
                total: 450,
                paymentMethod: 'STRIPE',
                isPaid: true,
                status: 'ORDER_PLACED',
                createdAt: new Date().toISOString(),
                address: {
                    name: 'John Doe',
                    street: '123 Main St',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zip: '400001',
                    phone: '+91 9876543210'
                },
                orderItems: [
                    {
                        product: { 
                            name: 'Wheat Flour', 
                            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150'] 
                        },
                        quantity: 2,
                        price: 90
                    },
                    {
                        product: { 
                            name: 'Jowar Flour', 
                            images: ['https://images.unsplash.com/photo-1599909533253-85f5e1c29ff1?w=150'] 
                        },
                        quantity: 3,
                        price: 90
                    }
                ]
            }
        ]
        setOrders(mockOrders)
        setLoading(false)
    }

    const playNotificationSound = () => {
        // Notification sound would play here
        setNotification(true)
        setTimeout(() => setNotification(false), 3000)
    }

    const updateOrderStatus = async (orderId, status) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId ? { ...order, status } : order
            )
        )
    }

    const acceptOrder = async (orderId) => {
        await updateOrderStatus(orderId, 'ACCEPTED')
        // Generate invoice here
        alert('Order accepted! Invoice generated.')
    }

    const rejectOrder = async (orderId, reason) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId 
                    ? { ...order, status: 'REJECTED', rejectionReason: reason } 
                    : order
            )
        )
        setShowRejectModal(null)
        setRejectReason('')
        alert('Order rejected. Refund will be initiated.')
    }

    const generateInvoice = (order) => {
        // Generate invoice PDF
        alert(`Generating invoice for order ${order.orderNumber}`)
    }

    const downloadInvoice = (order) => {
        // Download invoice
        alert(`Downloading invoice for order ${order.orderNumber}`)
    }

    const printPackingSlip = (order) => {
        // Print packing slip
        const printContent = `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Packing Slip - ${order.orderNumber}</h2>
                <p><strong>Customer:</strong> ${order.customer.name}</p>
                <p><strong>Phone:</strong> ${order.address.phone}</p>
                <p><strong>Address:</strong> ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zip}</p>
                <hr/>
                <h3>Items:</h3>
                ${order.orderItems.map(item => `
                    <p>${item.product.name} x ${item.quantity} - ${currency}${item.price * item.quantity}</p>
                `).join('')}
                <hr/>
                <p><strong>Total:</strong> ${currency}${order.total}</p>
            </div>
        `
        
        const printWindow = window.open('', '', 'width=800,height=600')
        printWindow.document.write(printContent)
        printWindow.document.close()
        printWindow.print()
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(o => o.status === filter)

    useEffect(() => {
        fetchOrders()
        // Simulate new order notification
        const interval = setInterval(() => {
            // Check for new orders
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-11 h-11 rounded-full border-3 border-gray-300 border-t-green-500 animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="mb-28">
            {/* Notification Banner */}
            {notification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-50">
                    <Bell size={24} />
                    <div>
                        <p className="font-semibold">New Order Received!</p>
                        <p className="text-sm">You have a new order to process</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl text-slate-500">
                    Store <span className="text-slate-800 font-medium">Orders</span>
                </h1>
                
                {/* Filter Tabs */}
                <div className="flex gap-2 text-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('ORDER_PLACED')}
                        className={`px-4 py-2 rounded ${filter === 'ORDER_PLACED' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                    >
                        New Orders
                    </button>
                    <button
                        onClick={() => setFilter('ACCEPTED')}
                        className={`px-4 py-2 rounded ${filter === 'ACCEPTED' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                    >
                        Accepted
                    </button>
                    <button
                        onClick={() => setFilter('DELIVERED')}
                        className={`px-4 py-2 rounded ${filter === 'DELIVERED' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                    >
                        Delivered
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <p className="text-center text-slate-400 py-20">No orders found</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Order #</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {order.orderNumber}
                                        <div className="text-xs text-gray-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>{order.customer.name}</div>
                                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {order.orderItems.length} items
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {currency}{order.total}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.isPaid ? 'Paid' : 'COD'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {order.status === 'ORDER_PLACED' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => acceptOrder(order.id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => setShowRejectModal(order.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : order.status === 'REJECTED' ? (
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-xs ${orderStatuses[order.status].color}`}>
                                                    {orderStatuses[order.status].label}
                                                </span>
                                                {order.rejectionReason && (
                                                    <div className="text-xs text-red-600 mt-1">
                                                        Reason: {order.rejectionReason}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="border border-gray-300 rounded-md text-xs px-2 py-1"
                                            >
                                                {Object.keys(orderStatuses)
                                                    .filter(s => s !== 'ORDER_PLACED' && s !== 'REJECTED')
                                                    .map(status => (
                                                        <option key={status} value={status}>
                                                            {orderStatuses[status].label}
                                                        </option>
                                                    ))}
                                            </select>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal(order)}
                                                className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {order.status !== 'ORDER_PLACED' && order.status !== 'REJECTED' && (
                                                <>
                                                    <button
                                                        onClick={() => downloadInvoice(order)}
                                                        className="text-green-600 hover:bg-green-50 p-2 rounded"
                                                        title="Download Invoice"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => printPackingSlip(order)}
                                                        className="text-purple-600 hover:bg-purple-50 p-2 rounded text-xs"
                                                        title="Print Packing Slip"
                                                    >
                                                        Print
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div 
                    onClick={closeModal} 
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative m-4"
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                            Order Details - {selectedOrder.orderNumber}
                        </h2>

                        {/* Customer Details */}
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Name</p>
                                    <p className="font-medium">{selectedOrder.customer.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Phone</p>
                                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Email</p>
                                    <p className="font-medium">{selectedOrder.customer.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Payment Status</p>
                                    <p className={`font-medium ${selectedOrder.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {selectedOrder.isPaid ? 'Paid' : 'COD'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3">Delivery Address</h3>
                            <p className="text-sm">
                                {selectedOrder.address.street}, {selectedOrder.address.city},<br />
                                {selectedOrder.address.state} - {selectedOrder.address.zip}
                            </p>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                            <div className="space-y-3">
                                {selectedOrder.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 border border-slate-200 rounded-lg p-3">
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Qty: {item.quantity} × {currency}{item.price}
                                            </p>
                                        </div>
                                        <p className="font-semibold">
                                            {currency}{item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total Amount</span>
                                <span>{currency}{selectedOrder.total}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => printPackingSlip(selectedOrder)}
                                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                            >
                                Print Packing Slip
                            </button>
                            <button
                                onClick={() => downloadInvoice(selectedOrder)}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Order Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 m-4">
                        <h3 className="text-xl font-semibold mb-4">Reject Order</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for rejecting this order. This will be sent to the customer.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                            rows={4}
                            placeholder="Enter rejection reason..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRejectModal(null)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => rejectOrder(showRejectModal, rejectReason)}
                                disabled={!rejectReason.trim()}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reject Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}