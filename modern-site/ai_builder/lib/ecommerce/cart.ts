/**
 * E-Commerce Cart Management
 * Handles shopping cart functionality
 */

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  sku?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
}

/**
 * Get cart from localStorage
 */
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, subtotal: 0, tax: 0, shipping: 0 }
  }

  const cartJson = localStorage.getItem('cart')
  if (!cartJson) {
    return { items: [], total: 0, subtotal: 0, tax: 0, shipping: 0 }
  }

  try {
    return JSON.parse(cartJson)
  } catch {
    return { items: [], total: 0, subtotal: 0, tax: 0, shipping: 0 }
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('cart', JSON.stringify(cart))
}

/**
 * Add item to cart
 */
export function addToCart(item: Omit<CartItem, 'quantity'>): Cart {
  const cart = getCart()
  const existingItem = cart.items.find((i) => i.productId === item.productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.items.push({ ...item, quantity: 1 })
  }

  cart.subtotal = calculateSubtotal(cart.items)
  cart.tax = calculateTax(cart.subtotal)
  cart.shipping = calculateShipping(cart.subtotal)
  cart.total = cart.subtotal + cart.tax + cart.shipping

  saveCart(cart)
  return cart
}

/**
 * Remove item from cart
 */
export function removeFromCart(productId: string): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((item) => item.productId !== productId)

  cart.subtotal = calculateSubtotal(cart.items)
  cart.tax = calculateTax(cart.subtotal)
  cart.shipping = calculateShipping(cart.subtotal)
  cart.total = cart.subtotal + cart.tax + cart.shipping

  saveCart(cart)
  return cart
}

/**
 * Update item quantity
 */
export function updateQuantity(productId: string, quantity: number): Cart {
  const cart = getCart()
  const item = cart.items.find((i) => i.productId === productId)

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = quantity
  }

  cart.subtotal = calculateSubtotal(cart.items)
  cart.tax = calculateTax(cart.subtotal)
  cart.shipping = calculateShipping(cart.subtotal)
  cart.total = cart.subtotal + cart.tax + cart.shipping

  saveCart(cart)
  return cart
}

/**
 * Clear cart
 */
export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], total: 0, subtotal: 0, tax: 0, shipping: 0 }
  saveCart(emptyCart)
  return emptyCart
}

/**
 * Calculate subtotal
 */
function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/**
 * Calculate tax (default 10%)
 */
function calculateTax(subtotal: number, taxRate = 0.1): number {
  return subtotal * taxRate
}

/**
 * Calculate shipping (free over $100, otherwise $10)
 */
function calculateShipping(subtotal: number): number {
  return subtotal >= 100 ? 0 : 10
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}



