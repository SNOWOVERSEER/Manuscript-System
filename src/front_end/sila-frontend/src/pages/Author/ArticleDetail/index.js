import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { Typography, List, Card, Button, Space, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Publish from '../StartNewSubmission';


const { Title, Paragraph, Text } = Typography;

const articles = [
    {
        id: 2,
        title: 'Article 1',
        abstract: 'Abstract of Article 1',
        ddl:'12-31-2024',
        content: '/111.pdf', // This assumes 111.pdf is in the public directory
        imageUrl: '/path/to/image1.jpg',
        reviewerComments: [
            { reviewer: 'Reviewer A', comment: 'Needs more references to recent studies.' },
            { reviewer: 'Reviewer B', comment: 'Well-written but the methodology section is unclear.' }
        ],
        editorComments: [
            'The topic is relevant but needs more depth in the analysis.',
            'Consider adding more comparative data.'
        ],
        editorDecision: 'Revise and Resubmit'
    },
    // More articles...
];

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const navigate = useNavigate();
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
        // alert('Article resubmitted.'); // Alert or other logic before navigating
        navigate('/startnewsubmission'); // Navigate to the submission form page
    };

    return (
        <div>
            <Title>Article Details - {article.title}</Title>
            <Paragraph><strong>Abstract:</strong> {article.abstract}</Paragraph>
            <Paragraph><strong>Deadline:</strong> {article.ddl}</Paragraph>
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
            <Divider orientation="left"></Divider>
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
            <Divider orientation="left"></Divider>
              <Card>
                <Paragraph><strong>Editor's Comments:</strong></Paragraph>
                <List
                    dataSource={article.editorComments}
                    renderItem={comment => (
                        <List.Item>
                            <Text>{comment}</Text>
                        </List.Item>
                    )}
                />
               
            </Card>
            <Card
                    bordered
                    style={{ background: '#ffffcc', margin: '10px 0' }}  // Highlight with a light yellow background
                >
                    <Paragraph><strong>Editor Decision:</strong> {article.editorDecision}</Paragraph>
            </Card>
            <Space>
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => alert('Deadline accepted.')}>
                    Accept New Deadline
                </Button>
                <Button type="default" icon={<ClockCircleOutlined />} onClick={() => alert('Extension requested.')}>
                    Request Extension
                </Button>
                <Button type="default" icon={<CloseCircleOutlined />} onClick={() => alert('Submission withdrawn.')}>
                    Withdraw Submission
                </Button>
                {article.editorDecision === 'Revise and Resubmit' && (
                    <Button type="default" icon={<ReloadOutlined />} onClick={handleResubmit}>
                        Resubmit Article
                    </Button>
                )}
            </Space>
        </div>
    );
};

export default ArticleDetail;
