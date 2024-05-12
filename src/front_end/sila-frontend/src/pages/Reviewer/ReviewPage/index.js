import React, { useState } from "react";
import { Card, Form, Button, Table, Radio } from "antd";
import PDFUploader from "../../Author/StartNewSubmission/PDFUploader";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import logo from "../../../assets/logo.jpg"; // Adjust the path as necessary
import "./index.scss";

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
];

const ReviewPage = () => {
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
    form.validateFields().then((values) => {
      console.log("Received values of form:", values);
    });
  };

  const handleEditorCommentsChange = (content) => {
    setEditorComments(content);
  };

  const handleAuthorCommentsChange = (content) => {
    setAuthorComments(content);
  };

  const handleRecommendationChange = (e) => {
    setRecommendation(e.target.value);
  };

  const handleWillingToReviewChange = (e) => {
    setWillingToReview(e.target.value);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const [uploadedFilePaths, setUploadedFilePaths] = useState({});

  const handleFileUploaded = (response, id) => {
    if (response && response.path) {
      setUploadedFilePaths((prevPaths) => ({
        ...prevPaths,
        [id]: response.path,
      }));
    }
  };

  const handleFileListChange = (fileList) => {
    // console.log(fileList);
    form.setFieldsValue({ uploadedFile: fileList });
  };

  return (
    <div className="reviewpage" style={{ padding: "20px" }}>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <img src={logo} alt="Logo" style={{ width: "300px", height: "auto" }} />
        <div>
          <b>
            STUDIES IN LANGUAGE ASSESSMENT: The international journal of the
            Association for Language Testing and Assessment of Australia and New
            Zealand.
          </b>
        </div>
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

      <div style={{ margin: "20px 0" }}>
        <b>Information for reviewers</b>
        <p>
          Studies in Language Assessment (SiLA) is the international
          peer-reviewed research journal of the Association for Language Testing
          and Assessment of Australia and New Zealand (
          <a href="https://www.altaanz.org/" target="_blank">
            ALTAANZ
          </a>
          ). It previously appeared under the title Papers in Language Testing
          and Assessment (PLTA). The journal is an online, open-access
          publication that welcomes contributions from both new and experienced
          researchers in the form of full research articles, research reports
          and discussion papers, on topics in the field of language assessment.
          It also publishes commissioned book and test reviews. Currently, there
          are at least one regular issue and one theme-based special issue each
          year. SiLA is included in the Web of Science Emerging Sources Citation
          Index (ESCI).
        </p>
        <p>
          SiLA is available exclusively online at{" "}
          <a href="https://www.altaanz.org/" target="_blank">
            ALTAANZ
          </a>{" "}
          and the{" "}
          <a
            href="https://arts.unimelb.edu.au/language-testing-research-centre/research/publications"
            target="_blank"
          >
            Language Testing Research Centre
          </a>
          .
        </p>
      </div>

      <div style={{ margin: "20px 0" }}>
        <b>Reviewing Guidelines</b>
        <p>
          Reviewers are asked to make a recommendation on a paper using one of
          four categories (accept, accept with revisions, revise and resubmit,
          reject).
        </p>
        <ul>
          <li>The relevance of the topic to the Language Testing field</li>
          <li>The originality of the contribution</li>
          <li>The logic and clarity of the argument</li>
          <li>The soundness of the research design</li>
          <li>The extent to which conclusions are justified</li>
          <li>The clarity and quality of writing</li>
        </ul>
        <p>
          If you have any questions about the review process, please email the
          Editorial Assistant, Annemiek Huisman, at{" "}
          <a href="mailto:sila.editors@gmail.com">sila.editors@gmail.com</a>.
        </p>
      </div>

      <div style={{ margin: "20px 0" }}>
        <b>Recommendation (Select One):</b>
        <Radio.Group
          onChange={handleRecommendationChange}
          value={recommendation}
          rules={[
            { required: true, message: "Please select your recommendation" },
          ]}
        >
          <Radio value="accept">
            Accept – this article is suitable for publication.
          </Radio>
          <Radio value="minor_revisions">
            Accept with minor revisions – this article is suitable for
            publication in its present form, provided that minor corrections or
            revisions are made as specified in the comments below.
          </Radio>
          <Radio value="revise_resubmit">
            Revise & resubmit – this article is potentially suitable for
            publication, but requires considerable revision as specified in the
            comments below.
          </Radio>
          <Radio value="reject">
            Reject – this article is not recommended for publication.
          </Radio>
        </Radio.Group>
      </div>

      <div style={{ margin: "20px 0" }}>
        <b>Would you be willing to review a revision of this manuscript?</b>
        <br />
        <Radio.Group
          onChange={handleWillingToReviewChange}
          value={willingToReview}
          rules={[{ required: true, message: "Please select the willingness" }]}
        >
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <Card
        title="Comments to the Editors (confidential)"
        style={{ paddingBottom: "50px", marginBottom: "30px" }}
      >
        <ReactQuill
          className="editor-quill"
          theme="snow"
          value={editorComments}
          onChange={handleEditorCommentsChange}
          style={{ height: "300px" }}
          placeholder="Enter confidential comments to the editors (optional)"
        />
      </Card>

      <Card
        title="Comments to the Author(s)"
        style={{ paddingBottom: "50px", marginBottom: "30px" }}
      >
        <ReactQuill
          className="author-quill"
          theme="snow"
          value={authorComments}
          onChange={handleAuthorCommentsChange}
          style={{ height: "300px" }}
          placeholder="Enter comments to the author(s) (required)"
          rules={[{ required: true, message: "Please write your comments" }]}
        />
      </Card>
      <Card
        title="Manuscript with comments (Optional)"
        label="Upload PDF"
        name="uploadedFile"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <PDFUploader
          id={"Reviewed"}
          onFileListChange={handleFileListChange}
          onFileUploaded={handleFileUploaded}
        />
      </Card>

      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "10px" }}
      >
        Submit Review
      </Button>
    </div>
  );
};

export default ReviewPage;
