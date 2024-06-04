import { useEffect, useState } from "react";
import { Table, Tag, Space, Card, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ArticleStatus, getStateTag } from "../../../utils/status";
import { http } from "../../../utils";
import { formatDate } from "../../../utils/common";

const AssignedArticlesList = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleData, setArticleData] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [reviewers, setReviewers] = useState([]);

  useEffect(() => {
    async function get_articles_by_author(id) {
      // Placeholder function, remove or replace if not needed
    }

    get_articles_by_author(localStorage.getItem("id"));

    const fetchAllArticleData = async () => {
      try {
        const response = await http.get(
          `/Manuscripts/EditorSubmissions/${localStorage.getItem("id")}`
        );
        console.log(response.data);
        const res = response.data
          .filter((article) => article.status !== "Submitted")
          .map((article) => ({
            ...article,
            id: article.submissionId,
            submissionDate: formatDate(article.submissionDate),
          }));

        setAllArticles(res);
      } catch (error) {
        console.error("Fetching article data failed", error);
      }
    };
    fetchAllArticleData();
  }, []);

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

  const statusFilters = [
    { text: "To be Reviewed", value: "ToBeReviewed" },
    { text: "Waiting for Decision", value: "WaitingForDecision" },
    { text: "Accepted", value: "Accepted" },
    { text: "Rejected", value: "Rejected" },
    { text: "Revised", value: "Revised" },
    { text: "Withdrawn", value: "Withdrawn" },
    { text: "Resubmitted", value: "Resubmitted" },
  ];

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
      filters: statusFilters,
      onFilter: (value, record) => record.status.includes(value),
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
            <Button
              type="primary"
              onClick={() => {
                navigate(`/editor/editorarticle/${data.id}`);
              }}
              style={{ backgroundColor: "#80d27f", borderColor: "#80d27f" }}
            >
              View details
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Card title={`Assigned Articles List`}>
        <Table rowKey="id" columns={columns} dataSource={allArticles} />
      </Card>
    </div>
  );
};

export default AssignedArticlesList;
