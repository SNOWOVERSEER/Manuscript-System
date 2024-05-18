import React from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

const EditorArticle = () => {
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} autoComplete="off">
      <Title level={2}>Review Form from Reviewer-name</Title>
      <Form.Item
        label="Article Title"
        name="title"
        rules={[{ message: "Please input the article title!" }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="Reviewer’s Name"
        name="reviewerName"
        rules={[{ message: "Please input your name!" }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="Reviewer’s Contact Details"
        name="contactDetails"
        rules={[{ message: "Please input your contact details!" }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="Target Date"
        name="targetDate"
        rules={[{ message: "Please input your contact details!" }]}
      >
        <Input disabled />
      </Form.Item>

      <Title level={4}>Reviewing Guidelines</Title>
      <Form.Item
        name="recommendation"
        label="Recommendation"
        rules={[{ message: "Please select your recommendation!" }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item name="willingToReviewRevision" valuePropName="checked">
        <Checkbox>
          Reviewer willing to review a revision of this manuscript?
        </Checkbox>
      </Form.Item>
      <Form.Item
        label="Comments to the Editors (confidential)"
        name="commentsToEditors"
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Comments to the Author(s)" name="commentsToAuthors">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Accept
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditorArticle;
