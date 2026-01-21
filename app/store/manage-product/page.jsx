'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { Trash2, Edit, X, Check } from "lucide-react"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import EditProductModal from '@/components/store/EditProductModal'


export default function StoreManageProducts() {
    const { getToken } = useAuth()
    const { user } = useUser()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'rs'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [editingProduct, setEditingProduct] = useState(null)
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        mrp: 0,
        price: 0,
        category: '',
        stock: 0
    })

    const categories = ['Fresh', 'Upvas', 'Special']

    const fetchProducts = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/product', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(data.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const toggleStock = async (productId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/store/stock-toggle', { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(prevProducts => prevProducts.map(product =>
                product.id === productId ? { ...product, inStock: !product.inStock } : product
            ))
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const deleteProduct = async (productId) => {
        const confirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.')
        if (!confirmed) return

        try {
            const token = await getToken()
            await axios.delete(`/api/store/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId))
            toast.success('Product deleted successfully')
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const startEdit = (product) => {
        setEditingProduct(product.id)
        setEditForm({
            name: product.name,
            description: product.description,
            mrp: product.mrp,
            price: product.price,
            category: product.category,
            stock: product.stock || 0
        })
    }

    const cancelEdit = () => {
        setEditingProduct(null)
        setEditForm({
            name: '',
            description: '',
            mrp: 0,
            price: 0,
            category: '',
            stock: 0
        })
    }

    const saveEdit = async (productId) => {
        try {
            const token = await getToken()
            const { data } = await axios.put(`/api/store/product/${productId}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId
                        ? { ...product, ...editForm }
                        : product
                )
            )
            toast.success(data.message)
            cancelEdit()
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchProducts()
        }
    }, [user])

    if (loading) return <Loading />

    return (
        <div className="mb-28">
            <h1 className="text-2xl text-slate-500 mb-5">
                Manage <span className="text-slate-800 font-medium">Products</span>
            </h1>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full max-w-6xl text-left text-sm">
                    <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3 hidden md:table-cell">Description</th>
                            <th className="px-4 py-3">MRP</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 divide-y divide-slate-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            width={40}
                                            height={40}
                                            className="p-1 shadow rounded"
                                            src={product.images[0]}
                                            alt={product.name}
                                        />
                                        {editingProduct === product.id ? (
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="border border-slate-300 rounded px-2 py-1 w-32"
                                            />
                                        ) : (
                                            <span>{product.name}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell">
                                    {editingProduct === product.id ? (
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            className="border border-slate-300 rounded px-2 py-1 w-full"
                                            rows={2}
                                        />
                                    ) : (
                                        <span className="truncate block">{product.description}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editingProduct === product.id ? (
                                        <input
                                            type="number"
                                            value={editForm.mrp}
                                            onChange={(e) => setEditForm({ ...editForm, mrp: Number(e.target.value) })}
                                            className="border border-slate-300 rounded px-2 py-1 w-20"
                                        />
                                    ) : (
                                        `${currency} ${product.mrp.toLocaleString()}`
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editingProduct === product.id ? (
                                        <input
                                            type="number"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                            className="border border-slate-300 rounded px-2 py-1 w-20"
                                        />
                                    ) : (
                                        `${currency} ${product.price.toLocaleString()}`
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editingProduct === product.id ? (
                                        <input
                                            type="number"
                                            value={editForm.stock}
                                            onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                                            className="border border-slate-300 rounded px-2 py-1 w-20"
                                        />
                                    ) : (
                                        <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                                            {product.stock || 0}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={() => toggleStock(product.id)}
                                            checked={product.inStock}
                                        />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {editingProduct === product.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(product.id)}
                                                    className="text-green-600 hover:bg-green-50 p-2 rounded transition"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="text-slate-600 hover:bg-slate-50 p-2 rounded transition"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                    <button
                                                        onClick={() => setEditingProduct(product)}
                                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"
                                                    >
                                                        <Edit size={18} />
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

            {/* Low Stock Alert */}
            {products.some(p => p.stock < 10) && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">⚠️ Low Stock Alert</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                        {products
                            .filter(p => p.stock < 10)
                            .map(p => (
                                <li key={p.id}>
                                    {p.name} - Only {p.stock} units remaining
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={(updatedProduct) => {
                        setProducts(prev => prev.map(p =>
                            p.id === updatedProduct.id ? updatedProduct : p
                        ))
                    }}
                />
            )}
        </div>
    )
}