import { Link} from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select} from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'

import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Option } = Select
const { RangePicker } = DatePicker

const Submitted = () => {
    
    // prepare the column data
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 120,
        },
        {
          title: 'Title',
          dataIndex: 'title',
          width: 220
        },
        {
          title: 'Status',
          dataIndex: 'status',
          //render: data => <Tag color="green">审核通过</Tag>
        },
        {
          title: 'Submitted',
          dataIndex: 'pubdate'
        },
       
        {
          title: 'Decision',
          dataIndex: 'decision_result',
          render: data => <Tag color="green">Approval</Tag>
        }
      ]
    // prepare the body data
    const data = [
    {
        id: '8218',
        decision_result: 2,
        pubdate: '2019-03-11 09:00:00',
        status: 'Waiting for Review',
        title: 'abc1234'
    }
    ]

  return (
    <div>
      <Card title={`All Submitted Articles：`}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={false}/>
      </Card>
    </div>
  )
}

export default Submitted

