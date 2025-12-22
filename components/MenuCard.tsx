
import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { theme, styles } from '../design-system';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAdd }) => {
  const isOutOfStock = item.stock <= 0;

  return (
    <div className={`${styles.card} group flex flex-col h-full hover:shadow-md`}>
      <div className={`relative aspect-[4/3] overflow-hidden ${theme.radius.xl} m-1`}>
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
        />
        {!isOutOfStock && item.stock < 15 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">{item.stock} Left</span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wider shadow-xl">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className={`${styles.heading.h3} mb-1 line-clamp-2 min-h-[40px] leading-tight`}>
          {item.name}
        </h3>
        <p className={`${theme.colors.primary.text} font-extrabold text-base mb-4`}>
          Rp {item.price.toLocaleString('id-ID')}
        </p>
        
        <button
          onClick={() => !isOutOfStock && onAdd(item)}
          disabled={isOutOfStock}
          className={`mt-auto w-full py-2.5 ${styles.button.base} ${
            isOutOfStock ? 'bg-slate-100 text-slate-400 border-none' : styles.button.outline
          }`}
        >
          {isOutOfStock ? (
             <>Unavailable</>
          ) : (
            <>
              <Plus size={14} strokeWidth={3} />
              <span>Add to Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
