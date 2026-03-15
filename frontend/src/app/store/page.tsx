"use client";

import { useEffect, useState } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StorePage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("All");

    // We'll mimic adding to cart for the UI to match "Add to Cart" functionality design
    const [cart, setCart] = useState<string[]>([]);
    const [message, setMessage] = useState({ text: "", type: "" });

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ecommerce/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setProducts(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBuy = async (productId: string) => {
        setPurchasing(productId);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ecommerce/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ items: [{ productId, quantity: 1 }] }),
            });

            if (!res.ok) throw new Error("Purchase failed");

            setCart(prev => [...prev, productId]);
            setMessage({ text: "Added to your orders successfully!", type: "success" });
            fetchData();
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setPurchasing(null);
        }
    };

    const tabs = ["All", "Ayurveda", "Wellness", "Allopathy"];

    return (
        <PrakritiAILayout>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight mb-3">Wellness Store</h1>
                    <p className="text-gray-500 font-medium text-lg">Curated products for your wellbeing.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#2A3B47] rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-semibold text-sm">
                    <ShoppingCart className="w-4 h-4" />
                    View Cart {cart.length > 0 && <span className="bg-[#2D7A5D] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ml-1">{cart.length}</span>}
                </button>
            </div>

            {/* Messaging */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-[#f0fdf4] text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                    {message.type === 'success' ? <Check className="w-5 h-5 text-green-500" /> : <span className="text-xl">❌</span>}
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-6 mb-2 border-b border-gray-100">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${activeTab === tab
                                ? "bg-white border border-gray-200 text-[#2A3B47] shadow-sm"
                                : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(product => {
                    const isAdded = cart.includes(product.id);
                    return (
                        <div key={product.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow group">

                            {/* Product Image Area */}
                            <div className="w-full h-48 bg-gray-50 rounded-2xl mb-5 flex items-center justify-center overflow-hidden border border-gray-100/50">
                                <div className="text-gray-300 transform group-hover:scale-110 transition-transform duration-500">
                                    <ShoppingCart className="w-12 h-12 opacity-20" />
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col">
                                <span className="text-[10px] font-bold tracking-wider text-[#2D7A5D] uppercase mb-2">Ayurveda</span>
                                <h3 className="text-xl font-serif font-bold text-[#2A3B47] leading-tight mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {product.description}
                                </p>

                                <div className="mt-auto pt-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xl font-bold text-[#2A3B47]">₹{product.price}</span>
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">Only {product.stock} left</span>
                                        )}
                                        {product.stock === 0 && (
                                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">Out of Stock</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleBuy(product.id)}
                                        disabled={product.stock === 0 || purchasing === product.id}
                                        className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isAdded
                                                ? "bg-[#f0fdf4] text-[#2D7A5D] border border-green-200"
                                                : "bg-[#2D7A5D] text-white hover:bg-[#24614A] shadow-sm"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {purchasing === product.id ? "Processing..." : isAdded ? <><Check className="w-4 h-4" /> Added</> : <><Plus className="w-4 h-4" /> Add to Cart</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty state if database is empty */}
                {products.length === 0 && !loading && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No products available in the store.
                    </div>
                )}
            </div>
        </PrakritiAILayout>
    );
}
