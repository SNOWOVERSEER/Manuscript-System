import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Input,
  Space,
  Select,
  message,
} from "antd";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomTable from "./EditableTable";
import PDFUploader from "./PDFUploader";
import { article_submission_API } from "../../apis/submisson";

const { Option } = Select;
const { useForm } = Form;

const Publish = () => {
  const [authorsInfo, setAuthorsInfo] = useState([]);
  const [form] = useForm();

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

  const submit = async () => {
    form.validateFields().then(async (values) => {
      // JSON.stringify(authorsInfo)
      const jsonData = {
        title: values.title,
        abstract: values.abstract,
        authorId: localStorage.getItem("id"),
        category: "0",
        authorsInfo: JSON.stringify(authorsInfo),
        declaration: "Not Implemented Yet",
        pdFs: JSON.stringify(uploadedFilePaths),
      };
      console.log("---------------");
      // console.log(authorsInfo)

      console.log(jsonData);
      // for (let [key, value] of Object.entries(jsonData)) {
      //     console.log(`${key}: ${value}`);
      // }

      // Sending the formData to the backend API
      try {
        const response = await article_submission_API(jsonData);
        console.log("Submission response:", response);
        message.success("Article submitted successfully!");
      } catch (error) {
        console.error("Submission error:", error);
        message.error("Failed to submit the article.");
      }
    });
  };

  return (
    <div className="Publish">
      <Card
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Start New Submission</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ type: "1" }}
          onFinish={submit}
        >
          <Form.Item
            label="Title Name"
            name="title"
            rules={[{ required: true, message: "Please input title name" }]}
          >
            <Input placeholder="Input title name" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Article Category"
            name="category"
            rules={[
              { required: true, message: "Please select article category" },
            ]}
          >
            <Select
              placeholder="Select article category"
              style={{ width: "100%" }}
            >
              <Option value={"Regular issue research paper"}>
                Regular issue research paper
              </Option>
              <Option value={"Discussion paper"}>Discussion paper</Option>
              <Option value={"Short research report"}>
                Short research report
              </Option>
              <Option value={"Special issue paper"}>Special issue paper</Option>
              <Option value={"Test review"}>Test review</Option>
              <Option value={"Book review"}>Book review</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
          <CustomTable
            dataSource={authorsInfo}
            setDataSource={setAuthorsInfo}
          />
          <Form.Item
            label="Abstract"
            name="abstract"
            rules={[{ required: true, message: "Please input the abstract" }]}
            className="form-item-spacing"
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="Input the abstract"
              style={{ height: 200 }}
            />
          </Form.Item>
          <Form.Item
            label="Upload PDF"
            name="uploadedFile"
            rules={[{ required: true, message: "Please upload the PDF" }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <PDFUploader
              id={"body"}
              onFileListChange={handleFileListChange}
              onFileUploaded={handleFileUploaded}
            />
            <PDFUploader
              id={"appendix"}
              onFileListChange={handleFileListChange}
              onFileUploaded={handleFileUploaded}
            />
            <PDFUploader
              id={"others"}
              onFileListChange={handleFileListChange}
              onFileUploaded={handleFileUploaded}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
