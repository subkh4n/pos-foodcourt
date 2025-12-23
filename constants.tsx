
import { MenuItem } from './types';

// Replace with your Google Apps Script URL after deployment
export const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxRCPRFcygnamXKSBNR6nc9w9P_rchGLrl9vZwCoWpA8pKoly0f1eJp8vZNBb9XRsoTeQ/exec';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Goreng Special',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1601050638917-3f30956273c1?auto=format&fit=crop&q=80&w=400',
    category: 'Food',
    stock: 49,
    // Fix: Added missing required property 'available'
    available: 'TRUE'
  },
  {
    id: '2',
    name: 'Ayam Bakar Madu',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=400',
    category: 'Food',
    stock: 20,
    // Fix: Added missing required property 'available'
    available: 'TRUE'
  },
  {
    id: '3',
    name: 'Cheese Burger',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400',
    category: 'Food',
    stock: 15,
    // Fix: Added missing required property 'available'
    available: 'TRUE'
  },
  {
    id: '4',
    name: 'Mie Ayam Jamur',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=400',
    category: 'Food',
    stock: 0,
    // Fix: Added missing required property 'available'
    available: 'FALSE'
  },
  {
    id: '5',
    name: 'Es Teh Manis',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400',
    category: 'Drinks',
    stock: 100,
    // Fix: Added missing required property 'available'
    available: 'TRUE'
  },
  {
    id: '6',
    name: 'Crispy Wings',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=400',
    category: 'Snack',
    stock: 12,
    // Fix: Added missing required property 'available'
    available: 'TRUE'
  },
  {
    id: '7',
    name: 'Chocolate Milkshake',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400',
    category: 'Drinks',
    stock: 25,
    // Fix: Added missing required property 'available'
    available: 'TRUE'
  },
  {
    id: '8',
    name: 'Fresh Orange Juice',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400',
    category: 'Drinks',
    stock: 30,
    // Fix: Added missing required property 'available'
    available: 'TRUE'
  }
];
