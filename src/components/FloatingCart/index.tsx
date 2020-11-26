import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const { cartTotalValue } = products.reduce(
      (accumulator, product) => {
        accumulator.cartTotalValue += product.price * product.quantity;

        return accumulator;
      },
      {
        cartTotalValue: 0,
      },
    );

    return formatValue(cartTotalValue);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const { cartTotalItems } = products.reduce(
      (accumulator, product) => {
        accumulator.cartTotalItems += product.quantity;

        return accumulator;
      },
      {
        cartTotalItems: 0,
      },
    );

    return cartTotalItems;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
