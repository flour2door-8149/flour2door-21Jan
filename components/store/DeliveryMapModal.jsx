'use client'
import { useState, useEffect } from 'react'
import { X, MapPin, Navigation } from 'lucide-react'

export default function DeliveryMapModal({ onClose }) {
    const [deliveryBoys, setDeliveryBoys] = useState([])

    useEffect(() => {
        // Fetch delivery boy locations
        // API call would go here
        
        // Update every 30 seconds
        const interval = setInterval(() => {
            // Refresh locations
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg max-w-4xl w-full h-[600px] p-6"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Live Delivery Tracking</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-green-50 h-full rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <MapPin size={64} className="mx-auto mb-4 text-blue-600 opacity-50" />
                        <p className="text-lg text-gray-600">Enable Google Maps API to view live tracking</p>
                        <p className="text-sm text-gray-500 mt-2">Coming soon: Real-time delivery boy locations</p>
                    </div>
                </div>
            </div>
        </div>
    )
}