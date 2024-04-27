import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Breadcrumb, Form, Button, Input, Space, Select } from 'antd';
import './index.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomTable from './EditableTable';
import PDFUploader from './PDFUploader';

const { Option } = Select;
const { useForm } = Form;

const Publish = () => {
    const [dataSource, setDataSource] = useState([]);
    const [form] = useForm(); // 创建表单实例
   

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const [uploadedFilePaths, setUploadedFilePaths] = useState([]); // Store multiple file paths

    const handleFileListChange = (fileList) => {
        // console.log(fileList);
        form.setFieldsValue({ uploadedFile: fileList });
    };

    const handleFileUploaded = (response) => {
        if (response && response.path) {
            setUploadedFilePaths(prevPaths => [...prevPaths, response.path]);
        }
    };

    const submit = async () => {
        form.validateFields()
            .then(values => {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('category', values.category);
                formData.append('content', values.content);
                const authors = JSON.stringify(dataSource);
                formData.append('authors', authors)
                uploadedFilePaths.forEach(path => formData.append('filePaths', path));
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

            }
        )
        
    }

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
                    initialValues={{ type: '1' }}
                    onFinish={submit}
                >
                    <Form.Item
                        label="Title Name"
                        name="title"
                        rules={[{ required: true, message: 'Please input title name' }]}
                    >
                        <Input placeholder="Input title name" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Article Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select article category' }]}
                    >
                        <Select placeholder="Select article category" style={{ width: '100%' }}>
                            <Option value={0}>Recommended</Option>
                            {/* Add other options as needed */}
                        </Select>
                    </Form.Item>
                    <CustomTable dataSource={dataSource} setDataSource={setDataSource} />
                    <Form.Item
                        label="Abstract"
                        name="content"
                        rules={[{ required: true, message: 'Please input the abstract' }]}
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
                        rules={[{ required: true, message: 'Please upload the PDF' }]}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <PDFUploader onFileListChange={handleFileListChange} onFileUploaded={handleFileUploaded}/>
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
