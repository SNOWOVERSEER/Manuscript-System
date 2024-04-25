import React, { useState } from 'react';
import './UserProfileDisplay.css';
import { Button, Form, Input, Select, Upload } from 'antd';
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

/* eslint-disable no-template-curly-in-string */
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

// User profile display component
const UserProfileDisplay = ({ userData, onEdit }) => {
  return (
    <div className="profile-container">
      <div className="profile-header">Account</div>
      <div className="profile-section">
        <div className="profile-section-header">Profile</div>
        
        <div className="profile-detail">{userData.username}</div>
      </div>
      <div className="profile-section">
        <div className="profile-detail">
          <span className="profile-detail-label">Username: </span>
          <span>{userData.username}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Email addresses: </span>
          <span>{userData.Email}</span>
          <span className="primary-tag">Primary</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Address: </span>
          <span>{userData.address}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Phone Number: </span>
          <span>{userData.phoneNumber}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Gender: </span>
          <span>{userData.gender}</span>
        </div>
        <div className="profile-detail profile-detail-bio">
          <span className="profile-detail-label">Bio: </span>
          <span>{userData.bio}</span>
        </div>
      </div>
      <button className="edit-button" onClick={onEdit}>Edit</button>
    </div>
  );
};

// User profile edit form component
const UserProfileForm = ({ userData, onSave }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSave(values);
  };

  return (
    <Form
    {...layout}
    name="nest-messages"
    onFinish={onFinish}
    style={{
      maxWidth: 600,
    }}
    validateMessages={validateMessages}
    initialValues={userData}
    form={form}
  >
    
    <Form.Item
      name="username"
      label="username"
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Input />
    </Form.Item>
    
    <Form.Item
      name="Email"
      label="Email"
      rules={[
        {
          type: 'email',
          required: true,
        },
      ]}
    >
      <Input />
    </Form.Item>
    
    <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            type: 'gender',
            message: 'Please select gender!',
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
    <Form.Item name="phoneNumber" label="phoneNumber">
      <Input />
    </Form.Item>
    <Form.Item name="address" label="address">
      <Input />
    </Form.Item>
    <Form.Item name="bio" label="bio">
      <Input.TextArea />
    </Form.Item>
    <Form.Item
      wrapperCol={{
        ...layout.wrapperCol,
        offset: 8,
      }}
    >
      <Button type="primary" htmlType="submit">
        Save Changes
      </Button>
    </Form.Item>
  </Form>
  );
};

// Main profile page component
const ProfilePage = () => {
  const initialProfileData = {
    username: 'JohnDoe',
    Email: '123@gmail.com',
    address: '1234 Sunset Blvd',
    phoneNumber: '123-456-7890',
    gender: 'Female',
    bio: 'This is a short bio...This is a short bio...This is a short bio...This is a short bio...This is a short bio...',
    
  };

  const [userData, setUserData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedData) => {
    setUserData({ ...userData, ...updatedData });
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <UserProfileForm userData={userData} onSave={handleSave} />
      ) : (
        <UserProfileDisplay userData={userData} onEdit={handleEdit} />
      )}
    </div>
  );
};

export default ProfilePage;


