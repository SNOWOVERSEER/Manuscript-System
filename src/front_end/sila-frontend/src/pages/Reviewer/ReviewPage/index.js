import React, { useEffect, useState } from "react";
import { Card, Form, Button, Table, Radio, message } from "antd";
import { useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import PDFUploader from "../../Author/StartNewSubmission/PDFUploader";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "react-quill/dist/quill.snow.css";
import { Review_Get_Article, submit_review } from "../../../apis/reviewerDashbord";
import logo from "../../../assets/logo.jpg"; // Adjust the path as necessary
import "./index.scss";
import { useSelector } from "react-redux";
import moment from "moment";

// Utility function to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ReviewPage = () => {
  const query = useQuery();
  const id = query.get("id");
  console.log("id: ", id);

  const { firstName, lastName, email, userId } = useSelector((state) => state.user.userInfo);
  const reviewerId = localStorage.getItem("id");
  const [form] = Form.useForm();
  const [editorComments, setEditorComments] = useState("");
  const [authorComments, setAuthorComments] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [willingToReview, setWillingToReview] = useState(null);
  const [articleData, setArticleData] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await Review_Get_Article(id);
        console.log('Fetched Article:', response); // Log the full response
        const article = response.data;
        const targetDate = moment(article.submissionDate).add(7, 'days').format('YYYY-MM-DD');
        setArticleData({
          ...article,
          targetDate,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    }

    fetchArticle();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      console.log("Received values of form:", values);
      const reviewData = {
        submissionId: id,
        reviewerId: reviewerId,
        reviewerName: `${firstName} ${lastName}`,
        recommendation,
        willingToReview: willingToReview === "yes", // Convert to boolean
        commentsToEditor: editorComments || "", // Default to empty string if no comments
        commentsToAuthor: authorComments,
        fileUrl,
      };
      console.log("Review Data:", reviewData); // Log review data for debugging
      const response = await submit_review(reviewData);
      console.log("Review submitted successfully", response);

      // Show success message and refresh the page
      setTimeout(() => {
        message.success("Submission successful!");
      }, 2000); // Delay to allow the user to see the success message
    } catch (error) {
      console.error("Error submitting review:", error.response || error);
      if (error.response && error.response.data) {
        console.error("Server response data:", error.response.data);
      }
      message.error("Error submitting review. Please try again.");
    }
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

  const handleFileUploaded = (response, id) => {
    if (response && response.path) {
      console.log(`File uploaded for ${id}: ${response.path}`);
      setFileUrl(response.path); // Update file URL state
    }
  };

  const handleFileListChange = (fileList) => {
    form.setFieldsValue({ uploadedFile: fileList });
  };

  // Define the data for the Table component dynamically
  const data = articleData ? [
    {
      key: "1",
      field: "Article title",
      value: articleData.title || "N/A",
    },
    {
      key: "2",
      field: "Reviewer’s name",
      value: `${firstName} ${lastName}`,
    },
    {
      key: "3",
      field: "Reviewer’s contact details",
      value: email,
    },
    {
      key: "4",
      field: "Target date",
      value: articleData.targetDate || "N/A",
    },
  ] : [];

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
        <Button type="primary" href={articleData ? articleData.file.body : '#'} target="_blank" download="Manuscript.pdf">
          Download Manuscript
        </Button>
      </div>

      <div style={{ margin: "20px 0" }}>
        <b>Information for reviewers</b>
        <p>
          Studies in Language Assessment (SiLA) is the international
          peer-reviewed research journal of the Association for Language Testing
          and Assessment of Australia and New Zealand (
          <a href="https://www.altaanz.org/" target="_blank" rel="noopener noreferrer">
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
          <a href="https://www.altaanz.org/" target="_blank" rel="noopener noreferrer">
            ALTAANZ
          </a>{" "}
          and the{" "}
          <a
            href="https://arts.unimelb.edu.au/language-testing-research-centre/research/publications"
            target="_blank" rel="noopener noreferrer"
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

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={<b>Recommendation (Select One):</b>}
          name="recommendation"
          rules={[{ required: true, message: "Please select your recommendation" }]}
        >
          <Radio.Group onChange={handleRecommendationChange} value={recommendation}>
            <Radio value="accept">
              Accept – this article is suitable for publication.
            </Radio>
            <Radio value="minor revisions">
              Accept with minor revisions – this article is suitable for
              publication in its present form, provided that minor corrections or
              revisions are made as specified in the comments below.
            </Radio>
            <Radio value="revise resubmit">
              Revise & resubmit – this article is potentially suitable for
              publication, but requires considerable revision as specified in the
              comments below.
            </Radio>
            <Radio value="reject">
              Reject – this article is not recommended for publication.
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={<b>Would you be willing to review a revision of this manuscript?</b>}
          name="willingToReview"
          rules={[{ required: true, message: "Please select your willingness" }]}
        >
          <Radio.Group onChange={handleWillingToReviewChange} value={willingToReview}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={<b>Comments to the Editors (confidential)</b>}
          name="editorComments"
          style={{marginBottom: "60px"}}
        >
          <ReactQuill
            className="editor-quill"
            theme="snow"
            value={editorComments}
            onChange={handleEditorCommentsChange}
            style={{ height: "300px" }}
            placeholder="Enter confidential comments to the editors (optional)"
          />
        </Form.Item>

        <Form.Item
          label={<b>Comments to the Author(s)</b>}
          name="authorComments"
          rules={[{ required: true, message: "Please write your comments" }]}
          style={{marginBottom: "60px"}}
        >
          <ReactQuill
            className="author-quill"
            theme="snow"
            value={authorComments}
            onChange={handleAuthorCommentsChange}
            style={{ height: "300px" }}
            placeholder="Enter comments to the author(s) (required)"
          />
        </Form.Item>

        <Form.Item
          label={<b>Manuscript with comments (Optional)</b>}
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

        <Button type="primary" htmlType="submit" style={{ marginTop: "10px" }}>
          Submit Review
        </Button>
      </Form>
    </div>
  );
};

export default ReviewPage;
