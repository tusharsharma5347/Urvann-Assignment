import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        try {
          const parsedCart = JSON.parse(guestCart);
          setCart(parsedCart);
        } catch (error) {
          console.error('Error parsing guest cart:', error);
          localStorage.removeItem('guestCart');
        }
      }
    }
  }, [isAuthenticated]);

  // Fetch cart from database when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      migrateGuestCartAndFetch();
    }
  }, [isAuthenticated]);

  const migrateGuestCartAndFetch = async () => {
    try {
      setLoading(true);
      
      // First, get the guest cart from localStorage
      const guestCart = localStorage.getItem('guestCart');
      let guestItems = [];
      
      if (guestCart) {
        try {
          const parsedCart = JSON.parse(guestCart);
          guestItems = parsedCart.items || [];
          console.log('Found guest cart items:', guestItems.length);
        } catch (error) {
          console.error('Error parsing guest cart:', error);
        }
      }

      // Fetch user's existing cart from database
      const response = await cartAPI.getCart();
      const userCart = response.data;
      console.log('User cart from database:', userCart);
      
      // If user has no items in database but has guest items, migrate them
      if (guestItems.length > 0 && (!userCart.items || userCart.items.length === 0)) {
        console.log('Migrating guest cart items to user account...');
        
        // Add each guest item to the user's cart
        for (const item of guestItems) {
          try {
            console.log('Migrating item:', item.plant._id, 'quantity:', item.quantity);
            await cartAPI.addToCart(item.plant._id, item.quantity);
          } catch (error) {
            console.error(`Failed to migrate item ${item.plant._id}:`, error);
          }
        }
        
        // Fetch the updated cart
        const updatedResponse = await cartAPI.getCart();
        const updatedCart = updatedResponse.data;
        setCart(updatedCart);
        console.log('Updated cart after migration:', updatedCart);
        
        // Clear the guest cart from localStorage
        localStorage.removeItem('guestCart');
        
        toast.success(`${guestItems.length} item(s) moved to your account!`);
      } else {
        // Set the user's existing cart
        setCart(userCart);
        console.log('Setting existing user cart:', userCart);
      }
    } catch (error) {
      console.error('Error migrating cart:', error);
      // If migration fails, just set empty cart
      setCart({ items: [], total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Update cart state when cart changes
  const updateCartState = (newCart) => {
    setCart(newCart);
  };

  // Enhanced addToCart with better state management
  const addToCart = async (plantId, quantity = 1) => {
    if (isAuthenticated) {
      // Authenticated user - save to database
      try {
        setLoading(true);
        const response = await cartAPI.addToCart(plantId, quantity);
        const updatedCart = response.data;
        setCart(updatedCart);
        toast.success('Added to cart successfully!');
        return true;
      } catch (error) {
        // If item already exists, try to update quantity
        if (error.response?.status === 409) {
          try {
            const currentQuantity = getItemQuantity(plantId);
            const newQuantity = currentQuantity + quantity;
            const updateResponse = await cartAPI.updateQuantity(plantId, newQuantity);
            const updatedCart = updateResponse.data;
            setCart(updatedCart);
            toast.success('Cart updated successfully!');
            return true;
          } catch (updateError) {
            toast.error('Failed to update cart quantity');
            return false;
          }
        } else {
          toast.error(error.response?.data?.error || 'Failed to add to cart');
          return false;
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - save to localStorage
      try {
        const plantResponse = await fetch(`/api/plants/${plantId}`);
        const plantData = await plantResponse.json();
        const plant = plantData.data;

        const updatedCart = { ...cart };
        const existingItem = updatedCart.items.find(item => item.plant._id === plantId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          updatedCart.items.push({ 
            plant: plant, 
            quantity: quantity,
            addedAt: new Date().toISOString()
          });
        }

        // Recalculate totals
        updatedCart.itemCount = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
        updatedCart.total = updatedCart.items.reduce((sum, item) => sum + (item.plant.price || 0) * item.quantity, 0);

        setCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        toast.success('Added to cart successfully!');
        return true;
      } catch (error) {
        toast.error('Failed to add to cart');
        return false;
      }
    }
  };

  const updateQuantity = async (plantId, quantity) => {
    if (isAuthenticated) {
      // Authenticated user - update in database
      try {
        setLoading(true);
        const response = await cartAPI.updateQuantity(plantId, quantity);
        const updatedCart = response.data;
        setCart(updatedCart);
        toast.success('Cart updated successfully!');
        return true;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to update cart');
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - update in localStorage
      const updatedCart = { ...cart };
      const item = updatedCart.items.find(item => item.plant._id === plantId);
      
      if (item) {
        if (quantity <= 0) {
          updatedCart.items = updatedCart.items.filter(item => item.plant._id !== plantId);
        } else {
          item.quantity = quantity;
        }
        
        // Recalculate totals
        updatedCart.itemCount = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
        updatedCart.total = updatedCart.items.reduce((sum, item) => sum + (item.plant.price || 0) * item.quantity, 0);
        
        setCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        toast.success('Cart updated successfully!');
        return true;
      }
      return false;
    }
  };

  const removeFromCart = async (plantId) => {
    if (isAuthenticated) {
      // Authenticated user - remove from database
      try {
        setLoading(true);
        const response = await cartAPI.removeFromCart(plantId);
        const updatedCart = response.data;
        setCart(updatedCart);
        toast.success('Item removed from cart!');
        return true;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to remove item');
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - remove from localStorage
      const updatedCart = { ...cart };
      updatedCart.items = updatedCart.items.filter(item => item.plant._id !== plantId);
      
      // Recalculate totals
      updatedCart.itemCount = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
      updatedCart.total = updatedCart.items.reduce((sum, item) => sum + (item.plant.price || 0) * item.quantity, 0);
      
      setCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      toast.success('Item removed from cart!');
      return true;
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      // Authenticated user - clear from database
      try {
        setLoading(true);
        const response = await cartAPI.clearCart();
        const updatedCart = response.data;
        setCart(updatedCart);
        toast.success('Cart cleared successfully!');
        return true;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to clear cart');
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - clear from localStorage
      const emptyCart = { items: [], total: 0, itemCount: 0 };
      setCart(emptyCart);
      localStorage.removeItem('guestCart');
      toast.success('Cart cleared successfully!');
      return true;
    }
  };

  const getCartCount = () => {
    return cart.itemCount || 0;
  };

  const getCartTotal = () => {
    return cart.total || 0;
  };

  const getCartItems = () => {
    return cart.items || [];
  };

  const isInCart = (plantId) => {
    return cart.items.some(item => item.plant._id === plantId);
  };

  const getItemQuantity = (plantId) => {
    const item = cart.items.find(item => item.plant._id === plantId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    getCartItems,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
