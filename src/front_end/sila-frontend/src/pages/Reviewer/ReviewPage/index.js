import React, { useState } from 'react';
import { Card, Form, Button } from 'antd';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import "./index.scss";

const ReviewPage = () => {
    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState('');

    const pdfFile = "/A.pdf";

    const handleSubmit = () => {
        console.log("Submitting content:", editorContent);

    };

    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    return (
        <div className="reviewpage">
            <Card title="Article Title">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div style={{  border: '1px solid rgba(0, 0, 0, 0.3)', height: '750px' }}>
                        <Viewer fileUrl={pdfFile} />
                    </div>
                </Worker>

                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item>
                        <ReactQuill
                            className="publish-quill"
                            theme="snow"
                            value={editorContent}
                            onChange={handleEditorChange}
                            placeholder="Please enter your comments"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default ReviewPage;
