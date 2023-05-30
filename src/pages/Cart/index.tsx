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
    console.log(itemId);
    console.log('324e3ret', items);
    items.find((item) => item.id == itemId).quantity -= 1;
    console.log(
      '34r7y349ikjoklijmiok',
      items.find((item) => item.id == itemId),
    );
  };

  const increase = (itemId: number) => {
    console.log(itemId);
    items.find((item) => item.id == itemId).quantity += 1;
    setItems(items);
  };

  const deleteFromCart = (itemId: number) => {
    console.log(itemId);
    let newItems = items.filter((item) => item.id != itemId);
    setItems(newItems);
  };

  return (
    <Space direction="vertical">
      {items.length > 0 && (
        <Space direction="vertical">
          {items.map((item) => {
            console.log('ew;lfkjh', item);
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
