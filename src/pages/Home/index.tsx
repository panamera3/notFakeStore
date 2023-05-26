import { trim } from '@/utils/format';
import { Typography } from 'antd';

const { Title } = Typography;

const HomePage: React.FC = () => {
  return (
    <>
      <Title>Интернет магазин</Title>
      <Title level={3}>
        Итоговая работа была выполнена при помощи фреймворка UmiJS для React и набора
        компонентов Ant Design
      </Title>

      <Title level={5}>
        Итоговая работа была выполнена студенткой 2 курса ИРИТ-РТФ{" "}
        <a href="https://vk.com/lenainv" target="_blank">Пьяновой Еленой Алексеевной</a>
      </Title>
    </>
  );
};

export default HomePage;
