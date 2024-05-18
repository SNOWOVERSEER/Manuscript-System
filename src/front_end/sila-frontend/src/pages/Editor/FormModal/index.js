import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useState, useEffect } from "react";
import './index.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
import { assign_reviewers } from '../../../apis/user';
import { message } from 'antd';

const { Option } = Select;

const FormModal = ({ open, onCancel, onOk, articleData, reviewers }) => {
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(articleData); // Set form values when modal is open
    } else {
      setSelectedReviewerIds([]); // Reset selected reviewers when modal is closed
      form.resetFields(); // Reset form fields
    }
  }, [open, form, articleData]);

  const handleReviewerChange = id => {
    if (!selectedReviewerIds.includes(id)) {
      setSelectedReviewerIds(prev => [...prev, id]);
    }
  };

  const removeReviewer = id => {
    setSelectedReviewerIds(prev => prev.filter(reviewerId => reviewerId !== id));
  };

  const handleOk = async () => {
    // Construct payload
    const payload = {
      submissionId: articleData.submission_id,
      reviewerIds: selectedReviewerIds
    };

    try {
      // console.log(payload)
      const res = await assign_reviewers(payload)
      // console.log(res)
      message.success('Reviewers assigned successfully');


    } catch (error) {
        if (error.response) {
            // such as 400、500
            message.error(`Error: ${error.response.data.message}`);
        } else {
            // such as network error
            message.error(`Network Error: ${error.message}`);
        }
    }

    onOk(); // Call onOk to handle additional logic if needed
    onCancel(); // Close the modal
    
    // Send POST request
    // fetch('YOUR_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(payload)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Success:', data);
    //   onOk(selectedReviewerIds); // Call onOk with selectedReviewerIds
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    // });

  };

  // Function to strip HTML tags
  const stripHtmlTags = html => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
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
        form={form}
        name="articleForm"
        initialValues={articleData}
        onFinish={handleOk}
        labelCol={{ span: 4 }} // Increased span for label column
        wrapperCol={{ span: 20 }} // Adjusted span for wrapper column
      >
        <Form.Item label="Title">
          <span className="articleTitle">{articleData?.title}</span>
        </Form.Item>

        <Form.Item label="Author Name">
          <span className="authorName">{articleData?.authorName}</span>
        </Form.Item>

        <Form.Item label="Abstract">
          <span className="abstract">{stripHtmlTags(articleData?.abstract)}</span>
        </Form.Item>

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
              <Option key={reviewer.id} value={reviewer.id}>
                {reviewer.email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <ul className="ulContainer">
          {selectedReviewerIds.map(id => {
            const reviewer = reviewers.find(rev => rev.id === id);
            return (
              <li
                key={id}
                style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}
              >
                {reviewer.email} ({reviewer.name}, {reviewer.numberOfTasksAssigned} tasks in progress)
                <Button
                  type="primary"
                  icon={<CloseCircleOutlined />}
                  onClick={() => removeReviewer(id)}
                />
              </li>
            );
          })}
        </ul>
      </Form>
    </Modal>
  );
};

export default FormModal;
