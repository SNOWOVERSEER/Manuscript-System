import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  List,
  Card,
  Button,
  Space,
  Divider,
  Form,
  Modal,
  message,
  Tag,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import PDFUploader from "../StartNewSubmission/PDFUploader";
import {
  article_Detail_API,
  request_Extension_API,
  withdraw_API,
  submit_Revision_API,
} from "../../../apis/article";
import { getStateTag } from "../../../utils/status";

const { Title, Paragraph, Text } = Typography;

const getTagColor = (decision) => {
  console.log(decision);
  if (!decision) {
    return "white";
  }
  switch (decision.toLowerCase()) {
    case "accept":
      return "green";
    case "revise resubmit":
      return "blue";
    case "minor revisions":
      return "orange";
    case "reject":
      return "red";
    default:
      return "gray";
  }
};

const ArticleDetail = () => {
  const { id: stringId } = useParams();
  const id = parseInt(stringId, 10); // Convert id to integer
  const [article, setArticle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [path, setPath] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await article_Detail_API(id);
        const articleData = response.data;

        // Mask reviewer names
        articleData.reviewerComments = articleData.reviewerComments.map(
          (comment, index) => ({
            ...comment,
            commentsToAuthor: {
              ...comment.commentsToAuthor,
              Reviewer: `Reviewer ${index + 1}`,
            },
          })
        );

        setArticle(articleData);
      } catch (error) {
        message.error("Failed to fetch article details.");
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
  const handleFileListChange = (newFileList) => {
    setFileList(newFileList);
  };

  // Function to handle file upload
  const handleFileUploaded = (response, id) => {
    if (response && response.path) {
      console.log(`File uploaded for ${id}: ${response.path}`);
      const newFileList = [
        {
          uid: response.path,
          name: response.path,
          status: "done",
          url: response.path,
        },
      ];
      setPath(response.path);
      setFileList(newFileList);
      console.log(newFileList);
    } else {
      message.error("Failed to load response data.");
    }
  };

  // Function to handle submission
  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("Please upload a file before submitting.");
      return;
    }

    try {
      // Access the first file in the fileList array
      const jsonData = {
        submissionId: id,
        responseFile: path,
      };
      await submit_Revision_API(jsonData);
      message.success("Manuscript resubmitted.");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to resubmit the manuscript.");
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw_API(id);
      message.success("Submission withdrawn.");
    } catch (error) {
      message.error("Failed to withdraw submission.");
    }
  };

  const handleRequestExtension = async () => {
    try {
      await request_Extension_API(id);
      message.success("Extension requested.");
    } catch (error) {
      message.error("Failed to request extension.");
    }
  };

  return (
    <div>
      <Title>Article Details - {article.title}</Title>
      <Paragraph>
        <strong>Abstract:</strong>{" "}
        <div dangerouslySetInnerHTML={{ __html: article.abstract }} />
      </Paragraph>
      <Paragraph>
        <strong>Deadline:</strong> {article.revisedDeadline || article.ddl}
      </Paragraph>

      <Card style={{ marginBottom: "30px" }}>
        <Paragraph>
          <strong>Reviewer Comments:</strong>
        </Paragraph>
        <Divider />
        <List
          dataSource={article.reviewerComments}
          renderItem={(item) => (
            <List.Item>
              <Text>
                <b>{item.commentsToAuthor.Reviewer}</b>:{" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.commentsToAuthor.Comments,
                  }}
                />
              </Text>
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

      <Card style={{ marginBottom: "30px" }}>
        <Paragraph>
          <strong>Reviewer Recommendations:</strong>
        </Paragraph>
        <Divider />
        <List
          dataSource={article.reviewerRecommendations}
          renderItem={(item) => (
            <List.Item>
              <Text>
                <b>Reviewer {item.reviewerIndex}</b>:
                <Tag color={getTagColor(item.recommendation)}>
                  {item.recommendation}
                </Tag>
              </Text>
            </List.Item>
          )}
        />
      </Card>

      <Card style={{ marginBottom: "30px" }}>
        <Paragraph>
          <strong>Editor's Comments:</strong>
        </Paragraph>
        <Divider />
        <div dangerouslySetInnerHTML={{ __html: article.commentsFromEditor }} />
      </Card>

      <Card
        bordered
        style={{
          background: "#ffffff",
          margin: "10px 0",
          marginBottom: "30px",
        }}
      >
        <Paragraph>
          <strong>Editor Decision:</strong>
        </Paragraph>
        <Divider />
        <Paragraph>{getStateTag(article.status)}</Paragraph>
      </Card>

      <Space direction="horizontal" style={{ width: "100%" }}>
        {article.status !== "Withdrawn" && (
          <Button
            type="default"
            icon={<CloseCircleOutlined />}
            onClick={handleWithdraw}
          >
            Withdraw Submission
          </Button>
        )}
        {article.status === "Revised" && (
          <>
            <Button
              type="default"
              icon={<CheckCircleOutlined />}
              onClick={() => alert("Deadline accepted.")}
            >
              Accept New Deadline
            </Button>
            <Button
              type="default"
              icon={<ClockCircleOutlined />}
              onClick={handleRequestExtension}
            >
              Request Extension
            </Button>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleResubmit}
            >
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
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
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
