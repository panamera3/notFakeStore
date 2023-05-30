import React from 'react';
import { Product, ProductInCart } from '../../../typings';
import { Space, Button, Typography } from 'antd';
import request from 'umi-request';

export default () => {
  const { Title } = Typography;
  const [products, setProducts] = React.useState<Product[]>([]);
  const [items, setItems] = React.useState<ProductInCart[]>([]);

  React.useEffect(() => {
    let cartItems = localStorage.getItem('cartItems');
    let itemsPage = cartItems ? JSON.parse(cartItems) : [];
    setItems(itemsPage);
    request('https://fakestoreapi.com/products').then((res) => {
      setProducts(res);
    });
  }, []);

  React.useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
    console.log('MY-ITEMS', items);
  }, [items]);

  const decrease = (itemId: number) => {
    let newItem = items.find((item) => item.id == itemId);
    if (newItem.quantity >= 2) {
      newItem.quantity -= 1;
      console.log('wiufghj', newItem);

      let newItems = [...items, newItem];
      let uniqueItems = [
        ...new Set(newItems.map((obj) => JSON.stringify(obj))),
      ].map((str) => JSON.parse(str));
      setItems(uniqueItems);
      return;
    }
    deleteFromCart(itemId);
  };

  const increase = (itemId: number) => {
    let newItem = items.find((item) => item.id == itemId);
    newItem.quantity += 1;
    console.log('wiufghj', newItem);

    let newItems = [...items, newItem];
    let uniqueItems = [
      ...new Set(newItems.map((obj) => JSON.stringify(obj))),
    ].map((str) => JSON.parse(str));
    setItems(uniqueItems);
  };

  const deleteFromCart = (itemId: number) => {
    let newItems = items.filter((item) => item.id != itemId);
    setItems(newItems);
  };

  return (
    <Space direction="vertical">
      {items.length > 0 && (
        <Space direction="vertical">
          {items.map((item) => {
            return (
              <Space>
                <Title level={5}>{item.title}</Title>
                <Button onClick={() => decrease(item.id)}>-</Button>
                <p>{item.quantity}</p>
                <Button onClick={() => increase(item.id)}>+</Button>
                <p>{item.quantity * item.price}$</p>
                <Button danger onClick={() => deleteFromCart(item.id)}>
                  Удалить
                </Button>
              </Space>
            );
          })}
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
      {!items.length > 0 && <Title>Ваша корзина пуста.</Title>}
    </Space>
  );
};
