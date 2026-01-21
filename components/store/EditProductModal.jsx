'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'

export default function EditProductModal({ product, onClose, onUpdate }) {
    const { getToken } = useAuth()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        mrp: product.mrp,
        price: product.price,
        category: product.category,
        stock: product.stock || 0
    })
    
    const [existingImages, setExistingImages] = useState(product.images || [])
    const [newImages, setNewImages] = useState([])
    const [loading, setLoading] = useState(false)

    const categories = ['Fresh', 'Upvas', 'Special']

    const compressImage = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (event) => {
                const img = new window.Image()
                img.src = event.target.result

                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    let width = img.width
                    let height = img.height

                    const MAX_WIDTH = 1024
                    const MAX_HEIGHT = 1024

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }

                    canvas.width = width
                    canvas.height = height

                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }))
                    }, 'image/jpeg', 0.8)
                }
            }
        })
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        
        if (existingImages.length + newImages.length + files.length > 4) {
            toast.error('Maximum 4 images allowed')
            return
        }

        try {
            const compressed = await Promise.all(
                files.map(file => compressImage(file))
            )
            setNewImages(prev => [...prev, ...compressed])
        } catch (error) {
            toast.error('Failed to process images')
        }
    }

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('mrp', formData.mrp)
            formDataToSend.append('price', formData.price)
            formDataToSend.append('category', formData.category)
            formDataToSend.append('stock', formData.stock)
            formDataToSend.append('existingImages', JSON.stringify(existingImages))

            newImages.forEach(image => {
                formDataToSend.append('newImages', image)
            })

            const token = await getToken()
            const { data } = await axios.put(
                `/api/store/product/${product.id}`,
                formDataToSend,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            toast.success(data.message)
            onUpdate(data.product)
            onClose()
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800">Edit Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images (Max 4)
                        </label>
                        <div className="flex gap-3 flex-wrap mb-3">
                            {existingImages.map((img, index) => (
                                <div key={`existing-${index}`} className="relative">
                                    <Image
                                        src={img}
                                        alt=""
                                        width={100}
                                        height={100}
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {newImages.map((img, index) => (
                                <div key={`new-${index}`} className="relative">
                                    <Image
                                        src={URL.createObjectURL(img)}
                                        alt=""
                                        width={100}
                                        height={100}
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-green-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {(existingImages.length + newImages.length) < 4 && (
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                            required
                        />
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                MRP ({currency}) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.mrp}
                                onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price ({currency}) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* Category & Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}