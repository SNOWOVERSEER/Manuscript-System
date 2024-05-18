// EditorArticle.jsx
import React, { useState, useEffect } from "react";
import { Card, Form, Button, Table, Radio } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import logo from "../../../assets/logo.jpg"; // Adjust the path as necessary
import { editor_review_API } from "../../../apis/editor_review";
import ReviewStatusTable from "./reviewStatusTable"; // Import the component

const EditorArticle = () => {
  const [form] = Form.useForm();
  const [comments_to_editor, setEditorComments] = useState("");
  const [comments_to_reviewer, setAuthorComments] = useState("");
  const [data, setData] = useState([]); // State to store fetched data
  const [reviewTableData, setReviewTableData] = useState([]); // State to store review status data
  const pdfFile = "/A.pdf";

  useEffect(() => {
    async function fetchReviewData(id) {
      try {
        const res = await editor_review_API(id);
        if (res && res.data) {
          const {
            articleTitle,
            first_reviewer_Name,
            first_reviewer_contact_Details,
            targetDate,
            firstReviewerDecision,
            secondReviewerDecision,
            editorComments,
            authorComments,
            recommendation,
            willingToReview,
            reviewStatus,
          } = res.data;

          setData([
            { key: "1", field: "Article title", value: articleTitle },
            { key: "2", field: "Target date", value: targetDate },
          ]);
          setEditorComments(editorComments);
          setAuthorComments(authorComments);
          setReviewTableData(reviewStatus); // Assuming reviewStatus contains the necessary data for reviewStatusTable
        }
      } catch (error) {
        console.error("Error fetching review data:", error);
      }
    }

    // editor ID
    fetchReviewData(localStorage.getItem("id"));
  }, []);

  const handleSubmit = () => {
    console.log(
      "Submitting content:",
      comments_to_editor,
      comments_to_reviewer
    );
  };

  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <div className="editorreviewpage" style={{ padding: "20px" }}>
      <Card title="Editor Review Form">
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "300px", height: "auto" }}
          />
        </div>
        <Card className="article_detail" style={{ marginBottom: "30px" }}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            showHeader={false}
          />

          <div className="buttons" style={{ marginTop: "20px" }}>
            <Button
              style={{ marginLeft: "20px" }}
              type="primary"
              href={pdfFile}
              download="Manuscript.pdf"
            >
              Download Manuscript
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              type="primary"
              href={pdfFile}
              download="Manuscript.pdf"
            >
              Download Appendix
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              type="primary"
              href={pdfFile}
              download="Manuscript.pdf"
            >
              Download Supplementary File
            </Button>
          </div>
        </Card>

        <Card className="reviewStatusTable" style={{ marginBottom: "30px" }}>
          <ReviewStatusTable reviewData={reviewTableData} />
        </Card>

        <Card
          title="Comments form reviewer to editor."
          style={{ paddingBottom: "50px", marginBottom: "30px" }}
        >
          <ReactQuill
            className="editor-quill"
            theme="snow"
            value={comments_to_editor}
            readOnly={true}
            style={{ height: "300px" }}
            placeholder="Comments form reviewer to editor."
          />
        </Card>

        <Card
          title="Comments from reviewer to the Author(s)"
          style={{ paddingBottom: "50px", marginBottom: "30px" }}
        >
          <ReactQuill
            className="author-quill"
            theme="snow"
            value={comments_to_reviewer}
            readOnly={true}
            style={{ height: "300px" }}
            placeholder="Comments form reviewer to authors."
          />
        </Card>

        <div
          className="decision buttons"
          style={{ textAlign: "center", padding: "20px" }}
        >
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{
              width: "20%",
              height: "40px",
              backgroundColor: "#34A853",
            }}
          >
            Accept
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            style={{
              marginLeft: "5%",
              width: "20%",
              height: "40px",
              backgroundColor: "#EB4335",
            }}
          >
            Reject
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            style={{
              marginLeft: "5%",
              width: "20%",
              height: "40px",
              backgroundColor: "#FBBC05",
            }}
          >
            Revised
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditorArticle;
