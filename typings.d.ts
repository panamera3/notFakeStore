import '@umijs/max/typings';

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

interface Option {
  value?: string | number | null | undefined;
  label: ReactNode;
  children?: Option[];
}

type ProductInCart = {
  id: number,
  quantity: number,
  price: number,
  title: string,
}
