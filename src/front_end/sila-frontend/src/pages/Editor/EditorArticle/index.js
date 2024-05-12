import React, { useState } from "react";
import { Card, Form, Button, Table, Radio } from "antd";
import PDFUploader from "../../Author/StartNewSubmission/PDFUploader";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import logo from "../../../assets/logo.jpg"; // Adjust the path as necessary

const columns = [
  {
    title: "Field",
    dataIndex: "field",
    key: "field",
    render: (text) => <b>{text}</b>, // Bold the text in the left column
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const data = [
  {
    key: "1",
    field: "Article title",
    value: "Example Article Title",
  },
  {
    key: "2",
    field: "Reviewer’s name",
    value: "John Doe",
  },
  {
    key: "3",
    field: "Reviewer’s contact details",
    value: "johndoe@example.com",
  },
  {
    key: "4",
    field: "Target date",
    value: "2023-12-31",
  },
  {
    key: "5",
    field: "First Reviewer decision",
    value: "decision",
  },
  {
    key: "6",
    field: "First Reviewer decision",
    value: "decision",
  },
];

const EditorArticle = () => {
  const [form] = Form.useForm();
  const [editorComments, setEditorComments] = useState("");
  const [authorComments, setAuthorComments] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [willingToReview, setWillingToReview] = useState(null);
  const pdfFile = "/A.pdf";

  const handleSubmit = () => {
    console.log(
      "Submitting content:",
      editorComments,
      authorComments,
      recommendation,
      willingToReview
    );
  };

  return (
    <div className="editorreviewpage" style={{ padding: "20px" }}>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <img src={logo} alt="Logo" style={{ width: "300px", height: "auto" }} />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
      />

      <div style={{ textAlign: "left", margin: "20px 0" }}>
        <Button type="primary" href={pdfFile} download="Manuscript.pdf">
          Download Manuscript
        </Button>
      </div>

      <Card
        title="Comments form reviewer to editor."
        style={{ paddingBottom: "50px", marginBottom: "30px" }}
      >
        <ReactQuill
          className="editor-quill"
          theme="snow"
          value={editorComments}
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
          value={authorComments}
          readOnly={true}
          style={{ height: "300px" }}
          placeholder="Comments form reviewer to authors."
        />
      </Card>
      <div
        className="decision button"
        style={{ textAlign: "center", padding: "20px" }}
      >
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            width: "20%",
            backgroundColor: "#34A853",
          }}
        >
          Submit Review
        </Button>

        <Button
          type="primary"
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            marginLeft: "20px",
            width: "20%",
            backgroundColor: "#EB4335",
          }}
        >
          Reject
        </Button>

        <Button
          type="primary"
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            marginLeft: "20px",
            width: "20%",
            backgroundColor: "#FBBC05",
          }}
        >
          Revised
        </Button>
      </div>
    </div>
  );
};

export default EditorArticle;
