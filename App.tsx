
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, LayoutGrid } from 'lucide-react';
import Sidebar, { PageView } from './components/Sidebar';
import Cart from './components/Cart';
import MenuCard from './components/MenuCard';
import StockInputForm, { StockUpdate } from './components/StockInputForm';
import ProductForm from './components/ProductForm';
import { INITIAL_MENU } from './constants';
import { MenuItem, CartItem, Category, Order, NewProduct } from './types';
import { apiService } from './services/apiService';
import { theme, styles } from './design-system';

const App: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('kasir');

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.fetchMenu();
      setMenu(data);
    } catch (err) {
      console.error("Failed to load menu data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchQuery]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleCheckout = async (orderData: any) => {
    const fullOrder: Order = {
      ...orderData,
      id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
      table: '8',
      type: 'Dine In',
      timestamp: new Date().toISOString()
    };
    
    setIsLoading(true);
    const success = await apiService.saveOrder(fullOrder);
    if (success) {
      alert('Order processed successfully!');
      setCart([]);
      loadMenu(); // Refresh stock
    } else {
      alert('Failed to save order.');
    }
    setIsLoading(false);
  };

  const handleStockUpdate = async (updates: StockUpdate[]) => {
    setIsLoading(true);
    try {
      // Update local state optimistically
      setMenu(prevMenu => {
        return prevMenu.map(item => {
          const update = updates.find(u => u.productId === item.id);
          if (update) {
            return { ...item, stock: update.newStock };
          }
          return item;
        });
      });

      // Send to API (you can implement this in apiService)
      console.log('Stock updates to save:', updates);
      // await apiService.updateStock(updates);
      
      alert(`${updates.length} produk berhasil diupdate!`);
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Gagal update stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (product: NewProduct) => {
    setIsLoading(true);
    try {
      const success = await apiService.addProduct(product);
      if (success) {
        alert('Produk berhasil ditambahkan!');
        await loadMenu(); // Refresh menu
        setCurrentPage('kasir');
      } else {
        alert('Gagal menambahkan produk.');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Gagal menambahkan produk');
    } finally {
      setIsLoading(false);
    }
  };

  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'stock':
        return (
          <main className="flex-1 min-w-0 overflow-auto">
            <StockInputForm 
              menuItems={menu}
              onUpdateStock={handleStockUpdate}
              isLoading={isLoading}
            />
          </main>
        );
      
      case 'dashboard':
        return (
          <main className="flex-1 flex items-center justify-center min-w-0">
            <div className="text-center">
              <LayoutGrid size={64} className="mx-auto text-slate-300 mb-4" />
              <h2 className={styles.heading.h1}>Dashboard</h2>
              <p className="text-slate-400 mt-2">Coming soon...</p>
            </div>
          </main>
        );
      
      case 'report':
        return (
          <main className="flex-1 flex items-center justify-center min-w-0">
            <div className="text-center">
              <LayoutGrid size={64} className="mx-auto text-slate-300 mb-4" />
              <h2 className={styles.heading.h1}>Report</h2>
              <p className="text-slate-400 mt-2">Coming soon...</p>
            </div>
          </main>
        );

      case 'product':
        return (
          <main className="flex-1 min-w-0 overflow-auto">
            <ProductForm
              onSave={handleAddProduct}
              onCancel={() => setCurrentPage('kasir')}
              isLoading={isLoading}
            />
          </main>
        );
      
      case 'logs':
        return (
          <main className="flex-1 flex items-center justify-center min-w-0">
            <div className="text-center">
              <LayoutGrid size={64} className="mx-auto text-slate-300 mb-4" />
              <h2 className={styles.heading.h1}>Logs</h2>
              <p className="text-slate-400 mt-2">Coming soon...</p>
            </div>
          </main>
        );
      
      case 'kasir':
      default:
        return (
          <>
            <main className="flex-1 flex flex-col min-w-0">
              <header className="px-10 py-8 flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className={styles.heading.h1}>Foodcourt Menu</h1>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                    <Calendar size={14} />
                    <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="relative group w-96">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.input + " pl-12"}
                  />
                </div>
              </header>

              <section className="px-10 pb-8 overflow-x-auto">
                <div className="flex gap-4">
                  {(['All', 'Food', 'Drinks', 'Snack', 'Dessert'] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-8 py-3.5 ${theme.radius.lg} font-bold text-sm ${theme.transition} flex items-center gap-3 border ${
                        activeCategory === cat
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Menu' : cat}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="px-10 pb-10 flex-1 relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredMenu.map((item) => (
                    <MenuCard key={item.id} item={item} onAdd={addToCart} />
                  ))}
                </div>
              </section>
            </main>

            <Cart 
              items={cart} 
              onUpdateQty={updateCartQty} 
              onClear={() => setCart([])} 
              onCheckout={handleCheckout} 
            />
          </>
        );
    }
  };

  return (
    <div className={`flex min-h-screen ${theme.colors.neutral.bg} ${theme.colors.neutral.textDark}`}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderContent()}
    </div>
  );
};

export default App;
