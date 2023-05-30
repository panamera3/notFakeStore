import React from 'react';
import { request, useParams } from '@umijs/max';
import { Product } from '../../../typings';
import { Space, Typography } from 'antd';

const { Title } = Typography;

export default () => {
  const params = useParams();
  const [product, setProduct] = React.useState<Product>({});

  React.useEffect(() => {
    request(`https://fakestoreapi.com/products/${params.id}`).then((res) =>
      setProduct(res),
    );
  }, []);

  return (
    <Space
      direction="vertical"
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <Title level={2}>Наименование: {product.title}</Title>
      <img src={product.image} width={200} />
      <Title level={5}>Категория: {product.category}</Title>
      <Title level={4}>Описание: {product.description}</Title>
      <Title level={3}>Цена: {product.price}$</Title>
    </Space>
  );
};
