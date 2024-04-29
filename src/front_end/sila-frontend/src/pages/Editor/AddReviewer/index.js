import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message } from "antd"
import { register_API } from '../../../apis/user';

const AssignReviewer = ()=>{

    const navigate = useNavigate()

    const on_finish = async (values) => {
        try {
            const res = await register_API(values)
            navigate('/') //navigate to editor home page
            message.success(res.message)
        } catch (error) {
            if (error.response) {
                // such as 400、500
                message.error(`Error: ${error.response.data.message}`);
            } else {
                // such as network error
                message.error(`Network Error: ${error.message}`);
            }
        }
    }

    return(
        <Card className="login-container" style={{ height: '380px' }}  title="Add a new Reviewer">
            <Form
                name="basic"
                labelCol={{ span: 6, }}
                wrapperCol={{ span: 16, }}
                style={{ maxWidth: 600, }}
                initialValues={{}}
                autoComplete="off"
                onFinish={on_finish}
                variant="filled"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                        {
                            type: 'email',
                            message: 'Please enter a valid email!',
                        }
                    ]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&-=_+])[A-Za-z\d@#$!%*?&-=_+]{8,20}$/,
                            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be 8-20 characters long.',
                        }
                    ]}
                >
                    <Input.Password size="large" />
                </Form.Item>

                <Form.Item
                    label="FirstName"
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your FirstName!',
                        },
                    ]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label="LastName"
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your LastName!',
                        },
                    ]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 6,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button> 
                    {/* <Link to="/login">go back</Link> */}
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AssignReviewer