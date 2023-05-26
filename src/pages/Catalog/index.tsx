import { ProCard } from '@ant-design/pro-components';
import {
  Space,
  Button,
  Pagination,
  InputNumber,
  Title,
  message,
  Typography,
} from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  StarOutlined,
  StarFilled,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import request from 'umi-request';
import { Product } from '../../../typings';
import React from 'react';

export default () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  request('https://fakestoreapi.com/products').then((res) => setProducts(res));

  const [pageSize, setPageSize] = React.useState(20);
  const [currentPage, setCurrentPage] = React.useState(1);
  const favourites = false;

  React.useEffect(() => {
    console.log(pageSize, currentPage);
    message.success('Товар был добавлен в корзину');
  }, [pageSize, currentPage]);

  const onChange = (value: number | null) => {
    console.log('changed', value);
  };
  return (
    <>
      <Space
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <></>
        <Space
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'start',
            justifyContent: 'space-around',
          }}
        >
          {products
            .slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize > products.length
                ? products.length - 1
                : currentPage * pageSize,
            )
            .map((product) => {
              return (
                <ProCard
                  style={{
                    maxWidth: 300,
                    textAlign: 'center',
                    height: '40rem',
                  }}
                  bordered
                >
                  <Space direction="vertical" style={{ height: '5rem' }}>
                    <Typography.Paragraph>{product.title}</Typography.Paragraph>
                    <Typography.Paragraph
                      style={{
                        textAlign: 'left',
                        color: 'gray',
                        fontWeight: 400,
                      }}
                    >
                      {product.category}
                    </Typography.Paragraph>
                  </Space>
                  <Space direction="vertical">
                    <img
                      src={product.image}
                      height={'150rem'}
                      style={{ maxWidth: '100%' }}
                    />
                    <Space>
                      <Typography.Paragraph
                        style={{ overflowY: 'auto', maxHeight: '15rem' }}
                      >
                        {product.description}
                      </Typography.Paragraph>
                    </Space>
                    <Typography.Paragraph style={{ fontWeight: 'bold', position: 'absolute', bottom: 30, left: '35%' }}>Цена: {product.price}$</Typography.Paragraph>
                  </Space>
                  <Space
                    style={{ position: 'absolute', bottom: 10, left: '20%' }}
                  >
                    <Button onClick={() => console.log('wow')}>
                      {favourites && <StarFilled />}
                      {!favourites && <StarOutlined />}
                    </Button>
                    <Space.Compact>
                      <InputNumber
                        controls={true}
                        min={0}
                        defaultValue={0}
                        onChange={onChange}
                      />
                      <Button onClick={() => console.log('mu')}>
                        <ShoppingCartOutlined />
                      </Button>
                    </Space.Compact>
                  </Space>
                </ProCard>
              );
            })}
        </Space>
        <Space>
          <Pagination
            showSizeChanger
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }}
            defaultPageSize={pageSize}
            current={currentPage}
            total={products.length}
          />
        </Space>
      </Space>
    </>
  );
};
