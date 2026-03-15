"use client";

import { useState, useEffect } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Search, Filter, Package, ShoppingBag, Plus, Trash2, Edit, AlertCircle, TrendingUp, RefreshCcw } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function AdminEcommerce() {
    const { themeColor } = useMedicalMode();
    const [activeView, setActiveView] = useState("Inventory"); // Inventory, Orders, Commissions
    const [inventory, setInventory] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const [prodRes, ordRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (prodRes.ok) setInventory(await prodRes.json());
            if (ordRes.ok) setOrders(await ordRes.json());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = async () => {
        const name = prompt("Enter product name:");
        if (!name) return;
        const price = prompt("Enter product price (₹):", "0");
        const stock = prompt("Enter initial stock quantity:", "0");

        const token = localStorage.getItem("token");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name, price, stock })
        });
        fetchData();
    };

    const handleEditProduct = async (product: any) => {
        const stock = prompt(`Update stock for ${product.name}:`, product.stock);
        if (stock === null) return;
        const token = localStorage.getItem("token");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ stock })
        });
        fetchData();
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Delete this product permanently?")) return;
        const token = localStorage.getItem("token");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
    };

    const handleUpdateOrderStatus = async (id: string, status: string) => {
        const token = localStorage.getItem("token");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        fetchData();
    };

    return (
        <PrakritiAILayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">
                        E-commerce Engine
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Manage medicine inventory, track user orders, and monitor sales commissions.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => alert("Sales Report module is coming soon.")} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                        <TrendingUp className="w-4 h-4" />
                        Sales Report
                    </button>
                    {(activeView === "Inventory" || activeView === "Commissions") && (
                        <button
                            onClick={() => activeView === "Inventory" ? handleAddProduct() : alert("Coming Soon")}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm text-sm cursor-pointer"
                            style={{ backgroundColor: themeColor }}
                        >
                            {activeView === "Inventory" ? <Plus className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />}
                            {activeView === "Inventory" ? "New Product" : "Calculate Payouts"}
                        </button>
                    )}
                </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-100 max-w-fit">
                {["Inventory", "Orders", "Commissions"].map((view) => (
                    <button
                        key={view}
                        onClick={() => setActiveView(view)}
                        className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeView === view ? 'bg-[#2A3B47] text-white shadow-sm' : 'text-gray-500 hover:text-[#2A3B47]'}`}
                    >
                        {view === "Inventory" ? <Package className="w-4 h-4" /> : view === "Orders" ? <ShoppingBag className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                        {view}
                    </button>
                ))}
            </div>

            {activeView === "Inventory" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 max-w-sm relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search medicines by name or SKU..."
                                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 shadow-sm"
                                style={{ '--tw-ring-color': themeColor } as any}
                            />
                        </div>
                        <button onClick={() => alert("Advanced filtering is disabled.")} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                            <Filter className="w-4 h-4" /> Filters
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-8">Product Details</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Level</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Expiry Date</th>
                                        <th className="px-6 py-4 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {inventory.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.id?.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 pl-8">
                                                <div className="font-bold text-[#2A3B47] text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">SKU: AYR-{item.id.substring(0, 8)}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-700">₹{item.price}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm text-gray-700 w-8">{item.stock}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.stock > 10 ? 'bg-green-50 text-green-600' : item.stock > 0 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                                        {item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 flex items-center gap-1.5">
                                                N/A
                                            </td>
                                            <td className="px-6 py-4 text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEditProduct(item)} className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer" title="Edit Stock">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer" title="Delete Product">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeView === "Orders" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-[#2A3B47]">Recent Customer Orders</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-8">Order ID / Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Items</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-right pr-6">Update Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map((ord) => (
                                        <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 pl-8">
                                                <div className="font-bold text-[#2A3B47] text-sm">ORD-{ord.id.substring(0, 6)}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-700 text-sm">{ord.user?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{ord.items?.length || 0} items</td>
                                            <td className="px-6 py-4 font-bold text-green-600">₹{ord.totalAmount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${ord.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' : ord.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' : ord.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                    {ord.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right pr-6">
                                                <select
                                                    value={''}
                                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 focus:outline-none focus:ring-1 shadow-sm"
                                                >
                                                    <option value="" disabled>Update...</option>
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PAID">Paid</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancel Order</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeView === "Commissions" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60">
                        <h3 className="text-xl font-bold text-[#2A3B47] mb-6">Doctor Pharmacy Commissions</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">D</div>
                                        <div>
                                            <h4 className="font-bold text-[#2A3B47] text-sm">Dr. Ramesh Kumar</h4>
                                            <p className="text-xs text-gray-500">24 prescriptions fulfilled via E-pharmacy</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-600 text-lg">₹1,840</div>
                                        <button className="text-xs font-bold text-blue-500 hover:text-blue-700 mt-1">Settle Payout →</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60 h-fit">
                        <h3 className="font-bold text-[#2A3B47] mb-4">Commission Engine Rules</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Platform Fee</span>
                                <span className="font-bold text-gray-700">12%</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Doctor Rx Cut</span>
                                <span className="font-bold text-gray-700">8%</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Vendor Share</span>
                                <span className="font-bold text-gray-700">80%</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2.5 bg-gray-50 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-white transition-colors">
                            Edit Rules
                        </button>
                    </div>
                </div>
            )}
        </PrakritiAILayout>
    );
}
