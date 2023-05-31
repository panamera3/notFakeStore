import React from 'react';
import { ProductInCart } from '../../../typings';
import { Space, Button, Typography } from 'antd';

export default () => {
  const { Title } = Typography;
  const [items, setItems] = React.useState<ProductInCart[]>([]);

  React.useEffect(() => {
    const cartItems = localStorage.getItem('cartItems');
    const itemsPage = cartItems ? JSON.parse(cartItems) : [];
    setItems(itemsPage);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const deleteFromCart = (itemId: number) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
  };

  const decrease = (itemId: number) => {
    const newItem: ProductInCart = items.find((item) => item.id === itemId) as ProductInCart;
    if (newItem.quantity >= 2) {
      newItem.quantity -= 1;

      const newItems: ProductInCart[] = [...items, newItem];
      const uniqueItems: ProductInCart[] = [
        ...new Set(newItems.map((obj) => JSON.stringify(obj))),
      ].map((str) => JSON.parse(str));
      setItems(uniqueItems);
      return; 
    }
    deleteFromCart(itemId);
  };

  const increase = (itemId: number) => {
    const newItem: ProductInCart = items.find((item) => item.id === itemId) as ProductInCart;
    newItem.quantity += 1;

    const newItems: ProductInCart[] = [...items, newItem];
    const uniqueItems: ProductInCart[] = [
      ...new Set(newItems.map((obj) => JSON.stringify(obj))),
    ].map((str) => JSON.parse(str));
    setItems(uniqueItems);
  };

  return (
    <Space direction="vertical">
      {items.length > 0 && (
        <Space direction="vertical">
          {items.map((item) => (
            <Space key={item.id}>
              <Title level={5}>{item.title}</Title>
              <Button onClick={() => decrease(item.id)}>-</Button>
              <p>{item.quantity}</p>
              <Button onClick={() => increase(item.id)}>+</Button>
              <p>{item.quantity * item.price}$</p>
              <Button danger onClick={() => deleteFromCart(item.id)}>
                Удалить
              </Button>
            </Space>
          ))}
          <Title level={3}>
            Общая сумма покупки:{' '}
            {items.reduce(
              (total, item) => total + item.quantity * item.price,
              0,
            )}
            $
          </Title>
        </Space>
      )}
      {!items.length && <Title>Ваша корзина пуста.</Title>}
    </Space>
  );
};
