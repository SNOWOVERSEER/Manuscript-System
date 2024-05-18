// reviewStatusTable.jsx
import React from "react";
import { Button, Table, Tag } from "antd";

const reviewStatusTable = ({ reviewData }) => {
  const columns = [
    {
      title: "Reviewer’s name",
      dataIndex: "reviewerName",
      key: "reviewerName",
    },
    {
      title: "Reviewer’s contact details",
      dataIndex: "contactDetails",
      key: "contactDetails",
    },
    {
      title: "Recommendation",
      dataIndex: "recommnedation",
      key: "recommendation",
    },
    {
      title: "Revision",
      dataIndex: "revision",
      key: "revision",
    },
    {
      title: "Decision Status",
      dataIndex: "decisionStatus",
      key: "decisionStatus",
      render: (status) => {
        let color = status === "rejected" ? "volcano" : "green";
        if (status === "pending") {
          color = "geekblue";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Reviewer Script",
      dataIndex: "scriptUrl",
      key: "scriptUrl",
      render: (url) => (
        <Button type="primary" href={url} download>
          Download Script
        </Button>
      ),
    },
  ];

  return <Table columns={columns} dataSource={reviewData} pagination={false} />;
};

export default reviewStatusTable;
