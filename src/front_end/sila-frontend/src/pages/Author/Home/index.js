import { useNavigate } from "react-router-dom"; // Correctly import useNavigate
import { Card, Table } from "antd";
import { useState, useEffect } from "react";
import { article_List_API } from "../../../apis/article";
import { getStateTag } from "../../../utils/status";

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function get_articles_by_author(id) {
      const res = await article_List_API(id); // Assuming the API expects an object with an authorId property
      if (res && res.data) {
        const formattedArticles = res.data.map((article) => ({
          ...article,
          submissionDate: formatDate(article.submissionDate),
        }));
        setArticles(formattedArticles);
      }
    }

    const authorId = localStorage.getItem("id");
    get_articles_by_author(authorId);
  }, []);

  // Helper function to format date as yyyy-mm-dd
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 120,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 220,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Submitted",
      dataIndex: "submissionDate",
      sorter: (a, b) => new Date(a.submissionDate) - new Date(b.submissionDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStateTag(status),
    },
  ];

  // Define the onRow function to add click behavior using navigate
  const onRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        navigate(`/articledetail/${record.id}`); // Use navigate for routing
      },
    };
  };

  return (
    <div>
      <Card title={`All Submitted Articles:`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articles}
          pagination={false}
          onRow={onRow}
          defaultSortOrder="ascend" // Optional: Set default sort order
        />
      </Card>
    </div>
  );
};

export default Home;
