import { Link, useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import { Card, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Home = () => {
    const navigate = useNavigate(); // Initialize useNavigate

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
          title: 'Status',
          dataIndex: 'status',
        },
        {
          title: 'Submitted',
          dataIndex: 'pubdate',
        },
        {
          title: 'Decision',
          dataIndex: 'decision_result',
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
                <Table rowKey="id" columns={columns} dataSource={data} pagination={false} onRow={onRow} />
            </Card>
        </div>
    );
}

export default Home;

