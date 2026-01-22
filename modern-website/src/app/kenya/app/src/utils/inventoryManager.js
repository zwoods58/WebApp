import { supabase } from './supabase';
import { formatCurrency, parseCurrency } from './currency';
import { formatDate, getRelativeTime } from './dateTime';

/**
 * Inventory Management System
 * Handles products, stock levels, categories, and inventory analytics
 */

export class InventoryManager {
  constructor() {
    this.storageKey = 'beezee_inventory_cache';
    this.categories = [
      'Electronics',
      'Clothing & Apparel',
      'Food & Beverages',
      'Home & Garden',
      'Health & Beauty',
      'Sports & Outdoors',
      'Books & Media',
      'Toys & Games',
      'Office Supplies',
      'Tools & Hardware',
      'Automotive',
      'Other'
    ];
  }

  /**
   * Get all products with filtering and pagination
   */
  async getProducts(userId, filters = {}, pagination = {}) {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      query = this.applyFilters(query, filters);

      // Apply sorting
      if (filters.sortBy) {
        const ascending = filters.sortOrder === 'asc';
        query = query.order(filters.sortBy, { ascending });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (pagination.limit) {
        query = query.limit(pagination.limit);
      }
      if (pagination.offset) {
        query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Format products for display
      const formattedProducts = data.map(product => this.formatProduct(product));

      return {
        success: true,
        products: formattedProducts,
        total: count || 0,
        filters: this.getAppliedFilters(filters)
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return {
        success: false,
        products: [],
        total: 0,
        error: 'Failed to load products'
      };
    }
  }

  /**
   * Apply filters to product query
   */
  applyFilters(query, filters) {
    // Category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Stock status filter
    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case 'in_stock':
          query = query.gt('quantity', 0);
          break;
        case 'low_stock':
          query = query.lte('quantity', 'min_stock_level').gt('quantity', 0);
          break;
        case 'out_of_stock':
          query = query.eq('quantity', 0);
          break;
      }
    }

    // Price range filter
    if (filters.minPrice) {
      query = query.gte('price', parseFloat(parseCurrency(filters.minPrice)));
    }
    if (filters.maxPrice) {
      query = query.lte('price', parseFloat(parseCurrency(filters.maxPrice)));
    }

    // Search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }

    return query;
  }

  /**
   * Get applied filters summary
   */
  getAppliedFilters(filters) {
    const applied = [];
    
    if (filters.category && filters.category !== 'all') {
      applied.push(`Category: ${filters.category}`);
    }
    if (filters.stockStatus) {
      applied.push(`Stock: ${filters.stockStatus.replace('_', ' ')}`);
    }
    if (filters.search) {
      applied.push(`Search: "${filters.search}"`);
    }

    return applied;
  }

  /**
   * Format product for display
   */
  formatProduct(product) {
    const stockStatus = this.getStockStatus(product);
    const totalValue = product.price * product.quantity;
    const profitMargin = product.price > product.cost ? ((product.price - product.cost) / product.price) * 100 : 0;

    return {
      ...product,
      formattedPrice: formatCurrency(product.price),
      formattedCost: formatCurrency(product.cost),
      formattedTotalValue: formatCurrency(totalValue),
      formattedProfitMargin: `${profitMargin.toFixed(1)}%`,
      stockStatus,
      stockStatusColor: this.getStockStatusColor(stockStatus),
      isLowStock: stockStatus === 'low_stock',
      isOutOfStock: stockStatus === 'out_of_stock',
      relativeTime: getRelativeTime(product.created_at)
    };
  }

  /**
   * Get stock status
   */
  getStockStatus(product) {
    if (product.quantity === 0) return 'out_of_stock';
    if (product.quantity <= product.min_stock_level) return 'low_stock';
    return 'in_stock';
  }

  /**
   * Get stock status color
   */
  getStockStatusColor(status) {
    switch (status) {
      case 'in_stock': return 'green';
      case 'low_stock': return 'yellow';
      case 'out_of_stock': return 'red';
      default: return 'gray';
    }
  }

  /**
   * Create new product
   */
  async createProduct(userId, productData) {
    try {
      const product = {
        user_id: userId,
        name: productData.name,
        description: productData.description || '',
        category: productData.category,
        sku: productData.sku || this.generateSKU(),
        barcode: productData.barcode || '',
        price: parseFloat(parseCurrency(productData.price)),
        cost: parseFloat(parseCurrency(productData.cost || 0)),
        quantity: parseInt(productData.quantity || 0),
        min_stock_level: parseInt(productData.minStockLevel || 5),
        supplier: productData.supplier || '',
        image_url: productData.imageUrl || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;

      // Cache locally for offline access
      this.cacheProduct(data);

      return {
        success: true,
        product: this.formatProduct(data)
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: 'Failed to create product'
      };
    }
  }

  /**
   * Update existing product
   */
  async updateProduct(productId, updates) {
    try {
      const updateData = {
        ...updates,
        price: updates.price ? parseFloat(parseCurrency(updates.price)) : undefined,
        cost: updates.cost ? parseFloat(parseCurrency(updates.cost)) : undefined,
        quantity: updates.quantity !== undefined ? parseInt(updates.quantity) : undefined,
        min_stock_level: updates.minStockLevel !== undefined ? parseInt(updates.minStockLevel) : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        product: this.formatProduct(data)
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        error: 'Failed to update product'
      };
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: 'Failed to delete product'
      };
    }
  }

  /**
   * Generate SKU
   */
  generateSKU() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SKU-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Update stock quantity
   */
  async updateStock(productId, quantity, operation = 'set') {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      let newQuantity;
      switch (operation) {
        case 'add':
          newQuantity = product.quantity + quantity;
          break;
        case 'subtract':
          newQuantity = Math.max(0, product.quantity - quantity);
          break;
        case 'set':
        default:
          newQuantity = quantity;
          break;
      }

      return await this.updateProduct(productId, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating stock:', error);
      return {
        success: false,
        error: 'Failed to update stock'
      };
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(userId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .lte('quantity', 'min_stock_level')
        .gt('quantity', 0)
        .order('quantity', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        alerts: data.map(product => ({
          ...product,
          formattedPrice: formatCurrency(product.price),
          stockNeeded: product.min_stock_level - product.quantity,
          urgency: this.getStockUrgency(product)
        }))
      };
    } catch (error) {
      console.error('Error getting low stock alerts:', error);
      return {
        success: false,
        alerts: []
      };
    }
  }

  /**
   * Get stock urgency level
   */
  getStockUrgency(product) {
    const ratio = product.quantity / product.min_stock_level;
    if (ratio <= 0.2) return 'critical';
    if (ratio <= 0.5) return 'high';
    return 'medium';
  }

  /**
   * Get inventory analytics
   */
  async getInventoryAnalytics(userId) {
    try {
      const { products } = await this.getProducts(userId, {}, { limit: 10000 });
      
      const analytics = {
        totalProducts: products.length,
        totalValue: 0,
        totalCost: 0,
        totalProfit: 0,
        averagePrice: 0,
        averageCost: 0,
        stockLevels: {
          inStock: 0,
          lowStock: 0,
          outOfStock: 0
        },
        categories: {},
        topProducts: [],
        lowStockItems: [],
        deadStock: []
      };

      products.forEach(product => {
        const totalValue = product.price * product.quantity;
        const totalCost = product.cost * product.quantity;
        const profit = totalValue - totalCost;

        analytics.totalValue += totalValue;
        analytics.totalCost += totalCost;
        analytics.totalProfit += profit;

        // Stock levels
        analytics.stockLevels[product.stockStatus === 'in_stock' ? 'inStock' : 
                              product.stockStatus === 'low_stock' ? 'lowStock' : 'outOfStock']++;

        // Category analytics
        if (!analytics.categories[product.category]) {
          analytics.categories[product.category] = {
            count: 0,
            value: 0,
            profit: 0
          };
        }
        analytics.categories[product.category].count++;
        analytics.categories[product.category].value += totalValue;
        analytics.categories[product.category].profit += profit;

        // Low stock items
        if (product.isLowStock) {
          analytics.lowStockItems.push({
            ...product,
            stockNeeded: product.min_stock_level - product.quantity
          });
        }

        // Dead stock (no sales in last 30 days)
        const daysSinceCreated = Math.floor((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated > 30 && product.quantity > 0) {
          analytics.deadStock.push({
            ...product,
            daysInStock: daysSinceCreated,
            tiedUpValue: totalValue
          });
        }
      });

      // Calculate averages
      analytics.averagePrice = products.length > 0 ? analytics.totalValue / products.reduce((sum, p) => sum + p.quantity, 0) : 0;
      analytics.averageCost = products.length > 0 ? analytics.totalCost / products.reduce((sum, p) => sum + p.quantity, 0) : 0;

      // Top products by value
      analytics.topProducts = products
        .map(p => ({
          ...p,
          totalValue: p.price * p.quantity
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 10);

      // Format monetary values
      analytics.formattedTotalValue = formatCurrency(analytics.totalValue);
      analytics.formattedTotalCost = formatCurrency(analytics.totalCost);
      analytics.formattedTotalProfit = formatCurrency(analytics.totalProfit);
      analytics.formattedAveragePrice = formatCurrency(analytics.averagePrice);
      analytics.formattedAverageCost = formatCurrency(analytics.averageCost);

      // Format category values
      Object.keys(analytics.categories).forEach(category => {
        analytics.categories[category].formattedValue = formatCurrency(analytics.categories[category].value);
        analytics.categories[category].formattedProfit = formatCurrency(analytics.categories[category].profit);
      });

      return { success: true, analytics };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        success: false,
        analytics: null
      };
    }
  }

  /**
   * Bulk import products from CSV
   */
  async bulkImportProducts(userId, csvData) {
    try {
      const products = [];
      const errors = [];

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        
        try {
          const product = {
            user_id: userId,
            name: row.name || `Product ${i + 1}`,
            description: row.description || '',
            category: row.category || 'Other',
            sku: row.sku || this.generateSKU(),
            barcode: row.barcode || '',
            price: parseFloat(parseCurrency(row.price || 0)),
            cost: parseFloat(parseCurrency(row.cost || 0)),
            quantity: parseInt(row.quantity || 0),
            min_stock_level: parseInt(row.minStockLevel || 5),
            supplier: row.supplier || '',
            image_url: row.imageUrl || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          products.push(product);
        } catch (error) {
          errors.push({
            row: i + 1,
            error: error.message,
            data: row
          });
        }
      }

      if (products.length > 0) {
        const { data, error } = await supabase
          .from('products')
          .insert(products)
          .select();

        if (error) throw error;

        return {
          success: true,
          imported: data.length,
          total: csvData.length,
          errors,
          products: data.map(p => this.formatProduct(p))
        };
      } else {
        return {
          success: false,
          imported: 0,
          total: csvData.length,
          errors,
          message: 'No valid products to import'
        };
      }
    } catch (error) {
      console.error('Error bulk importing:', error);
      return {
        success: false,
        imported: 0,
        total: csvData.length,
        errors: [{ error: error.message }],
        message: 'Failed to import products'
      };
    }
  }

  /**
   * Export products to CSV
   */
  async exportToCSV(userId, filters = {}) {
    try {
      const { products } = await this.getProducts(userId, filters, { limit: 10000 });
      
      const headers = [
        'Product ID',
        'SKU',
        'Name',
        'Description',
        'Category',
        'Price',
        'Cost',
        'Quantity',
        'Min Stock Level',
        'Supplier',
        'Barcode',
        'Total Value',
        'Stock Status',
        'Created At'
      ];

      const csvContent = [
        headers.join(','),
        ...products.map(p => [
          p.id,
          p.sku,
          `"${p.name}"`,
          `"${p.description}"`,
          p.category,
          p.price,
          p.cost,
          p.quantity,
          p.min_stock_level,
          `"${p.supplier}"`,
          p.barcode,
          p.price * p.quantity,
          p.stockStatus,
          p.created_at
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const filename = `beezee_inventory_${new Date().toISOString().split('T')[0]}.csv`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return {
        success: false,
        error: 'Failed to export products'
      };
    }
  }

  /**
   * Cache product locally
   */
  cacheProduct(product) {
    try {
      const cached = this.getCachedProducts();
      cached.push(product);
      localStorage.setItem(this.storageKey, JSON.stringify(cached));
    } catch (error) {
      console.error('Error caching product:', error);
    }
  }

  /**
   * Get cached products
   */
  getCachedProducts() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading cached products:', error);
      return [];
    }
  }

  /**
   * Clear cached products
   */
  clearCache() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get available categories
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Get stock status options
   */
  getStockStatusOptions() {
    return [
      { value: 'all', label: 'All Products' },
      { value: 'in_stock', label: 'In Stock' },
      { value: 'low_stock', label: 'Low Stock' },
      { value: 'out_of_stock', label: 'Out of Stock' }
    ];
  }
}

// Create singleton instance
export const inventoryManager = new InventoryManager();
