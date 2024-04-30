
import { useEffect, useState } from "react"
// import { get_articles_for_review_API } from "../../../apis/user"
import { Table, Tag, Space } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { Card, Button } from 'antd'
import { useNavigate } from "react-router-dom"
import { ArticleStatus } from "../../../utils/status"
import FormModal from "../FormModal"
import { article_List_API } from "../../../apis/article"

const AssignReviewer = ()=>{
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articleData, setArticleData] = useState(null);
    //get articles for review
    const [articles, setArticles] = useState([])

    useEffect(() => {
      async function get_articles_by_author(id) {
        const res = await article_List_API(id);  // Assuming the API expects an object with an authorId property
        console.log(res)
        // if (res && res.data) {
        //   const formattedArticles = res.data.map(article => ({
        //     ...article,
        //     submissionDate: formatDate(article.submissionDate)
        //   }));
        //   setArticles(formattedArticles);
        // }
      }
  
      get_articles_by_author(localStorage.getItem('id'));
    }, []);

    const showModal = async (article_id) => {
        
        try {
            console.log(article_id)
            // const data = await fetchArticleData(article_id);
            setArticleData({"title":"article1","content":"content1"}); 
            setIsModalOpen(true); 
          } catch (error) {
            console.error('Error fetching article data:', error);
          }
    };
    const handleOk = () => {
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    const fetchArticleData = async (articleId) => {
        // try {
        //   const response = await axios.get(`/api/articles/${articleId}`);
        //   return response.data; 
        // } catch (error) {
        //   console.error('Fetching article data failed', error);
        // }
      };

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
      title: 'Assign',
      render: data => {
        return (
          <Space size="middle">
            {/* 
                // old version
                <Button type="primary" shape="circle" icon={<EditOutlined />} 
                onClick={()=>{navigate(`/editor/assignreviewerdetail/${data.id}`)}}/> 
            */}
            
            <Button type="primary" onClick={()=>showModal(data.id)}>
                Assign Reviewer
            </Button>

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
        submission_date: '2019-03-11 09:00'
    },
    {
        id: '2',
        title: 'BBB',
        category: 'C',
        status: 2,
        submission_date: '2019-03-11 09:00'
    }
  ]

    return (
        <div>
        {/*        */}
        <Card title={`Assign reviewers to articles`}>
          <Table rowKey="id" columns={columns} dataSource={data} />
        </Card>
        <FormModal
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            articleData={articleData}
        />
      </div>
    )
}

export default AssignReviewer
