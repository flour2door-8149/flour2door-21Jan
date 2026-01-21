'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { X } from "lucide-react"

export default function StoreAddProduct() {

    const categories = ['Fresh', 'Upvas', 'Special']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        stock: 0
    })
    const [loading, setLoading] = useState(false)
    const [aiUsed, setAiUsed] = useState(false)

    const { getToken } = useAuth()

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    // Image compression function
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

                    // Max dimensions
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

                img.onerror = () => reject(new Error('Image load failed'))
            }
            reader.onerror = () => reject(new Error('File read failed'))
        })
    }

    const handleImageUpload = async (key, file) => {
        // Validate file size (max 5MB before compression)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        try {
            // Compress image
            const compressedFile = await compressImage(file)
            setImages(prev => ({ ...prev, [key]: compressedFile }))
            toast.success('Image uploaded successfully')

            // AI analysis for first image
            if (key === "1" && compressedFile && !aiUsed) {
                const reader = new FileReader()
                reader.readAsDataURL(compressedFile)
                reader.onloadend = async () => {
                    const base64String = reader.result.split(",")[1]
                    const mimeType = compressedFile.type
                    const token = await getToken()

                    try {
                        const { data } = await axios.post(
                            "/api/store/ai",
                            { base64Image: base64String, mimeType },
                            { headers: { Authorization: `Bearer ${token}` } }
                        )
                        
                        if (data.name && data.description) {
                            setProductInfo(prev => ({
                                ...prev,
                                name: data.name,
                                description: data.description
                            }))
                            setAiUsed(true)
                            toast.success("AI filled product info 🎉")
                        }
                    } catch (error) {
                        console.error('AI analysis failed:', error)
                    }
                }
            }
        } catch (error) {
            toast.error('Failed to process image')
            console.error(error)
        }
    }

    const removeImage = (key) => {
        setImages(prev => ({ ...prev, [key]: null }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        
        if (!images[1] && !images[2] && !images[3] && !images[4]) {
            return toast.error('Please upload at least one image')
        }

        if (productInfo.price > productInfo.mrp) {
            return toast.error('Price cannot be greater than MRP')
        }

        if (productInfo.stock < 0) {
            return toast.error('Stock cannot be negative')
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('category', productInfo.category)
            formData.append('stock', productInfo.stock)

            Object.keys(images).forEach((key) => {
                if (images[key]) {
                    formData.append('images', images[key])
                }
            })

            const token = await getToken()
            const { data } = await axios.post('/api/store/product', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            toast.success(data.message)

            // Reset form
            setProductInfo({ name: "", description: "", mrp: 0, price: 0, category: "", stock: 0 })
            setImages({ 1: null, 2: null, 3: null, 4: null })
            setAiUsed(false)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images (Max 5MB each)</p>

            <div className="flex gap-3 mt-4 flex-wrap">
                {Object.keys(images).map((key) => (
                    <div key={key} className="relative">
                        <label htmlFor={`images${key}`} className="cursor-pointer block">
                            <Image
                                width={300}
                                height={300}
                                className='h-24 w-24 border-2 border-slate-200 rounded-lg object-cover hover:border-green-500 transition'
                                src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area}
                                alt=""
                            />
                            <input
                                type="file"
                                accept='image/*'
                                id={`images${key}`}
                                onChange={e => handleImageUpload(key, e.target.files[0])}
                                hidden
                            />
                        </label>
                        {images[key] && (
                            <button
                                type="button"
                                onClick={() => removeImage(key)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6 ">
                Name *
                <input 
                    type="text" 
                    name="name" 
                    onChange={onChangeHandler} 
                    value={productInfo.name} 
                    placeholder="Enter product name" 
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" 
                    required 
                />
            </label>

            <label className="flex flex-col gap-2 my-6 ">
                Description *
                <textarea 
                    name="description" 
                    onChange={onChangeHandler} 
                    value={productInfo.description} 
                    placeholder="Enter product description" 
                    rows={5} 
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" 
                    required 
                />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2 ">
                    Actual Price ({process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'}) *
                    <input 
                        type="number" 
                        name="mrp" 
                        onChange={onChangeHandler} 
                        value={productInfo.mrp} 
                        placeholder="0" 
                        min="0"
                        step="0.01"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" 
                        required 
                    />
                </label>
                <label className="flex flex-col gap-2 ">
                    Selling Price ({process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'}) *
                    <input 
                        type="number" 
                        name="price" 
                        onChange={onChangeHandler} 
                        value={productInfo.price} 
                        placeholder="0" 
                        min="0"
                        step="0.01"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" 
                        required 
                    />
                </label>
            </div>

            <label className="flex flex-col gap-2 my-6">
                Initial Stock Quantity *
                <input 
                    type="number" 
                    name="stock" 
                    onChange={onChangeHandler} 
                    value={productInfo.stock} 
                    placeholder="0" 
                    min="0"
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" 
                    required 
                />
            </label>

            <select 
                onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} 
                value={productInfo.category} 
                className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" 
                required
            >
                <option value="">Select a category *</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button 
                type="submit"
                disabled={loading} 
                className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Adding Product...' : 'Add Product'}
            </button>
        </form>
    )
}