import { useEffect, useState } from "react";
// import { get_articles_for_review_API } from "../../../apis/user"

import { Table, Tag, Space } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { Card, Button } from 'antd'
import { Link, useNavigate } from "react-router-dom"
import { ArticleStatus } from "../../../utils/status"
import FormModal from "../FormModal"
import { article_List_API } from "../../../apis/article"
import { http } from "../../../utils"
import { formatDate } from "../../../utils/common"
import { getStateTag } from "../../../utils/status"


const AssignReviewer = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleData, setArticleData] = useState(null);
  //get all articles
  const [allarticles, setAllarticles] = useState([]);
  //get articles for review
  const [articles, setArticles] = useState([]);
  //get all reviewers
  const [reviewers, setReviewers] = useState([]);

  useEffect(() => {
    // async function get_articles_by_author(id) {
    //   // const res = await article_List_API(id);  // Assuming the API expects an object with an authorId property
    //   // console.log(res)
    //   // if (res && res.data) {
    //   //   const formattedArticles = res.data.map(article => ({
    //   //     ...article,
    //   //     submissionDate: formatDate(article.submissionDate)
    //   //   }));
    //   //   setArticles(formattedArticles);
    //   // }
    // }


    const fetchAllArticleData = async () => {
      try {
        const response = await http.get(`/Manuscripts/EditorSubmissions/${localStorage.getItem("id")}`);
        console.log(response.data)
        const res = response.data.filter(article => article.status === 'Submitted').map(article => ({

          ...article,
          id: article.submissionId,
          submissionDate: formatDate(article.submissionDate),
        }));

        setAllarticles(res);
      } catch (error) {
        console.error("Fetching article data failed", error);
      }
    }
    fetchAllArticleData()
  }, []);

  const fetchAllArticleData = async () => {
    try {
      const response = await http.get(`/Manuscripts/EditorSubmissions/${localStorage.getItem("id")}`);
      console.log(response.data)
      const res = response.data.filter(article => article.status === 'Submitted').map(article => ({
        ...article,
        id: article.submissionId,
        submissionDate: formatDate(article.submissionDate)
      }));

      setAllarticles(res)
    } catch (error) {
      console.error('Fetching article data failed', error);
    }
  }

  const showModal = async (submission_id) => {

    try {
      // console.log(submission_id)
      // const data = await fetchArticleData(article_id);
      const reviewers = await fetchAllReviewers(localStorage.getItem("id"), submission_id);
      setReviewers(reviewers)

      const res = await fetArticleDataBySubmissionID(submission_id)



      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching article data:', error);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    fetchAllArticleData()
  }




  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchAllReviewers = async (user_id, article_id) => {
    try {
      // const response = await http.get(`/User/reviewersinfo/${articleId}`);
      const response = await http.get(`/User/reviewersinfo`);
      return response.data;
    } catch (error) {
      console.error("Fetching reviewer data failed", error);
      return null;
    }
  };

  const fetArticleDataBySubmissionID = async (submission_id) => {
    try {
      const response = await http.get(
        `/Manuscripts/submissionabstract/${submission_id}`
      );
      // console.log(response.data)
      const modifiedData = { ...response.data, submission_id: submission_id };
      setArticleData(modifiedData);
    } catch (error) {
      console.error("Fetching reviewer data failed", error);
      return null;
    }
  };

  // const fetchArticleData = async (articleId) => {
  //     try {
  //       const response = await http.get(`/api/articles/${articleId}`);
  //       return response.data;
  //     } catch (error) {
  //       console.error('Fetching article data failed', error);
  //     }
  //   };

  // data
  const columns = [
    {
      title: "TITLE",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: status => getStateTag(status)
    },
    {
      title: "SUBMISSION DATE",
      dataIndex: "submissionDate",
    },
    {
      title: "Assign",
      render: (data) => {
        return (
          <Space size="middle">
            {/* 
                // old version
                <Button type="primary" shape="circle" icon={<EditOutlined />} 
                onClick={()=>{navigate(`/editor/assignreviewerdetail/${data.id}`)}}/> 
            */}

            <Button type="primary" onClick={() => showModal(data.id)}>
              Assign Reviewer
            </Button>

            {/* <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            /> */}
          </Space>
        );
      },
    },
  ];


  return (
    <div>
      {/*        */}
      <Link to="/editor/editorarticle/1">About</Link>

      <Card title={`Assign reviewers to articles`}>
        <Table rowKey="id" columns={columns} dataSource={allarticles} />
      </Card>
      <FormModal
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        articleData={articleData}
        reviewers={reviewers}
      // selectedReviewers={[]}
      />

    </div>


  )
}


//       <Card title={`Assign reviewers to articles`}>
//         <Table rowKey="id" columns={columns} dataSource={allarticles} />
//       </Card>
//       <FormModal
//         open={isModalOpen}
//         onCancel={handleCancel}
//         onOk={handleOk}
//         articleData={articleData}
//         reviewers={reviewers}
//         // selectedReviewers={[]}
//       />
//     </div>
//   );
// };
export default AssignReviewer;
