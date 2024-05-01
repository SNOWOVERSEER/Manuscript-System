import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, List, Card, Button, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const { Title, Paragraph, Text } = Typography;

const articles = [
    {
        id: 2,
        title: 'Article 1',
        abstract: 'Abstract of Article 1',
        content: '/111.pdf', // This assumes 111.pdf is in the public directory
        imageUrl: '/path/to/image1.jpg',
        reviewerComments: [
            { reviewer: 'Reviewer A', comment: 'Needs more references to recent studies.' },
            { reviewer: 'Reviewer B', comment: 'Well-written but the methodology section is unclear.' }
        ],
        reviewerDecision: 'Minor Revisions',
        editorComments: 'The topic is relevant but needs more depth in the analysis.',
        editorDecision: 'Revise and Resubmit'
    },
    // More articles...
];

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        const fetchedArticle = articles.find(article => article.id.toString() === id);
        setArticle(fetchedArticle);
    }, [id]);

    if (!article) {
        return <div>No article found!</div>;
    }

    // Function to handle the resubmission action
    const handleResubmit = () => {
        alert('Article resubmitted.');
    };

    return (
        <div>
            <Title>Article Details - {article.title}</Title>
            <Paragraph><strong>Abstract:</strong> {article.abstract}</Paragraph>
            <div style={{ height: '500px' }}>
                <strong>PDF Content:</strong>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                    <Viewer
                        // fileUrl={`${process.env.PUBLIC_URL}/${article.content}`}
                        fileUrl="/A.pdf"
                        plugins={[defaultLayoutPluginInstance]}
                    />
                </Worker>
            </div>
            <List
                header={<strong>Reviewer Comments</strong>}
                bordered
                dataSource={article.reviewerComments}
                renderItem={item => (
                    <List.Item>
                        <Text>{item.reviewer}: {item.comment}</Text>
                    </List.Item>
                )}
            />
            <Card>
                <Paragraph><strong>Reviewer Decision:</strong> {article.reviewerDecision}</Paragraph>
                <Paragraph><strong>Editor's Comments:</strong> {article.editorComments}</Paragraph>
                <Paragraph><strong>Editor Decision:</strong> {article.editorDecision}</Paragraph>
            </Card>
            <Space>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => alert('Deadline accepted.')}>
                    Accept New Deadline
                </Button>
                <Button type="default" icon={<ClockCircleOutlined />} onClick={() => alert('Extension requested.')}>
                    Request Extension
                </Button>
                <Button type="danger" icon={<CloseCircleOutlined />} onClick={() => alert('Submission withdrawn.')}>
                    Withdraw Submission
                </Button>
                {article.editorDecision === 'Revise and Resubmit' && (
                    <Button type="ghost" icon={<ReloadOutlined />} onClick={handleResubmit}>
                        Resubmit Article
                    </Button>
                )}
            </Space>
        </div>
    );
};

export default ArticleDetail;
