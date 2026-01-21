'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Loading from "@/components/Loading"
import { Star, MessageSquare, Send } from "lucide-react"
import toast from "react-hot-toast"

export default function StoreReviews() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [replyText, setReplyText] = useState("")
    const [replyingTo, setReplyingTo] = useState(null)
    
    const { getToken } = useAuth()

    const fetchReviews = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/reviews', { headers: { Authorization: `Bearer ${token}` }})
            setReviews(data.reviews)
        } catch (error) {
            toast.error("Failed to load reviews")
        } finally {
            setLoading(false)
        }
    }

    const submitReply = async (reviewId) => {
        if (!replyText.trim()) return
        try {
            const token = await getToken()
            await axios.post('/api/store/reviews', { reviewId, response: replyText }, { headers: { Authorization: `Bearer ${token}` }})
            
            setReviews(prev => prev.map(r => r.id === reviewId ? {...r, storeResponse: replyText, respondedAt: new Date()} : r))
            setReplyingTo(null)
            setReplyText("")
            toast.success("Reply posted!")
        } catch (error) {
            toast.error("Failed to post reply")
        }
    }

    useEffect(() => { fetchReviews() }, [])

    if(loading) return <Loading />

    return (
        <div className="mb-20 max-w-4xl">
            <h1 className="text-2xl text-slate-500 mb-6">Customer <span className="text-slate-800 font-medium">Reviews & Q&A</span></h1>
            
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                                    {review.user?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">{review.user?.name}</h3>
                                    <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300"} />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 mb-4">
                            <img src={review.product?.images?.[0]} alt="" className="w-16 h-16 rounded object-cover border border-slate-100" />
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Product: {review.product?.name}</p>
                                <p className="text-slate-700">{review.review}</p>
                            </div>
                        </div>

                        {/* Store Response Section */}
                        <div className="bg-slate-50 rounded-lg p-4 mt-4">
                            {review.storeResponse ? (
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-green-700">
                                        <MessageSquare size={16}/> Your Reply
                                    </div>
                                    <p className="text-sm text-slate-600">{review.storeResponse}</p>
                                    <p className="text-xs text-slate-400 mt-2 text-right">Replied on {new Date(review.respondedAt).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                replyingTo === review.id ? (
                                    <div className="flex flex-col gap-2">
                                        <textarea 
                                            className="w-full p-2 border rounded text-sm focus:outline-none focus:border-slate-400"
                                            rows="3"
                                            placeholder="Write your response to the customer..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setReplyingTo(null)} className="text-sm px-3 py-1 text-slate-500">Cancel</button>
                                            <button onClick={() => submitReply(review.id)} className="text-sm bg-slate-800 text-white px-4 py-1 rounded flex items-center gap-2">
                                                <Send size={14}/> Post Reply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => { setReplyingTo(review.id); setReplyText(""); }} className="text-sm text-blue-600 font-medium hover:underline">
                                        Reply to this review
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}