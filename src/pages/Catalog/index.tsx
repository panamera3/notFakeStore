/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormCheckbox,
  RequestOptionsType,
} from '@ant-design/pro-components';
import {
  Space,
  Button,
  Pagination,
  InputNumber,
  message,
  Typography,
  Cascader,
} from 'antd';
import {
  StarOutlined,
  StarFilled,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import request from 'umi-request';
import { Product, Option, ProductInCart } from '../../../typings';
import React from 'react';
import { history } from '@umijs/max';

export default () => {
  const { Title } = Typography;
  const [products, setProducts] = React.useState<Product[]>([]);
  const [constProducts, setConstProducts] = React.useState<Product[]>([]);
  const [favourites, setFavourites] = React.useState<number[]>([]);
  const [pageSize, setPageSize] = React.useState<number>(5);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const [isFavourite, setIsFavourite] = React.useState<boolean>(false);
  const [searchRequest, setSearchRequest] = React.useState<string>('');

  const [cartItems, setCartItems] = React.useState<ProductInCart[]>([]);
  const [cartItemsPage, setCartItemsPage] = React.useState<ProductInCart[]>([]);

  React.useEffect(() => {
    const favFromLocal: string = localStorage.getItem('favourites') || '[]';
    const favParsed: number[] = JSON.parse(favFromLocal) as number[];
    setFavourites(favourites.length === 0 ? favParsed : favourites);

    request('https://fakestoreapi.com/products').then((res) => {
      setConstProducts(res);
      setProducts(res);
    });

    let newCartItems: ProductInCart[] = [];
    for (let i = 1; i <= 20; i++) {
      const newCartItem: ProductInCart = {
        id: i,
        quantity: 1,
        title: '',
        price: 0,
      };
      newCartItems = [...newCartItems, newCartItem];
    }
    setCartItems(newCartItems);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
    if (isFavourite) {
      const filteredFavProducts = products.filter((p) =>
        favourites.includes(p.id),
      );
      setProducts(filteredFavProducts);
    }
  }, [favourites]);

  React.useEffect(() => {
    if (cartItemsPage.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItemsPage));
      message.success('Товар был успешно добавлен в корзину');
    }
  }, [cartItemsPage]);

  React.useEffect(() => {
    if (searchRequest.trim() === '') {
      setProducts(constProducts);
      return;
    }
    const filteredProducts = products.filter((p) =>
      p.title.toLowerCase().includes(searchRequest.toLowerCase()),
    );
    if (filteredProducts.length !== 0) {
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
      setFavourites(favourites.filter((favourite) => favourite !== id));
    } else {
      setFavourites([...favourites, id]);
    }
  };

  const selectChangeHandler = (values: string[]) => {
    if (values.length !== 0) {
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

  const searchChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRequest(e.target.value);
  };

  const checkChangeHandler = () => {
    if (!isFavourite) {
      setIsFavourite(!isFavourite);
      const filteredFavProducts = products.filter((p) =>
        favourites.includes(p.id),
      );
      setProducts(filteredFavProducts);
      return;
    }
    setIsFavourite(!isFavourite);
    setProducts(constProducts);
  };

  const sortHandler = (values: (string | number)[], _: Option[]) => {
    let sortedProducts: Product[] = [...constProducts];
    if (values) {
      if (values[0] === 'alphabet') {
        if (values[1] === 'ascending') {
          sortedProducts = sortedProducts.sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          });
        } else if (values[1] === 'descending') {
          sortedProducts = sortedProducts.sort((a, b) => {
            if (a.title > b.title) {
              return -1;
            }
            if (a.title < b.title) {
              return 1;
            }
            return 0;
          });
        }
      } else if (values[0] === 'price') {
        if (values[1] === 'ascending') {
          sortedProducts = sortedProducts.sort(
            (a: Product, b: Product) => a.price - b.price,
          );
        } else if (values[1] === 'descending') {
          sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
        }
      }
    }
    setProducts(sortedProducts);
  };

  const addProductToCart = (productId: number) => {
    const containedItem = cartItemsPage.find((item) => item.id === productId);
    let newCartItem;
    if (containedItem) {
      containedItem.quantity = cartItems[productId].quantity;
      newCartItem = containedItem;
    } else {
      const newCartItemPage: ProductInCart = {
        id: productId,
        quantity: cartItems[productId].quantity,
        price: products[productId].price,
        title: products[productId].title,
      };
      newCartItem = newCartItemPage;
    }
    const newCartItemsPage = [...cartItemsPage, newCartItem];
    const uniqueCartItemsPage = [
      ...new Set(newCartItemsPage.map((obj) => JSON.stringify(obj))),
    ].map((str) => JSON.parse(str));
    setCartItemsPage(uniqueCartItemsPage);
  };

  const sortOptions: Option[] = [
    {
      value: 'alphabet',
      label: 'По алфавиту',
      children: [
        {
          value: 'ascending',
          label: 'По возрастанию',
        },
        {
          value: 'descending',
          label: 'По убыванию',
        },
      ],
    },
    {
      value: 'price',
      label: 'По цене',
      children: [
        {
          value: 'ascending',
          label: 'По возрастанию',
        },
        {
          value: 'descending',
          label: 'По убыванию',
        },
      ],
    },
  ];

  return (
    <>
      <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
        <ProFormSelect
          name="select-multiple"
          style={{ width: '20rem' }}
          label="Категории: "
          fieldProps={{
            mode: 'multiple',
            onChange: selectChangeHandler,
          }}
          request={async () => {
            const categs: RequestOptionsType[] = (
              (await request(
                'https://fakestoreapi.com/products/categories',
              )) as string[]
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
        />
        <ProFormText
          name="text"
          style={{ width: '20rem' }}
          label="Поиск"
          placeholder="Я ищу..."
          fieldProps={{
            onChange: searchChangeHandler,
            value: searchRequest,
          }}
        />
        <ProFormCheckbox
          name="checkbox"
          label="Избранное"
          fieldProps={{ onChange: checkChangeHandler, checked: isFavourite }}
        />
        <Cascader
          style={{ width: '20rem' }}
          options={sortOptions}
          onChange={sortHandler}
          placeholder="Сортировать по..."
        />
        <Title level={5}>
          Количество товаров в корзине:{' '}
          {cartItemsPage.reduce((total, item) => total + item.quantity, 0)}
        </Title>
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
                  key={product.id}
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
                        min={1}
                        defaultValue={1}
                        onChange={(value) =>
                          (cartItems[product.id].quantity = value as number)
                        }
                      />
                      <Button onClick={() => addProductToCart(product.id)}>
                        <ShoppingCartOutlined />
                      </Button>
                    </Space.Compact>
                  </Space>
                </ProCard>
              );
            })}
        </Space>
        {products.length !== 0 && (
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
              pageSizeOptions={[1, 2, 3, 4, 5, 10, 20]}
            />
          </Space>
        )}
      </Space>
    </>
  );
};
