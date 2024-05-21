import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  DatePicker,
  Form,
  Input,
  message,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import logo from "../../../assets/logo.jpg"; // Adjust the path as necessary
import {
  editor_review_API,
  editor_submit_decison_API,
} from "../../../apis/editor_review";
import ReviewStatusTable from "./reviewStatusTable"; // Import the component
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const EditorArticle = () => {
  const [commentsToEditor, setEditorComments] = useState([]);
  const [commentsToAuthor, setAuthorComments] = useState([]);
  const [data, setData] = useState([]); // State to store fetched data
  const [reviewTableData, setReviewTableData] = useState([]); // State to store review status data
  const [manuscriptURL, setManuscriptURL] = useState("");
  const [appendixURL, setAppendixURL] = useState("");
  const [supplementaryFileURL, setSupplementaryFileURL] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // State to store selected date
  const [editorCommentsToAuthor, setEditorCommentsToAuthor] = useState(""); // State to store editor comments to author
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false); // State to store form disabled status
  const [decision, setDecision] = useState(""); // State to store the decision

  const { submissionID } = useParams();
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  useEffect(() => {
    const savedFormDisabled = localStorage.getItem(
      `isFormDisabled_${submissionID}`
    );
    if (savedFormDisabled === "true") {
      setIsFormDisabled(true);
    }

    async function fetchReviewData(submissionID) {
      try {
        const res = await editor_review_API(submissionID);
        console.log(res.data);
        if (res && res.data) {
          const {
            title,
            category,
            reviewDeadline,
            files,
            reviewers,
            commentsFromReviewers,
            commentsToAuthor,
            submissionDate,
          } = res.data;

          const manuscriptURL = files[0]?.body || "";
          const appendixURL = files[0]?.appendix || "";
          const supplementaryFileURL = files[0]?.others || "";

          setData([
            { key: "1", field: "Article title", value: title },
            { key: "2", field: "Deadline for reviewer", value: reviewDeadline },
            { key: "3", field: "Category", value: category },
            { key: "4", field: "Submission date", value: submissionDate },
          ]);

          // Format comments from reviewers
          const formattedCommentsToEditor = commentsFromReviewers.map(
            (comment, index) => ({
              key: index,
              reviewer: comment.Reviewer,
              comments: comment.Comments,
            })
          );
          const formattedCommentsToAuthor = commentsToAuthor.map(
            (comment, index) => ({
              key: index,
              reviewer: comment.Reviewer,
              comments: comment.Comments,
            })
          );

          setEditorComments(formattedCommentsToEditor);
          setAuthorComments(formattedCommentsToAuthor);
          setReviewTableData(reviewers);
          setManuscriptURL(manuscriptURL);
          setAppendixURL(appendixURL);
          setSupplementaryFileURL(supplementaryFileURL);
        }
      } catch (error) {
        console.error("Error fetching review data:", error);
      }
    }

    // Fetch review data for the editor using the editor ID
    fetchReviewData(submissionID);
  }, [submissionID]);

  const handleDecision = (decision) => {
    setDecision(decision);
    form.setFieldsValue({ decision }); // Set decision in the form
    Modal.confirm({
      title: "Confirm Decision",
      content: `Are you sure you want to ${decision.toLowerCase()} this submission?`,
      onOk: handleSubmit,
    });
  };

  const handleRevised = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      const data = {
        submissionId: submissionID,
        revisedDeadline: values.selectedDate,
        decision: values.decision,
        commentsFromEditor: values.editorCommentsToAuthor,
      };
      console.log(data);

      await editor_submit_decison_API(data);
      message.success("Decision submitted successfully!");
      setIsFormDisabled(true); // Disable form after submission
      localStorage.setItem(`isFormDisabled_${submissionID}`, "true"); // Save form disabled status
    } catch (error) {
      console.error("Error submitting decision:", error);
      message.error("Failed to submit decision. Please try again.");
    }
  };

  const handleOk = () => {
    modalForm
      .validateFields()
      .then((values) => {
        const formattedDate = dayjs(values.date).format("YYYY-MM-DD HH:mm:ss");
        setSelectedDate(formattedDate);
        form.setFieldsValue({ selectedDate: formattedDate }); // Set selected date in the form
        setIsModalOpen(false);
        handleDecision(`Revised (${formattedDate})`);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Cancel Date Picker
  const handleCancel = () => {
    setIsModalOpen(false);
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

  const commentColumns = [
    {
      title: "Reviewer",
      dataIndex: "reviewer",
      key: "reviewer",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
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
              href={manuscriptURL}
              target="_blank"
              disabled={!manuscriptURL || isFormDisabled}
            >
              Download Manuscript
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              type="primary"
              href={appendixURL}
              target="_blank"
              disabled={!appendixURL || isFormDisabled}
            >
              Download Appendix
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              type="primary"
              href={supplementaryFileURL}
              target="_blank"
              disabled={!supplementaryFileURL || isFormDisabled}
            >
              Download Supplementary File
            </Button>
          </div>
        </Card>

        <Card className="reviewStatusTable" style={{ marginBottom: "30px" }}>
          <ReviewStatusTable reviewData={reviewTableData} />
        </Card>

        <Card
          title="Comments from reviewer to editor"
          style={{ paddingBottom: "50px", marginBottom: "30px" }}
        >
          <Table
            columns={commentColumns}
            dataSource={commentsToEditor}
            pagination={false}
          />
        </Card>

        <Card
          title="Comments from reviewer to the Author(s)"
          style={{ paddingBottom: "50px", marginBottom: "30px" }}
        >
          <Table
            columns={commentColumns}
            dataSource={commentsToAuthor}
            pagination={false}
          />
        </Card>

        <Card
          title="Editor comments to Author"
          style={{ paddingBottom: "50px", marginBottom: "30px" }}
        >
          <Form form={form} layout="vertical" disabled={isFormDisabled}>
            <Form.Item
              name="editorCommentsToAuthor"
              rules={[
                { required: true, message: "Please provide your comments" },
              ]}
            >
              <ReactQuill
                className="editorComments"
                theme="snow"
                placeholder="Input the comments."
                style={{ height: 300 }}
                value={editorCommentsToAuthor}
                onChange={setEditorCommentsToAuthor}
                readOnly={isFormDisabled}
              />
            </Form.Item>
          </Form>
        </Card>

        <div
          className="decision buttons"
          style={{ textAlign: "center", padding: "20px" }}
        >
          <Form form={form} layout="vertical" disabled={isFormDisabled}>
            <Form.Item name="decision" style={{ display: "none" }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="selectedDate" style={{ display: "none" }}>
              <Input type="hidden" />
            </Form.Item>

            <Button
              type="primary"
              onClick={() => handleDecision("Accept")}
              style={{
                width: "20%",
                height: "40px",
                background: "#34A853",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: "0.9",
              }}
              disabled={isFormDisabled}
            >
              {isFormDisabled && decision.includes("Accept")
                ? "Accepted"
                : "Accept"}
            </Button>

            <Button
              type="primary"
              onClick={() => handleDecision("Reject")}
              style={{
                marginLeft: "5%",
                width: "20%",
                height: "40px",
                background: "#EB4335",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: "0.9",
              }}
              disabled={isFormDisabled}
            >
              {isFormDisabled && decision.includes("Reject")
                ? "Rejected"
                : "Reject"}
            </Button>

            <Button
              type="primary"
              onClick={handleRevised}
              style={{
                marginLeft: "5%",
                width: "20%",
                height: "40px",
                background: "#FBBC05",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: "0.9",
              }}
              disabled={isFormDisabled}
            >
              {selectedDate ? (
                <span style={{ fontSize: "12px" }}>
                  {"Revised " + "(" + selectedDate + ")"}
                </span>
              ) : isFormDisabled && decision.includes("Revised") ? (
                "Revised"
              ) : (
                "Revised"
              )}
            </Button>
          </Form>

          <Modal
            title="Select a Date and Time"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Submit"
          >
            <Form form={modalForm}>
              <Form.Item
                name="date"
                label="Date and Time"
                rules={[
                  { required: true, message: "Please select a date and time" },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  disabled={isFormDisabled}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Card>
    </div>
  );
};

export default EditorArticle;
