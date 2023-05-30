import '@umijs/max/typings';

type Product = {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
};

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

type ProductInCart = {
  id: number,
  quantity: number,
  price: number,
  title: string,
}