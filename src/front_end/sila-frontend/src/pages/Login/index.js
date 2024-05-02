import "./index.scss";

import { Card, Form, Input, Button, message, Radio } from "antd";
import logo from "../../assets/logo.jpg";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { fetch_login } from "../../store/modules/user";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const on_finish = async (values) => {
    try {
      await dispatch(fetch_login(values));
      navigate("/")
      message.success("sign in success !!!")
    } catch (error) {
      if (error.message && error.message.includes("timeout..")) {
        message.error(
          "Login timeout, please check your network connection and try again."
        );
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Login failed, please try again.");
      }
    }
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
            <Link to="/register">Create an account</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
