import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Form, Input, Button, message } from "antd"
import { reset_password_ } from '../../apis/user';
import { clear_user } from '../../store/modules/user';
import { useDispatch } from 'react-redux';

const Restpassword = () => {
    const dispatch = useDispatch()
    dispatch(clear_user());

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromURL = searchParams.get('email');
    const token = searchParams.get('token').replace(/\s/g, '+');

    const on_finish = async (values) => {
        try {
            values.token = token
            console.log(values)
            const res = await reset_password_(values);
            // navigate('/login');
            message.success(res);
            
            navigate('/login');
        } catch (error) {
            console.log(error)

            if (error.response) {
                message.error(`Error: ${error.response.data}`);
            } else {
                message.error(`Network Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="login">
            <Card className="login-container" style={{ height: '400px' }}>
                <Form
                    name="basic"
                    labelCol={{ span: 9, }}
                    wrapperCol={{ span: 16, }}
                    style={{ maxWidth: 800, }}
                    initialValues={{ email: emailFromURL }}
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
                                type: 'email',
                                message: 'Please enter a valid email!',
                            }
                        ]}
                    >
                        <Input size="large" readOnly tabIndex={-1} />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&\-=_+])[A-Za-z\d@#$!%*?&\-=_+]{8,20}$/,
                                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be 8-20 characters long.',
                            }
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            // {
                            //     pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&\-=_+])[A-Za-z\d@#$!%*?&\-=_+]{8,20}$/,
                            //     message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be 8-20 characters long.',
                            // },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                }
                            })
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Confirm Password
                        </Button> 
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Restpassword;
