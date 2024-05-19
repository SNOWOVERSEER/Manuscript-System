import { useEffect, useState } from "react";
import { Table, Space, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getStateTag } from "../../../utils/status";
import FormModal from "../FormModal";
import { http } from "../../../utils";
import { formatDate } from "../../../utils/common";

const AssignReviewer = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleData, setArticleData] = useState(null);
  // Get all articles
  const [allarticles, setAllarticles] = useState([]);
  // Get all reviewers
  const [reviewers, setReviewers] = useState([]);

  useEffect(() => {
    const fetchAllArticleData = async () => {
      try {
        const response = await http.get(
          `/Manuscripts/EditorSubmissions/${localStorage.getItem("id")}`
        );
        const res = response.data
          .filter((article) => article.status === "Submitted")
          .map((article) => ({
            ...article,
            id: article.submissionId,
            submissionDate: formatDate(article.submissionDate),
          }));
        setAllarticles(res);
      } catch (error) {
        console.error("Fetching article data failed", error);
      }
    };
    fetchAllArticleData();
  }, []);

  const fetchAllArticleData = async () => {
    try {
      const response = await http.get(
        `/Manuscripts/EditorSubmissions/${localStorage.getItem("id")}`
      );
      const res = response.data
        .filter((article) => article.status === "Submitted")
        .map((article) => ({
          ...article,
          id: article.submissionId,
          submissionDate: formatDate(article.submissionDate),
        }));
      setAllarticles(res);
    } catch (error) {
      console.error("Fetching article data failed", error);
    }
  };

  const showModal = async (submission_id) => {
    try {
      const reviewers = await fetchAllReviewers(
        localStorage.getItem("id"),
        submission_id
      );
      setReviewers(reviewers);
      await fetchArticleDataBySubmissionID(submission_id);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching article data:", error);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    fetchAllArticleData();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchAllReviewers = async (user_id, article_id) => {
    try {
      const response = await http.get(`/User/reviewersinfo`);
      return response.data;
    } catch (error) {
      console.error("Fetching reviewer data failed", error);
      return null;
    }
  };

  const fetchArticleDataBySubmissionID = async (submission_id) => {
    try {
      const response = await http.get(
        `/Manuscripts/submissionabstract/${submission_id}`
      );
      const modifiedData = { ...response.data, submission_id: submission_id };
      setArticleData(modifiedData);
    } catch (error) {
      console.error("Fetching article data failed", error);
      return null;
    }
  };

  const columns = [
    {
      title: "TITLE",
      dataIndex: "title",
      width: 220,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => getStateTag(status),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "SUBMISSION DATE",
      dataIndex: "submissionDate",
      sorter: (a, b) => new Date(a.submissionDate) - new Date(b.submissionDate),
    },
    {
      title: "Action",
      render: (data) => {
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => showModal(data.id)}>
              Assign Reviewer
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Card title={`Assign reviewers to articles`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={allarticles}
          pagination={{ pageSize: 5 }}
        />
      </Card>
      <FormModal
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        articleData={articleData}
        reviewers={reviewers}
      />
    </div>
  );
};

export default AssignReviewer;
