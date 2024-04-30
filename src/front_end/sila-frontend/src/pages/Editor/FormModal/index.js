import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormModal = ({ open, onCancel, onOk, articleData }) => {
  return (
    <Modal
      title="Edit Article"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width="80%"
    >
      <Form
        name="articleForm"
        initialValues={articleData} 
        onFinish={onOk}
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
      </Form>
    </Modal>
  );
};

export default FormModal;
