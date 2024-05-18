import React from "react";
import { Table, Button, Tag } from "antd";

const ReviewStatusTable = ({ reviewData }) => {
  const columns = [
    {
      title: "Reviewer’s Name",
      dataIndex: "reviewerName",
      key: "reviewerName",
    },
    {
      title: "Reviewer’s Contact Details",
      dataIndex: "reviewerContact",
      key: "reviewerContact",
    },
    {
      title: "Recommendation",
      dataIndex: "reviewerRecommendation",
      key: "reviewerRecommendation",
    },
    {
      title: "Revision",
      dataIndex: "isRevision",
      key: "isRevision",
      render: (isRevision) => (
        <Tag color={isRevision ? "green" : "red"}>
          {isRevision ? "Yes" : "No"}
        </Tag>
      ),
    },

    {
      title: "Decision Status",
      dataIndex: "isReviewComplete",
      key: "isReviewComplete",
      render: (isReviewComplete) => (
        <Tag color={isReviewComplete ? "green" : "red"}>
          {isReviewComplete ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Reviewer Script",
      dataIndex: "documentUrl",
      key: "documentUrl",
      render: (documentUrl) => (
        <Button
          type="primary"
          href={documentUrl}
          target="_blank"
          disabled={documentUrl === "N/A"}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={reviewData}
      pagination={false}
      rowKey={(record) => record.reviewerId}
    />
  );
};

export default ReviewStatusTable;
