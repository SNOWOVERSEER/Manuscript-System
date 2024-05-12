import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useState } from "react"
import './index.scss'
import { CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select



const FormModal = ({ open, onCancel, onOk, articleData, reviewers }) => {
  
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);

  const handleReviewerChange = id => {
    if (!selectedReviewerIds.includes(id)) {
      setSelectedReviewerIds(prev => [...prev, id]);
    }
  };

  const removeReviewer = id => {
    setSelectedReviewerIds(prev => prev.filter(reviewerId => reviewerId !== id));
  };

  const handleOk = () => {
    onOk(selectedReviewerIds);
    // http.post()
  };

  return (
    <Modal
      title="Edit Article"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width="80%"
    >
      <Form
        name="articleForm"
        initialValues={articleData} 
        onFinish={handleOk} 
        labelCol={{ span: 2 }} 
        wrapperCol={{ span: 16 }} 
      >
        
        <Form.Item label="Title">
          <span className="articleTitle">{articleData?.title}</span>
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: 'Please input the content!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* reviewer */}
        <Form.Item label="Reviewers">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a reviewer"
            optionFilterProp="children"
            onChange={handleReviewerChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {reviewers.map(reviewer => (
              <Option key={reviewer.id} value={reviewer.id}>{reviewer.email}</Option>
            ))}
          </Select>
        </Form.Item>
        <ul  className="ulContainer">
          {selectedReviewerIds.map(id => (
            <li key={id} style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              {reviewers.find(rev => rev.id === id).email} 
              <Button type="primary"   icon={<CloseCircleOutlined />}  onClick={() => removeReviewer(id)}></Button>
            </li>
          ))}
        </ul>
        {/* reviewer */}

      </Form>
    </Modal>
  );
};

export default FormModal;
