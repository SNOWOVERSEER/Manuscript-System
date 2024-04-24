// PDFUploader.jsx

import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const PDFUploader = ({ onFileListChange }) => {
    const [fileList, setFileList] = useState([]);

    const draggerProps = {
        name: 'file',
        multiple: false,
        action: 'http://13.211.202.4:5266/Manuscripts/uploadfile', // Replace with your actual upload URL
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        accept: '.pdf',
        fileList,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
            setFileList(info.fileList.filter(file => !!file.status));
            onFileListChange(info.fileList);
        },
        beforeUpload(file) {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error('You can only upload PDF files!');
            }
            return isPDF || Upload.LIST_IGNORE;
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Only single PDF files can be uploaded.
            </p>
        </Dragger>
    );
};

export default PDFUploader;
