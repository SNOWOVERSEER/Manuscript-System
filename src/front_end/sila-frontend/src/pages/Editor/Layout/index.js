import { Layout, Menu, Popconfirm, message, Button, Tooltip } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clear_user, fetch_userinfo } from '../../../store/modules/user'
import { reset_password } from '../../../apis/user'

const { Header, Sider } = Layout

const items = [
  {
    label: 'Assign Reviewer',
    key: '/editor',
    icon: <DiffOutlined />,
  },
  {
    label: 'Assgined Articles',
    key: '/editor/assignedarticleslist',
    icon: <DiffOutlined />,
  },
  {
    label: 'Add Reviewer',
    key: '/editor/addreviewer',
    icon: <DiffOutlined />,
  },
]

const LayoutEditor = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // console.log(location.pathname)
  useEffect(()=>{
    dispatch(fetch_userinfo())
  }, [dispatch])
  const name = useSelector(state => state.user.userInfo.firstName) + " " + useSelector(state => state.user.userInfo.lastName)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const onMenuClick = (menu)=>{
    // console.log(menu.key)
    navigate(menu.key)
  }

  const on_logout = ()=>{
    // http
    dispatch(clear_user())
    navigate('/login')
  }

  const getSelectedKeys = (pathname) => {
    if (pathname.startsWith('/editor/editorarticle')) {
      return ['/editor/assignedarticleslist'];
    }
    return [pathname]
  }

  const handleForgotPassword = async () => {
    if (isButtonDisabled) return; 
    const id = localStorage.getItem("id"); // 获取id
    const data = { "userId":id }; // 创建一个包含id的对象
    try {
      const res = await reset_password( data );
      // console.log(res)
      message.success(res)

    } catch (error) {
        if (error.response) {
            // such as 400、500
            message.error(`Error: ${error.response.data.message}`);
        } else {
            // such as network error
            message.error(`Network Error: ${error.message}`);
        }
    }

    setIsButtonDisabled(true); // 禁用按钮
    setTimeout(() => setIsButtonDisabled(false), 10000); 
  }

  return (
    <Layout>

      <Header className="header"  style={{ backgroundColor: '#2c2c2c' }}>
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>

          <Tooltip title="Reset Password">
          <Button
            icon={<LockOutlined style={{ fontSize: "20px" }}/>}
            onClick={handleForgotPassword}
            disabled={isButtonDisabled}
            // style={{ border: 'none', color: 'rgba(255, 255, 255, 0.65)' }} // 根据需要调整样式
            style={{
              border: 'none',
              color: 'white', // 保证图标可见
              backgroundColor: '#2c2c2c', // 设置背景颜色为黑色
              padding: '5px', // 适当的填充可以让按钮看起来更好
              borderRadius: '5px', // 可选，给按钮添加圆角
              marginRight: '10px',
              
            }}
          />
        </Tooltip>

          <span className="user-logout">
            <Popconfirm title="Sign Out？" okText="OK" cancelText="Cancel" onConfirm={on_logout}>
              <LogoutOutlined style={{ fontSize: '20px' }} />
            </Popconfirm>
          </span>
        </div>
      </Header>

      <Layout>
        <Sider width={230} className="site-layout-background">
          <Menu
            mode="inline"
            theme="light"
            selectedKeys={getSelectedKeys(location.pathname)}
            items={items}
            onClick={onMenuClick}
            style={{ height: '100%', borderRight: 0, backgroundColor: '#f9f9f9' }} ></Menu>
        </Sider>

        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />  
        </Layout>
      </Layout>

    </Layout>
  )
}
export default LayoutEditor