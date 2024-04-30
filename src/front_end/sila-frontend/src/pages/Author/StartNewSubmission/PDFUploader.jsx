// PDFUploader.jsx
import React, { useState } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const PDFUploader = ({ onFileListChange, onFileUploaded, id }) => {
  const [fileList, setFileList] = useState([]);

  const draggerProps = {
    name: "file",
    multiple: false,
    action: "http://13.211.202.4:5266/Manuscripts/uploadfile",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    accept: ".pdf",
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
      return file.type === "application/pdf" || Upload.LIST_IGNORE;
    },
  };

  return (
    <Dragger {...draggerProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Dragger>
  );
};

export default PDFUploader;
