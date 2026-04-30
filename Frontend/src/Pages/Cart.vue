<template>
  <div class="cart-page">
    <div class="container">
      <header class="cart-header">
        <h1 class="title">My Reading <span class="accent">Collection</span> <AppIcon name="cart" :size="32" /></h1>
        <p class="subtitle">Review your selected titles before checkout.</p>
      </header>

      <div v-if="cartStore.loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your cart...</p>
      </div>

      <div v-else-if="cartStore.items.length === 0" class="empty-cart">
        <div class="empty-icon"><AppIcon name="book" :size="64" /></div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any books yet.</p>
        <router-link to="/" class="btn-primary">Browse Library</router-link>
      </div>

      <div v-else class="cart-content">
        <div class="items-list">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-cover">
              <img :src="item.book.image || 'https://via.placeholder.com/100x150?text=Book'" :alt="item.book.title" />
            </div>
            <div class="item-details">
              <span class="category">{{ item.book.category }}</span>
              <h3 class="book-title">{{ item.book.title }}</h3>
              <p class="author">by {{ item.book.author?.nom || 'Unknown' }}</p>
              <p class="price-unit">{{ item.book.price }} TND / unit</p>
            </div>
            <div class="item-actions">
              <div class="quantity-control">
                <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="q-btn">
                  <AppIcon name="minus" :size="12" />
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="q-btn">
                  <AppIcon name="plus" :size="12" />
                </button>
              </div>
              <p class="item-total">{{ (item.book.price * item.quantity).toFixed(2) }} TND</p>
              <button @click="cartStore.removeItem(item.id)" class="remove-btn" title="Remove Item">
                <AppIcon name="trash" :size="20" />
              </button>
            </div>
          </div>
        </div>

        <aside class="cart-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>
            <div class="summary-row">
              <span>Items Count</span>
              <span>{{ cartStore.cartCount }}</span>
            </div>
            <div class="summary-row total">
              <span>Total Price</span>
              <span>{{ cartStore.cartTotal.toFixed(2) }} TND</span>
            </div>
            <button class="btn-checkout" @click="handleCheckout">Proceed to Checkout</button>
            <button class="btn-clear" @click="cartStore.clearCart">Clear Cart</button>
          </div>
          <div class="guarantee">
            <span class="icon"><AppIcon name="lock" :size="24" /></span>
            <p>Secure checkout and instant access to digital copies.</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { UseCartStore } from '../Store/UseCartStore'
import AppIcon from '../components/ui/AppIcon.vue'

const cartStore = UseCartStore()

onMounted(() => {
  cartStore.fetchCart()
})

function handleCheckout() {
  alert('Checkout functionality coming soon! Thank you for your interest.')
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #faf6ef;
  color: #1a1208;
  font-family: 'Inter', sans-serif;
  padding: 64px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  margin-bottom: 48px;
  text-align: center;
}

.title {
  font-family: 'Georgia', serif;
  font-size: 36px;
  margin: 0 0 8px;
}

.accent {
  color: #7c5533;
  font-style: italic;
}

.subtitle {
  color: #8c7b6a;
  font-size: 16px;
}

/* States */
.loading-state, .empty-cart {
  padding: 80px 20px;
  text-align: center;
  background: #fff;
  border-radius: 24px;
  border: 2px solid #e8ddc8;
  box-shadow: 0 12px 32px rgba(26, 18, 8, 0.05);
}

.empty-icon { font-size: 64px; margin-bottom: 24px; }
.empty-cart h2 { font-family: 'Georgia', serif; font-size: 24px; margin-bottom: 12px; }
.empty-cart p { color: #8c7b6a; margin-bottom: 32px; }

.btn-primary {
  display: inline-block;
  padding: 14px 32px;
  background: #c2a87a;
  color: #1a1208;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 700;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #d4bc92;
  transform: translateY(-2px);
}

/* Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  background: #fff;
  border: 1.5px solid #e8ddc8;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: center;
  transition: all 0.3s;
}

.cart-item:hover {
  border-color: #c2a87a;
  box-shadow: 0 8px 24px rgba(26, 18, 8, 0.05);
}

.item-cover img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.item-details {
  flex: 1;
}

.category {
  font-size: 11px;
  text-transform: uppercase;
  color: #c2a87a;
  font-weight: 700;
  letter-spacing: 1px;
}

.book-title {
  margin: 4px 0;
  font-size: 18px;
  font-weight: 700;
  font-family: 'Georgia', serif;
}

.author {
  color: #8c7b6a;
  font-size: 14px;
  margin-bottom: 12px;
}

.price-unit {
  font-size: 13px;
  color: #7c5533;
  font-weight: 600;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 32px;
}

.quantity-control {
  display: flex;
  align-items: center;
  background: #faf6ef;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid #e8ddc8;
}

.q-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #fff;
  color: #1a1208;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.q-btn:hover { background: #c2a87a; color: #fff; }

.quantity {
  width: 40px;
  text-align: center;
  font-weight: 700;
}

.item-total {
  font-size: 18px;
  font-weight: 700;
  width: 100px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #8c7b6a;
  transition: color 0.2s;
}

.remove-btn:hover { color: #b94030; }

/* Summary */
.summary-card {
  background: #1a1208;
  color: #c2a87a;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(26, 18, 8, 0.2);
}

.summary-card h3 {
  color: #fff;
  font-family: 'Georgia', serif;
  font-size: 20px;
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
}

.summary-row.total {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(194, 168, 122, 0.2);
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.btn-checkout {
  width: 100%;
  padding: 16px;
  background: #c2a87a;
  color: #1a1208;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  margin-top: 32px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-checkout:hover { background: #d4bc92; transform: translateY(-2px); }

.btn-clear {
  width: 100%;
  margin-top: 12px;
  background: transparent;
  border: 1px solid rgba(194, 168, 122, 0.3);
  color: #8c7b6a;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover { border-color: #c2a87a; color: #c2a87a; }

.guarantee {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  padding: 0 16px;
}

.guarantee .icon { font-size: 24px; }
.guarantee p { font-size: 12px; color: #8c7b6a; line-height: 1.4; }

@media (max-width: 1024px) {
  .cart-content { grid-template-columns: 1fr; }
  .cart-summary { order: -1; }
}

@media (max-width: 768px) {
  .cart-item { flex-direction: column; text-align: center; }
  .item-actions { width: 100%; justify-content: space-between; }
  .item-total { width: auto; }
}
</style>
