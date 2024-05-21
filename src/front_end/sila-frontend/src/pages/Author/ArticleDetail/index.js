import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, List, Card, Button, Space, Divider, Form, Modal, message, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PDFUploader from '../StartNewSubmission/PDFUploader';
import { article_Detail_API } from '../../../apis/article';
import { getStateTag } from '../../../utils/status';

const { Title, Paragraph, Text } = Typography;

const getTagColor = (decision) => {
    switch (decision.toLowerCase()) {
        case 'accept':
            return 'green';
        case 'revise resubmit':
            return 'blue';
        case 'minor revisions':
            return 'orange';
        case 'reject':
            return 'red';
        default:
            return 'gray';
    }
};

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await article_Detail_API(id);
                const articleData = response.data;

                // Mask reviewer names
                articleData.reviewerComments = articleData.reviewerComments.map((comment, index) => ({
                    ...comment,
                    commentsToAuthor: {
                        ...comment.commentsToAuthor,
                        Reviewer: `Author ${index + 1}`
                    }
                }));

                setArticle(articleData);
            } catch (error) {
                message.error('Failed to fetch article details.');
            }
        };
        fetchArticle();
    }, [id]);

    if (!article) {
        return <div>No article found!</div>;
    }

    // Function to handle the resubmission action
    const handleResubmit = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Function to handle file list change in the PDFUploader
    const handleFileListChange = (fileList) => {
        console.log(fileList);
    };

    // Function to handle file upload in the PDFUploader
    const handleFileUploaded = (file) => {
        console.log(file);
    };

    // Function to handle submission
    const handleSubmit = () => {
        // Handle the submission logic here
        alert('Manuscript resubmitted.');
        setIsModalVisible(false);
    };

    // Normalize file input event
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div>
            <Title>Article Details - {article.title}</Title>
            <Paragraph><strong>Abstract:</strong> <div dangerouslySetInnerHTML={{ __html: article.abstract }} /></Paragraph>
            <Paragraph><strong>Deadline:</strong> {article.revisedDeadline || article.ddl}</Paragraph>

            <Card style={{ marginBottom: '30px' }}>
                <Paragraph><strong>Reviewer Comments:</strong></Paragraph>
                <Divider />
                <List
                    dataSource={article.reviewerComments}
                    renderItem={item => (
                        <List.Item>
                            <Text><b>{item.commentsToAuthor.Reviewer}</b>: <div dangerouslySetInnerHTML={{ __html: item.commentsToAuthor.Comments }} /></Text>
                            {item.documentUrl && (
                                <Button
                                    type="link"
                                    icon={<DownloadOutlined />}
                                    href={item.documentUrl}
                                    target="_blank"
                                    style={{ marginRight: 8 }}
                                >
                                    Download PDF
                                </Button>
                            )}
                        </List.Item>
                    )}
                />
            </Card>

            <Card style={{ marginBottom: '30px' }}>
                <Paragraph><strong>Reviewer Recommendations:</strong></Paragraph>
                <Divider />
                <List
                    dataSource={article.reviewerRecommendations}
                    renderItem={item => (
                        <List.Item>
                            <Text>
                                <b>Author {item.reviewerIndex}</b>: 
                                <Tag color={getTagColor(item.recommendation)}>{item.recommendation}</Tag>
                            </Text>
                        </List.Item>
                    )}
                />
            </Card>

            <Card style={{ marginBottom: '30px' }}>
                <Paragraph><strong>Editor's Comments:</strong></Paragraph>
                <Divider />
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
                style={{ background: '#ffffff', margin: '10px 0', marginBottom: '30px' }}  // Keep background white
            >
                <Paragraph><strong>Editor Decision:</strong></Paragraph>
                <Divider />
                <Paragraph>
                    {getStateTag(article.status)}
                </Paragraph>
            </Card>

            <Space direction="horizontal" style={{ width: '100%' }}>
                <Button type="default" icon={<CloseCircleOutlined />} onClick={() => alert('Submission withdrawn.')}>
                    Withdraw Submission
                </Button>
                {article.status === 'revise and resubmit' && (
                    <>
                        <Button type="default" icon={<CheckCircleOutlined />} onClick={() => alert('Deadline accepted.')}>
                            Accept New Deadline
                        </Button>
                        <Button type="default" icon={<ClockCircleOutlined />} onClick={() => alert('Extension requested.')}>
                            Request Extension
                        </Button>
                        <Button type="default" icon={<ReloadOutlined />} onClick={handleResubmit}>
                            Resubmit Article
                        </Button>
                    </>
                )}
            </Space>

            <Modal
                title="Resubmit Manuscript"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>,
                ]}
            >
                <Form.Item
                    name="uploadedFile"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <PDFUploader
                        id={"Reviewed"}
                        onFileListChange={handleFileListChange}
                        onFileUploaded={handleFileUploaded}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
};

export default ArticleDetail;
