import { useEffect, useState } from "react"
// import { get_articles_for_review_API } from "../../../apis/user"
import { Table, Tag, Space } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { Card, Button } from 'antd'
import { useNavigate } from "react-router-dom"
import { ArticleStatus } from "../../../utils/status"


const ReviewAndScore = ()=>{
    const navigate = useNavigate()
    //get articles for review
    const [articles, setArticles] = useState([])
    useEffect(()=>{
        //1.
        // async function get_articles_for_review(){
        //     const res = await get_articles_for_review_API()
        //     setArticles(res.data)
        // }
        // get_articles_for_review()

        //2/
        setArticles([1,2])

    }, [])

    // data
  const columns = [
    {
      title: 'TITLE',
      dataIndex: 'title',
      width: 220
    },
    {
        title: 'CATEGORY',
        dataIndex: 'category',
      },
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: status => {
        if (status === ArticleStatus.ToBeReviewed) {
            return <Tag color="red">To be reviewed</Tag>;
        } else {
            return <Tag color="green">Done</Tag>;
        }
      }
    },
    {
      title: 'SUBMISSION DATE',
      dataIndex: 'submission_date'
    },
    {
      title: 'DUE DATE',
      dataIndex: 'due_date'
    },
    {
      title: 'ACTION',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} 
                onClick={()=>{navigate(`/reviewer/reviewpage?id=${data.id}`)}}/>
            {/* <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            /> */}
          </Space>
        )
      }
    }
  ]
  // data
  const data = [
    {   
        id: '1',
        title: 'AAA',
        category: 'C',
        status: 1,
        submission_date: '2019-03-11 09:00',
        due_date: '2019-03-11 09:00',
    },
    {
        id: '2',
        title: 'BBB',
        category: 'C',
        status: 2,
        submission_date: '2019-03-11 09:00',
        due_date: '2019-03-11 09:00',
    }
  ]

    return (
        <div>
        {/*        */}
        <Card title={`Articles for review`}>
          <Table rowKey="id" columns={columns} dataSource={data} />
        </Card>
      </div>
    )
}

export default ReviewAndScore
