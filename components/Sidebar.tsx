
import React from 'react';
import { LayoutGrid, Banknote, PieChart, Package, FileText, Settings, LogOut } from 'lucide-react';
import { theme, styles } from '../design-system';

export type PageView = 'kasir' | 'stock' | 'dashboard' | 'report' | 'logs' | 'product';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems: { icon: React.ReactNode; label: string; page: PageView }[] = [
    { icon: <LayoutGrid size={20} />, label: 'DASH', page: 'dashboard' },
    { icon: <Banknote size={20} />, label: 'KASIR', page: 'kasir' },
    { icon: <Package size={20} />, label: 'STOCK', page: 'stock' },
    { icon: <FileText size={20} />, label: 'NEW', page: 'product' },
    { icon: <PieChart size={20} />, label: 'REPORT', page: 'report' },
  ];

  return (
    <aside className={`w-20 bg-white border-r ${theme.colors.neutral.borderDark} flex flex-col items-center py-6 h-screen sticky top-0`}>
      <div className="mb-10">
        <div className={`w-10 h-10 ${theme.colors.primary.main} ${theme.radius.md} flex items-center justify-center text-white shadow-lg ${theme.colors.primary.shadow}`}>
          <LayoutGrid size={24} />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {menuItems.map((item, idx) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(item.page)}
              className={`flex flex-col items-center gap-1 group ${theme.transition} ${
                isActive ? theme.colors.primary.text : 'text-slate-400 hover:text-emerald-500'
              }`}
            >
              <div className={`p-3 ${theme.radius.md} ${theme.transition} ${
                isActive ? theme.colors.primary.light + ' shadow-sm' : 'group-hover:bg-slate-50'
              }`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-6 items-center mt-auto">
        <button className={`${styles.button.base} p-3 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 ${theme.radius.md}`}>
          <Settings size={20} />
        </button>
        <div className="relative group">
          <div className={`w-10 h-10 ${theme.radius.full} bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-emerald-500 cursor-pointer ${theme.transition}`}>
            <img src="https://picsum.photos/id/64/100/100" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${theme.colors.primary.main} border-2 border-white ${theme.radius.full}`}></div>
        </div>
        <button className={`${styles.button.base} p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 ${theme.radius.md}`}>
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
