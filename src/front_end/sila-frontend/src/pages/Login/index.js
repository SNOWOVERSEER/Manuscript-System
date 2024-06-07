import "./index.scss";

import { Card, Form, Input, Button, message, Radio, Modal } from "antd";
import { useState } from "react";
import logo from "../../assets/logo.jpg";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { fetch_login } from "../../store/modules/user";
import { reset_password } from "../../apis/user";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const on_finish = async (values) => {
    try {
      await dispatch(fetch_login(values));
      navigate("/");
      message.success("sign in success !!!");
    } catch (error) {
      handle_error(error);
    }
  };

  const handle_error = (error) => {
    if (error.message && error.message.includes("timeout..")) {
      message.error(
        "Login timeout, please check your network connection and try again.", 5
      );
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      message.error(error.response.data.message, 5);
    } else {
      message.error("Login failed, please try again.", 5);
    }
  };

  const show_modal = () => {
    setIsModalVisible(true);
  };

  const handle_ok = async () => {
    try {
      const values = await form.validateFields();
      const data = {"email":values.email}
      await reset_password(data);
      message.success("Password reset email sent!");
      setIsModalVisible(false);
      form.resetFields();  // Reset the form after submission
    } catch (error) {
      // Handle potential errors, such as validation or API call failure
      console.error('Reset password error:', error);
      message.error("Failed to send reset email. Please try again.");
    }
  };

  const handle_cancel = () => {
    setIsModalVisible(false);
    form.resetFields();  // Reset the form on cancel as well
  };

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />

        <Form
          validateTrigger="onBlur"
          onFinish={on_finish}
          initialValues={{ role: "Author" }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "please enter the email" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "please enter the password" }]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>

          <Form.Item name="role">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="Author">Author</Radio.Button>
              <Radio.Button value="Reviewer">Reviewer</Radio.Button>
              <Radio.Button value="Editor">Editor</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Sign In
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="link" onClick={show_modal}>
              Forgot Password?
            </Button>
            <Link to="/register">Create an account</Link>
            <Modal
              title="Reset Password"
              visible={isModalVisible}
              onOk={handle_ok}
              onCancel={handle_cancel}
              footer={[
                <Button key="back" onClick={handle_cancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handle_ok}>
                  Submit
                </Button>,
              ]}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Please enter a valid email!" }
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
              </Form>
            </Modal>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
