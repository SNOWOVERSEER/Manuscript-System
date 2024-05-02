import { Layout, Menu, Popconfirm } from 'antd'
import {
  DiffOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clear_user, fetch_userinfo } from '../../../store/modules/user'

const { Header, Sider } = Layout

const items = [
  {
    label: 'Assign Reviewer',
    key: '/editor',
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
    if (pathname.startsWith('/editor/assignreviewerdetail')) {
      return ['/editor'];
    }
    return [pathname]
  }

  return (
    <Layout>

      <Header className="header"  style={{ backgroundColor: '#2c2c2c' }}>
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
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