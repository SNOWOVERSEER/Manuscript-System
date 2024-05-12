import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Card, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { ArticleStatus } from "../../../utils/status";
import { Review_List_API } from "../../../apis/reviewerDashbord";

const ReviewAndScore = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const reviewerId = localStorage.getItem("id");
        async function fetchArticles(id) {
            try {
                const response = await Review_List_API(id); // Assumed to return a promise
                console.log('API Response:', response); // Log the full response
                setArticles(response.data); // Update state with fetched data
                
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        }

        fetchArticles(reviewerId);
    }, []);

    const columns = [
        {
            title: 'TITLE',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: 'CATEGORY',
            dataIndex: 'category',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            render: status => (
                status === ArticleStatus.ToBeReviewed
                    ? <Tag color="red">To be reviewed</Tag>
                    : <Tag color="green">Done</Tag>
            )
        },
        {
            title: 'SUBMISSION DATE',
            dataIndex: 'submissionDate',
        },
        {
            title: 'DUE DATE',
            dataIndex: 'reviewDeadline',
        },
        {
            title: 'ACTION',
            render: record => (
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/reviewer/reviewpage?id=${record.id}`)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card title="Articles for Review">
                <Table rowKey="id" columns={columns} dataSource={articles}  pagination={false} />
            </Card>
        </div>
    );
}

export default ReviewAndScore;
