import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Sider } = Layout

const items = [
  {
    label: 'Home',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: 'Submitted Manuscript',
    key: '/submitted',
    icon: <DiffOutlined />,
  },
  {
    label: 'Start New Submission',
    key: '/startnewsubmission',
    icon: <EditOutlined />,
  },
]

const MyLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const onMenuClick = (menu)=>{
    // console.log(menu.key)
    navigate(menu.key)
  }

  return (
    <Layout>

      <Header className="header"  style={{ backgroundColor: '#2c2c2c' }}>
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">Username</span>
          <span className="user-logout">
            <Popconfirm title="Sign Out？" okText="OK" cancelText="Cancel">
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
            selectedKeys={location.pathname}
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
export default MyLayout