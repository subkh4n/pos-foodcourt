
import React, { useState, useRef } from 'react';
import { Upload, X, Package, Save, FileUp } from 'lucide-react';
import { Category, NewProduct } from '../types';
import { theme, styles } from '../design-system';

interface ProductFormProps {
  onSave: (product: NewProduct) => void;
  onCancel: () => void;
  isLoading: boolean;
}

type ProductType = 'physical' | 'nonstock' | 'service';

const ProductForm: React.FC<ProductFormProps> = ({ onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<NewProduct>({
    id: '',
    name: '',
    category: 'Food',
    price: 0,
    stock: 0,
    stokType: 'Pcs',
    available: true,
    description: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [featured, setFeatured] = useState(false);
  const [productType, setProductType] = useState<ProductType>('physical');
  const [canBeSold, setCanBeSold] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImagePreview(reader.result as string);
        setFormData(prev => ({ 
          ...prev, 
          imageBlob: base64String,
          imageFileName: file.name 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoryOptions = [
    { value: 'Food', label: 'Main Course' },
    { value: 'Drinks', label: 'Drinks' },
    { value: 'Snack', label: 'Snack' },
    { value: 'Dessert', label: 'Dessert' },
  ];

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button 
      type="button"
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-0.5 ${theme.transition} ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-sm ${theme.transition} ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  // Radio Button Component
  const RadioOption = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer py-2">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme.transition} ${
        checked ? 'border-emerald-500' : 'border-slate-300'
      }`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
      </div>
      <span className={`text-sm font-medium ${checked ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
    </label>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={styles.heading.h1}>Add New Product</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Inventory &gt; <span className="text-emerald-500">New Product</span>
          </p>
        </div>
        <button className={`${styles.button.base} ${styles.button.outline} px-5 py-2.5`}>
          <FileUp size={16} />
          <span>Import CSV</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Product Image */}
          <div className={`${styles.card} p-6`}>
            <h4 className="font-bold text-slate-800 mb-4">Product Image</h4>
            <div 
              className={`border-2 border-dashed border-slate-200 ${theme.radius.xl} p-8 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden hover:border-emerald-400 ${theme.transition} cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg z-10"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 bg-slate-100 ${theme.radius.lg} flex items-center justify-center mb-3`}>
                    <Upload size={24} className="text-slate-400" />
                  </div>
                  <p className="font-semibold text-emerald-500 text-sm">Upload Image</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Status */}
          <div className={`${styles.card} p-6`}>
            <h4 className="font-bold text-slate-800 mb-4">Status</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Available</span>
                <ToggleSwitch 
                  enabled={formData.available} 
                  onChange={() => setFormData(p => ({...p, available: !p.available}))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Featured Item</span>
                <ToggleSwitch enabled={featured} onChange={() => setFeatured(!featured)} />
              </div>
            </div>
          </div>

          {/* Product Type */}
          <div className={`${styles.card} p-6`}>
            <h4 className="font-bold text-slate-800 mb-4">Product Type</h4>
            <div className="space-y-1">
              <RadioOption 
                label="Physical Stock" 
                checked={productType === 'physical'} 
                onChange={() => setProductType('physical')} 
              />
              <RadioOption 
                label="Non-Stock Item" 
                checked={productType === 'nonstock'} 
                onChange={() => setProductType('nonstock')} 
              />
              <RadioOption 
                label="Service" 
                checked={productType === 'service'} 
                onChange={() => setProductType('service')} 
              />
            </div>
          </div>

          {/* Sales Options */}
          <div className={`${styles.card} p-6`}>
            <h4 className="font-bold text-slate-800 mb-4">Sales Options</h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-700">Can be sold</span>
                <p className="text-xs text-slate-400">Available for purchase</p>
              </div>
              <ToggleSwitch enabled={canBeSold} onChange={() => setCanBeSold(!canBeSold)} />
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`${styles.card} p-8`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name - Full Width */}
              <div className="md:col-span-2">
                <label className={styles.label + " mb-2 block"}>Product Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Special Fried Rice"
                  className={styles.input}
                  value={formData.name}
                  onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                />
              </div>

              {/* Category */}
              <div>
                <label className={styles.label + " mb-2 block"}>Category</label>
                <select 
                  className={styles.input + " appearance-none cursor-pointer"}
                  value={formData.category}
                  onChange={e => setFormData(p => ({...p, category: e.target.value as Category}))}
                >
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Current Stock */}
              <div>
                <label className={styles.label + " mb-2 block"}>Current Stock</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className={styles.input}
                  value={formData.stock || ''}
                  onChange={e => setFormData(p => ({...p, stock: parseInt(e.target.value) || 0}))}
                />
              </div>

              {/* Price */}
              <div>
                <label className={styles.label + " mb-2 block"}>Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">Rp</span>
                  <input 
                    required
                    type="number" 
                    placeholder="0"
                    className={styles.input + " pl-10"}
                    value={formData.price || ''}
                    onChange={e => setFormData(p => ({...p, price: parseInt(e.target.value) || 0}))}
                  />
                </div>
              </div>

              {/* SKU / Code */}
              <div>
                <label className={styles.label + " mb-2 block"}>SKU / Code</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. FD-001"
                  className={styles.input}
                  value={formData.id}
                  onChange={e => setFormData(p => ({...p, id: e.target.value}))}
                />
              </div>

              {/* Description - Full Width */}
              <div className="md:col-span-2">
                <label className={styles.label + " mb-2 block"}>Description</label>
                <textarea 
                  rows={4}
                  className={styles.input + " resize-none"}
                  placeholder="Describe the product taste, ingredients, etc."
                  value={formData.description}
                  onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className={`${styles.button.base} ${styles.button.outline} flex-1 py-4`}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className={`${styles.button.base} ${styles.button.primary} flex-1 py-4 bg-emerald-600 hover:bg-emerald-700`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
