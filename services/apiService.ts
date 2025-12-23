
import { MenuItem, Order, NewProduct } from '../types';
import { API_ENDPOINT, INITIAL_MENU } from '../constants';

// Helper to process image URLs for display
const processImageUrl = (url: string): string => {
  if (!url) return '';

  // If it's already a valid URL (Unsplash, etc.), return as-is
  if (url.startsWith('https://images.unsplash.com')) {
    return url;
  }

  // For lh3 URLs, ensure they have size parameter
  if (url.includes('lh3.googleusercontent.com/d/') && !url.includes('=s')) {
    return url + '=s800';
  }

  return url;
};

export const apiService = {
  async fetchMenu(): Promise<MenuItem[]> {
    if (!API_ENDPOINT || API_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
      return INITIAL_MENU;
    }
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();

      if (Array.isArray(data)) {
        // Process image URLs for each item
        return data.map(item => ({
          ...item,
          image: processImageUrl(item.image || '')
        }));
      }
      return INITIAL_MENU;
    } catch (error) {
      console.error('Error fetching menu:', error);
      return INITIAL_MENU;
    }
  },

  async saveOrder(order: Order): Promise<boolean> {
    if (!API_ENDPOINT || API_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
      console.log('No API endpoint configured');
      return false;
    }
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'SAVE_ORDER', data: order }),
      });

      // Google Apps Script returns redirect for POST
      if (response.ok || response.redirected) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  },

  async addProduct(product: NewProduct): Promise<boolean> {
    if (!API_ENDPOINT || API_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
      console.log('No API endpoint configured');
      return false;
    }
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'ADD_PRODUCT', data: product }),
      });

      // Google Apps Script returns redirect for POST
      if (response.ok || response.redirected) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  },

  async updateStock(productId: string, adjustment: number): Promise<boolean> {
    if (!API_ENDPOINT || API_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
      console.log('No API endpoint configured');
      return false;
    }
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'UPDATE_STOCK',
          data: { productId, adjustment }
        }),
      });

      if (response.ok || response.redirected) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating stock:', error);
      return false;
    }
  }
};
