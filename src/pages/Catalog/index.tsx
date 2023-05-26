import { ProCard } from '@ant-design/pro-components';
import { Space, Button, Pagination, InputNumber, Title, message } from 'antd';
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

  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const favourites = false;

  React.useEffect(() => {
    console.log(pageSize, currentPage);
    message.success('Товар был добавлен в корзину');
  }, [pageSize, currentPage]);

  const onChange = (value: number) => {
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
                  onClick={() => console.log('KJFUHDJKL')}
                  style={{ maxWidth: 300, textAlign: 'center' }}
                  title={
                    <>
                      <p>{product.title}</p>
                      <p
                        style={{
                          textAlign: 'left',
                          color: 'gray',
                          fontWeight: 400,
                        }}
                      >
                        {product.category}
                      </p>
                    </>
                  }
                  bordered
                  actions={[
                    <Button onClick={() => console.log('wow')}>
                      {favourites && <StarFilled />}
                      {!favourites && <StarOutlined />}
                    </Button>,
                    <InputNumber
                      controls={true}
                      min={0}
                      defaultValue={0}
                      onChange={onChange}
                    />,
                    <Button onClick={() => console.log('mu')}>
                      <ShoppingCartOutlined />
                    </Button>,
                  ]}
                >
                  <div>
                    <img src={product.image} width={'100%'} />
                  </div>
                  <div>
                    <p>{product.description}</p>
                    <p style={{ fontWeight: 'bold' }}>Цена: {product.price}$</p>
                  </div>
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
