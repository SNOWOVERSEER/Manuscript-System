// UserProfileForm.jsx
import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import './UserEditProfileForm.scss'; // Ensure this path is correct

const { Option } = Select;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const UserEditProfileForm = ({ userData, onSave }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSave(values);
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={userData}
        >
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Email" label="Email" rules={[{ type: 'email', required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
            <Select placeholder="Select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Bio" rules={[{ required: true }]}>
            <Input.TextArea rows={10} /> 
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserEditProfileForm;

