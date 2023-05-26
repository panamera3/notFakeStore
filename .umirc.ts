import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '(not)Fake store',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'Главная страница',
      path: '/home',
      component: './Home',
    },
    {
      name: 'Каталог товаров',
      path: '/catalog',
      component: './Catalog',
    },
    {
        name: 'Корзина',
        path: '/',
        component: './Home',
    },
  ],
  npmClient: 'npm',
  locale: { default: "ru-RU", antd: true },
});

