import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clear_user, fetch_userinfo } from '../../store/modules/user'

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
  const dispatch = useDispatch()

  
  useEffect(()=>{
    // dispatch(fetch_userinfo())
  }, [dispatch])
  // const name = useSelector(state => state.user.userInfo.name)

  const onMenuClick = (menu)=>{
    // console.log(menu.key)
    navigate(menu.key)
  }

  const on_logout = ()=>{
    // http
    dispatch(clear_user())
    navigate('/login')
  }

  return (
    <Layout>

      <Header className="header"  style={{ backgroundColor: '#2c2c2c' }}>
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">name</span>
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