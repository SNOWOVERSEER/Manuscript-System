// UserProfileForm.jsx
import React from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import "./UserEditProfileForm.scss"; // Ensure this path is correct
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const UserEditProfileForm = ({ userData, onSave }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSave({
      ...values,
      birthDate: values.birthDate ? values.birthDate.format(dateFormat) : null,
    });
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
          initialValues={{
            ...userData,
            birthDate: userData.birthDate
              ? dayjs(userData.birthDate, dateFormat)
              : null,
          }}
        >
          <Form.Item
            name="firstName"
            label="FirstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="LastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", required: true }]}
          >
            <Input readOnly className="readonly-input" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ message: "Please select your gender!" }]}
          >
            <Select placeholder="Select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone Number">
            <Input />
          </Form.Item>

          <Form.Item name="birthDate" label="Date of Birth">
            <DatePicker
              defaultValue={dayjs("01/01/2015", dateFormat)}
              format={dateFormat}
            />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Bio" rules={[{ type: "bio" }]}>
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