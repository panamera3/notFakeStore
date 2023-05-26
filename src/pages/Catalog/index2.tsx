import { ProColumns, ProTable, TableDropdown } from '@ant-design/pro-components';
import request from 'umi-request';
import { Product } from '../../../typings';
import React from 'react';

export default () => {
  const [data, setData] = React.useState<Product[]>([]);
  request('https://fakestoreapi.com/products').then((res) => setData(res));

  const columns: ProColumns<Product>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
    },
    {
      title: 'Наименование',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      ellipsis: true,
    },
    {
      title: 'Цена($)',
      dataIndex: 'price',
      ellipsis: true,
    },
    {
      title: 'Изображение',
      dataIndex: 'image',
      render: (text, record, _, action) => [
        <a href={record.image} target="_blank" rel="noopener noreferrer" key="view">
          View image
        </a>,
      ],
    },
    {
      title: 'xz',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          edit
        </a>,
      ],
    },
  ];

  return (
    <ProTable
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dataSource={data}
      columns={columns}
      rowKey="id"
      search={false}
    />
  );
};
