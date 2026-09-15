import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      couponDiscount: 0,

      addItem: (product, quantity = 1, variations = {}, variationId = null) => {
        const key = `${product.id}-${JSON.stringify(variations)}`;
        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return { items: state.items.map((i) => i.key === key ? { ...i, quantity: i.quantity + quantity } : i) };
          }
          const price = product.sale_price || product.regular_price;
          return {
            items: [...state.items, {
              key, id: product.id, name: product.name, slug: product.slug,
              image: product.images?.[0] || '', price,
              regular_price: product.regular_price, sale_price: product.sale_price,
              quantity, variations, variation_id: variationId,
            }],
          };
        });
      },

      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQuantity: (key, quantity) => {
        if (quantity < 1) { get().removeItem(key); return; }
        set((state) => ({ items: state.items.map((i) => i.key === key ? { ...i, quantity } : i) }));
      },

      clearCart: () => set({ items: [], coupon: null, couponDiscount: 0 }),
      setCoupon: (coupon, discount) => set({ coupon, couponDiscount: discount }),
      removeCoupon: () => set({ coupon: null, couponDiscount: 0 }),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'ayasofya-cart', partialize: (s) => ({ items: s.items, coupon: s.coupon, couponDiscount: s.couponDiscount }) }
  )
);

export default useCartStore;
