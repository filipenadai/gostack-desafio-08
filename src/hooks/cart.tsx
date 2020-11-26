import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMartketplace:cart',
      );

      if (storagedProducts) {
        setProducts([...JSON.parse(storagedProducts)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const newProducts = [...products];

      const existsProduct = products.find(p => p.id === product.id);

      if (existsProduct) existsProduct.quantity += 1;

      newProducts.push(existsProduct || { ...product, quantity: 1 });

      setProducts(newProducts);

      await AsyncStorage.setItem(
        '@GoMartketplace:cart',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const auxProducts = [...products];
      const updateProductIndex = auxProducts.findIndex(p => p.id === id);

      auxProducts[updateProductIndex].quantity += 1;

      setProducts(auxProducts);
      AsyncStorage.setItem('@GoMartketplace:cart', JSON.stringify(auxProducts));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const auxProducts = [...products];
      const updateProductIndex = auxProducts.findIndex(p => p.id === id);

      auxProducts[updateProductIndex].quantity -= 1;

      if (auxProducts[updateProductIndex].quantity <= 0) {
        auxProducts.splice(updateProductIndex, 1);
      }

      setProducts(auxProducts);
      AsyncStorage.setItem('@GoMartketplace:cart', JSON.stringify(auxProducts));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
