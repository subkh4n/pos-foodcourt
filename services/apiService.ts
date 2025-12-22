
import { MenuItem, Order, NewProduct } from '../types';
import { API_ENDPOINT, INITIAL_MENU } from '../constants';

export const apiService = {
  async fetchMenu(): Promise<MenuItem[]> {
    if (!API_ENDPOINT || API_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
      return INITIAL_MENU;
    }
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      return Array.isArray(data) ? data : INITIAL_MENU;
    } catch (error) {
      console.error('Error fetching menu:', error);
      return INITIAL_MENU;
    }
  },

  async saveOrder(order: Order): Promise<boolean> {
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'SAVE_ORDER', data: order }),
      });
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  },

  async addProduct(product: NewProduct): Promise<boolean> {
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'ADD_PRODUCT', data: product }),
      });
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  }
};
