import React, { useState, useEffect } from 'react';
import { List, Avatar, Spin, Badge, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
//import 'antd/dist/antd.css';

const articles = [
    {
        id: 1,
        title: 'Article 1',
        description: 'Description of Article 1',
        content: 'Content of Article 1',
        imageUrl: '/path/to/image1.jpg',
        status: 'desk-reject',
        comments: 'The article does not fit the scope of our journal.'
    },
    {
        id: 2,
        title: 'Article 2',
        description: 'Description of Article 2',
        content: 'Content of Article 2',
        imageUrl: '/path/to/image2.jpg',
        status: 'external review',
        comments: ''
    },
    // More articles...
];

const Home = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setData(articles);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <Spin tip="Loading..." />;
    if (error) return <div>Error: {error}</div>;
    if (data.length === 0) return <div>No articles submitted yet.</div>;

    return (
        <div className="home-container">
            <h1>Submitted Articles</h1>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Badge dot={item.status === 'desk-reject' || item.status === 'external review'}>
                                <Button type="link" onClick={() => navigate(`/articledetail/${item.id}`)}>
                                    Review Details
                                </Button>
                            </Badge>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.imageUrl} />}
                            title={<a href="https://example.com">{item.title}</a>}
                            description={item.description}
                        />
                        <div>
                            {item.content}
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
                                <p><strong>Status:</strong> {item.status}</p>
                                {item.status === 'desk-reject' && (
                                    <p><strong>Editor's Comments:</strong> {item.comments}</p>
                                )}
                            </div>
                        </div>
                    </List.Item>
                )}
                pagination={{
                    pageSize: 5,
                }}
            />
        </div>
    );
};

export default Home;
