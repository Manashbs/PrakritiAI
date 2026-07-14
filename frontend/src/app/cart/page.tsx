"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, CreditCard, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        description: string;
    };
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function PatientCart() {
    const router = useRouter();
    const [cartOrders, setCartOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ecommerce/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            // Filter only PENDING orders which represent active unpurchased carts
            const pending = data.filter((o: Order) => o.status === "PENDING");
            setCartOrders(pending);
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to load cart", err);
            setLoading(false);
        });
    }, [router]);

    const handleCheckout = (orderId: string) => {
        alert(`Proceeding to payment gateway for Order ID: ${orderId}\n\n(Stripe integration placeholder)`);
        // In a real flow, this would route to Stripe Checkout or an internal payment portal.
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading Digital Cart...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Your Medical Payload</h1>
                        <p className="text-gray-500">Review and securely purchase the items prescribed during your clinical visits</p>
                    </div>
                </div>

                {cartOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">Your Cart is Empty</h3>
                        <p className="text-gray-500">You currently have no pending prescriptions awaiting checkout.</p>
                        <Link href="/dashboard" className="inline-block mt-6 px-6 py-3 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors">
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {cartOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="bg-gray-900 p-5 text-white flex justify-between items-center sm:flex-row flex-col gap-4">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <Package className="w-5 h-5 text-[#4ade80]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Automated Clinical Cart</h3>
                                            <div className="text-sm text-gray-400 mt-1">Generated: {new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right w-full sm:w-auto">
                                        <div className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Total Payload</div>
                                        <div className="text-2xl font-serif text-[#4ade80]">${order.totalAmount.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Prescribed Items ({order.items.length})</h4>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                                <div>
                                                    <span className="font-bold text-gray-900 block">{item.product.name}</span>
                                                    <span className="text-sm text-gray-500 line-clamp-1 mt-1">{item.product.description}</span>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="font-bold text-gray-900">${item.price.toFixed(2)}</div>
                                                    <div className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
                                        <button className="px-6 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors flex items-center gap-2">
                                            <Trash2 className="w-4 h-4" /> Cancel Payload
                                        </button>
                                        <button onClick={() => handleCheckout(order.id)} className="px-8 py-3 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-lg shadow-green-900/20 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" /> Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
