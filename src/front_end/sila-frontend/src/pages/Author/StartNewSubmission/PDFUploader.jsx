import React, { useState } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { URL } from "../../../utils/http";

const { Dragger } = Upload;

const PDFUploader = ({ onFileListChange, onFileUploaded, id }) => {
  const [fileList, setFileList] = useState([]);

  const getTextBasedOnId = (id) => {
    switch (id) {
      case "body":
        return "Click or drag your anonymised manuscript to this area to upload";
      case "appendix":
        return "Appendix (if applicable)";
      case "others":
        return "Supplementary materials (if applicable)";
      case "Reviewed":
        return "Upload PDF for your local review";
      default:
        return "Click or drag file to this area to upload";
    }
  };

  const draggerProps = {
    name: "file",
    multiple: false,
    action: `${URL}Manuscripts/uploadfile`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    accept: ".pdf,.doc,.docx", // Accept PDF and Word documents
    fileList,
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        // responses = path
        onFileUploaded(info.file.response, id);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      const filteredList = info.fileList.filter((file) => !!file.status);
      setFileList(filteredList);
      onFileListChange(filteredList);
    },
    beforeUpload(file) {
      if (fileList.length >= 1) {
        message.error("Only one file can be uploaded!");
        return Upload.LIST_IGNORE; // Ignore the file, do not add to list
      }
      const isPdfOrWord =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isPdfOrWord) {
        message.error("You can only upload PDF or Word document files!");
        return Upload.LIST_IGNORE;
      }
      return isPdfOrWord;
    },
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{getTextBasedOnId(id)}</p>
      </Dragger>
    </div>
  );
};

export default PDFUploader;
