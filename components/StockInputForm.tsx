
import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, Save, RotateCcw, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MenuItem, Category } from '../types';
import { theme, styles } from '../design-system';

interface StockInputFormProps {
    menuItems: MenuItem[];
    onUpdateStock: (updates: StockUpdate[]) => void;
    isLoading?: boolean;
}

export interface StockUpdate {
    productId: string;
    productName: string;
    currentStock: number;
    adjustment: number;
    newStock: number;
    notes: string;
}

const StockInputForm: React.FC<StockInputFormProps> = ({ menuItems, onUpdateStock, isLoading = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');
    const [stockUpdates, setStockUpdates] = useState<Map<string, { adjustment: number; notes: string }>>(new Map());
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Filter menu items based on search and category
    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAdjustment = (productId: string, delta: number) => {
        setStockUpdates(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(productId) || { adjustment: 0, notes: '' };
            const item = menuItems.find(m => m.id === productId);
            const maxDecrease = item ? -item.stock : 0;
            const newAdjustment = Math.max(maxDecrease, current.adjustment + delta);
            newMap.set(productId, { ...current, adjustment: newAdjustment });
            return newMap;
        });
    };

    const handleDirectInput = (productId: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setStockUpdates(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(productId) || { adjustment: 0, notes: '' };
            const item = menuItems.find(m => m.id === productId);
            const maxDecrease = item ? -item.stock : 0;
            newMap.set(productId, { ...current, adjustment: Math.max(maxDecrease, numValue) });
            return newMap;
        });
    };

    const handleNotesChange = (productId: string, notes: string) => {
        setStockUpdates(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(productId) || { adjustment: 0, notes: '' };
            newMap.set(productId, { ...current, notes });
            return newMap;
        });
    };

    const handleReset = () => {
        setStockUpdates(new Map());
        setSuccessMessage(null);
    };

    const handleSubmit = () => {
        const updates: StockUpdate[] = [];

        stockUpdates.forEach((update, productId) => {
            if (update.adjustment !== 0) {
                const item = menuItems.find(m => m.id === productId);
                if (item) {
                    updates.push({
                        productId,
                        productName: item.name,
                        currentStock: item.stock,
                        adjustment: update.adjustment,
                        newStock: item.stock + update.adjustment,
                        notes: update.notes
                    });
                }
            }
        });

        if (updates.length > 0) {
            onUpdateStock(updates);
            setSuccessMessage(`${updates.length} produk berhasil diupdate!`);
            setTimeout(() => {
                setSuccessMessage(null);
                setStockUpdates(new Map());
            }, 3000);
        }
    };

    const pendingUpdatesCount = Array.from(stockUpdates.values()).filter(u => u.adjustment !== 0).length;

    const getStockBadgeStyle = (stock: number) => {
        if (stock === 0) return 'bg-red-100 text-red-600';
        if (stock <= 10) return 'bg-amber-100 text-amber-600';
        return 'bg-emerald-100 text-emerald-600';
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={styles.heading.h1}>Input Stock Barang</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">
                        Inventory &gt; <span className="text-emerald-500">Stock Management</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {pendingUpdatesCount > 0 && (
                        <span className={`${styles.badge} bg-amber-100 text-amber-600`}>
                            {pendingUpdatesCount} perubahan pending
                        </span>
                    )}
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className={`${styles.card} p-4 bg-emerald-50 border-emerald-200 flex items-center gap-3`}>
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span className="font-medium text-emerald-700">{successMessage}</span>
                </div>
            )}

            {/* Search and Filter Bar */}
            <div className={`${styles.card} p-6`}>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.input + " pl-12"}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {(['All', 'Food', 'Drinks', 'Snack', 'Dessert'] as Category[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2.5 ${theme.radius.md} font-bold text-xs ${theme.transition} whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {cat === 'All' ? 'Semua' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stock Table */}
            <div className={`${styles.card} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Produk</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Saat Ini</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Penyesuaian</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Baru</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Package className="text-slate-300" size={48} />
                                            <p className="text-slate-400 font-medium">Tidak ada produk ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, index) => {
                                    const update = stockUpdates.get(item.id) || { adjustment: 0, notes: '' };
                                    const newStock = item.stock + update.adjustment;
                                    const hasChange = update.adjustment !== 0;

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`border-b border-slate-50 ${theme.transition} hover:bg-slate-50 ${hasChange ? 'bg-amber-50/50' : ''}`}
                                        >
                                            {/* Product Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 ${theme.radius.md} overflow-hidden bg-slate-100 flex-shrink-0`}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=?';
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                                                        <span className={`${styles.badge} ${item.category === 'Food' ? 'bg-orange-100 text-orange-600' :
                                                                item.category === 'Drinks' ? 'bg-blue-100 text-blue-600' :
                                                                    item.category === 'Snack' ? 'bg-purple-100 text-purple-600' :
                                                                        'bg-pink-100 text-pink-600'
                                                            }`}>
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Current Stock */}
                                            <td className="px-6 py-4 text-center">
                                                <span className={`${styles.badge} ${getStockBadgeStyle(item.stock)}`}>
                                                    {item.stock} pcs
                                                </span>
                                            </td>

                                            {/* Adjustment Controls */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAdjustment(item.id, -1)}
                                                        className={`w-9 h-9 ${theme.radius.md} flex items-center justify-center ${theme.transition} bg-red-100 text-red-500 hover:bg-red-200 active:scale-95`}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={update.adjustment}
                                                        onChange={(e) => handleDirectInput(item.id, e.target.value)}
                                                        className={`w-20 text-center px-2 py-2 ${theme.radius.md} border-2 font-bold text-sm ${update.adjustment > 0 ? 'border-emerald-300 bg-emerald-50 text-emerald-600' :
                                                                update.adjustment < 0 ? 'border-red-300 bg-red-50 text-red-600' :
                                                                    'border-slate-200 bg-white text-slate-600'
                                                            } outline-none focus:border-emerald-500`}
                                                    />
                                                    <button
                                                        onClick={() => handleAdjustment(item.id, 1)}
                                                        className={`w-9 h-9 ${theme.radius.md} flex items-center justify-center ${theme.transition} bg-emerald-100 text-emerald-500 hover:bg-emerald-200 active:scale-95`}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* New Stock */}
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-bold text-lg ${newStock === 0 ? 'text-red-500' :
                                                        newStock !== item.stock ? 'text-emerald-600' :
                                                            'text-slate-600'
                                                    }`}>
                                                    {newStock}
                                                </span>
                                                {hasChange && (
                                                    <span className={`ml-2 text-xs font-medium ${update.adjustment > 0 ? 'text-emerald-500' : 'text-red-500'
                                                        }`}>
                                                        {update.adjustment > 0 ? '+' : ''}{update.adjustment}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Notes */}
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    placeholder="Tambah catatan..."
                                                    value={update.notes}
                                                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                                    className={`w-full px-3 py-2 text-sm ${theme.radius.md} border border-slate-200 bg-white outline-none focus:border-emerald-400 ${theme.transition}`}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`${styles.card} p-6`}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleReset}
                        disabled={pendingUpdatesCount === 0}
                        className={`${styles.button.base} ${styles.button.outline} flex-1 py-4 px-6`}
                    >
                        <RotateCcw size={18} />
                        <span>Reset Semua</span>
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={pendingUpdatesCount === 0 || isLoading}
                        className={`${styles.button.base} ${styles.button.primary} flex-1 py-4 px-6 bg-emerald-600`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Simpan Perubahan ({pendingUpdatesCount})</span>
                            </>
                        )}
                    </button>
                </div>

                {pendingUpdatesCount > 0 && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                        <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-medium text-amber-700">
                                Anda memiliki {pendingUpdatesCount} perubahan yang belum disimpan.
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                Klik "Simpan Perubahan" untuk mengupdate stock di sistem.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockInputForm;
