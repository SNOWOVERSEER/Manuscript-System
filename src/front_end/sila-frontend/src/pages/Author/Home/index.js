import { Link, useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import { Card, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { http } from '../../../utils';
import { useState } from 'react';
import { useEffect } from 'react';
import { article_List_API } from '../../../apis/article';



const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [articles, setArticles] = useState([])

  useEffect(() => {
    async function get_articles_by_author(id) {
      const res = await article_List_API(id);  // Assuming the API expects an object with an authorId property
      if (res && res.data) {
        const formattedArticles = res.data.map(article => ({
          ...article,
          submissionDate: formatDate(article.submissionDate)
        }));
        setArticles(formattedArticles);
      }
    }

    const authorId = localStorage.getItem('id');
    get_articles_by_author(authorId);
  }, []);

  // Helper function to format date as yyyy-mm-dd
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 120,
        },
        {
          title: 'Title',
          dataIndex: 'title',
          width: 220,
        },
        {
          title: 'Submitted',
          dataIndex: 'submissionDate',
        },
        {
          title: 'Decision',
          dataIndex: 'status',
          render: data => <Tag color="green">Approval</Tag>,
        },
    ];

    const data = [
        {
            id: '1',
            decision_result: 2,
            pubdate: '2019-03-11 09:00:00',
            status: 'Waiting for Review',
            title: 'abc1234',
        },
    ];

    // Define the onRow function to add click behavior using navigate
    const onRow = (record, rowIndex) => {
        return {
            onClick: event => {
                navigate(`/articledetail/${record.id}`); // Use navigate for routing
            },
        };
    };

    return (
        <div>
            <Card title={`All Submitted Articles:`}>
                <Table rowKey="id" columns={columns} dataSource={articles} pagination={false} onRow={onRow} />
            </Card>
        </div>
    );
}

export default Home;

