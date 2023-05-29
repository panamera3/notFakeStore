import {
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import {
  Space,
  Button,
  Pagination,
  InputNumber,
  message,
  Typography,
} from 'antd';
import {
  StarOutlined,
  StarFilled,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import request from 'umi-request';
import { Product } from '../../../typings';
import React from 'react';
import { history } from '@umijs/max';

export default () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [constProducts, setConstProducts] = React.useState<Product[]>([]);
  const [favourites, setFavourites] = React.useState<number[]>([]);
  const [cartItems, setCartItems] = React.useState<number[]>([]);

  const [pageSize, setPageSize] = React.useState<number>(5);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const [isFavourite, setIsFavourite] = React.useState<boolean>(false);
  const [searchRequest, setSearchRequest] = React.useState<string>('');

  //message.success('Товар был добавлен в корзину');

  React.useEffect(() => {
    let favFromLocal: string = localStorage.getItem('favourites');
    let favParsed: number[] = JSON.parse(favFromLocal) as number[];
    setFavourites(favourites.length == 0 ? favParsed : favourites);
  }, []);

  React.useEffect(() => {
    request('https://fakestoreapi.com/products').then((res) => {
      setConstProducts(res);
      setProducts(res);
    });
  }, []);

  React.useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
    if (isFavourite) {
      let filteredFavProducts = products.filter((p) =>
        favourites.includes(p.id),
      );
      setProducts(filteredFavProducts);
    }
  }, [favourites]);

  React.useEffect(() => {
    console.log('efkjhewghj', products);
  }, [products]);

  React.useEffect(() => {
    if (searchRequest.trim() == '') {
      setProducts(constProducts);
      return;
    }
    let filteredProducts = products.filter((p) =>
      p.title.toLowerCase().includes(searchRequest.toLowerCase()),
    );
    if (filteredProducts.length != 0) {
      setProducts(filteredProducts);
      return;
    }
    message.error('Ни одного подходящего предмета не было найдено.', 0.3);
    setProducts(constProducts);
  }, [searchRequest]);

  const containsFavourite = (id: number): boolean => {
    return favourites.includes(id);
  };

  const setFavourite = (id: number): void => {
    if (favourites.includes(id)) {
      setFavourites(favourites.filter((favourite) => favourite != id));
    } else {
      setFavourites([...favourites, id]);
    }
  };

  const selectChangeHandler = (values: String[]) => {
    if (values.length != 0) {
      let allProducts: Product[] = [];
      values.forEach((c) =>
        request(`https://fakestoreapi.com/products/category/${c}`).then(
          (res) => {
            allProducts = [...res, ...allProducts];
            setProducts(allProducts);
          },
        ),
      );
      return;
    }
    setProducts(constProducts);
  };

  const searchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchRequest(e.target.value);
  };

  const checkChangeHandler = (e: ChangeEventHandler<HTMLInputElement>) => {
    if (!isFavourite) {
      setIsFavourite(!isFavourite);
      let filteredFavProducts = products.filter((p) =>
        favourites.includes(p.id),
      );
      setProducts(filteredFavProducts);
      return;
    }
    setIsFavourite(!isFavourite);
    setProducts(constProducts);
  };

  const onChange = (value: number | null) => {
    console.log('changed', value);
  };

  return (
    <>
      <Space>
        <ProFormSelect
          name="select-multiple"
          style={{ width: '20rem' }}
          label="Категории: "
          fieldProps={{
            mode: 'multiple',
          }}
          request={async () => {
            let categs = (
              (await request(
                'https://fakestoreapi.com/products/categories',
              )) as String[]
            ).map((item) => ({
              label: item,
              value: item,
            }));
            return categs;
          }}
          placeholder="Выберите категории"
          rules={[
            {
              type: 'array',
            },
          ]}
          onChange={selectChangeHandler}
        />
        <ProFormText
          name="text"
          label="Поиск"
          placeholder="Я ищу..."
          fieldProps={{ onChange: searchChangeHandler, value: searchRequest }}
        />
        <ProFormCheckbox
          name="checkbox"
          label="Избранное"
          fieldProps={{ onChange: checkChangeHandler, checked: isFavourite }}
        />
      </Space>
      <Space
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
                ? products.length
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
                  <Space
                    direction="vertical"
                    onClick={() => {
                      history.push(`/catalog/${product.id}`);
                    }}
                  >
                    <Space direction="vertical" style={{ height: '5rem' }}>
                      <Typography.Paragraph
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {product.title}
                      </Typography.Paragraph>
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
                    <Space direction="vertical" style={{ marginTop: 50 }}>
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
                      <Typography.Paragraph
                        style={{
                          fontWeight: 'bold',
                          position: 'absolute',
                          bottom: 30,
                          left: '35%',
                        }}
                      >
                        Цена: {product.price}$
                      </Typography.Paragraph>
                    </Space>
                  </Space>
                  <Space
                    style={{ position: 'absolute', bottom: 10, left: '20%' }}
                  >
                    <Button onClick={() => setFavourite(product.id)}>
                      {containsFavourite(product.id) && <StarFilled />}
                      {!containsFavourite(product.id) && <StarOutlined />}
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
