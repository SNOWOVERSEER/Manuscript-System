import { AuthRoute, AuthRouteForLoginPage } from "../components/AuthRoute";
import { createBrowserRouter } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Restpassword from "../pages/Register/resetpassword";
// Author
import Home from "../pages/Author/Home";
import Layout from "../pages/Author/Layout";
import Submitted from "../pages/Author/Profile";
import StartNewSubmission from "../pages/Author/StartNewSubmission";
import ArticleDetail from "../pages/Author/ArticleDetail";
// Reviewer
import LayoutReviewer from "../pages/Reviewer/Layout";
import ReviewAndScore from "../pages/Reviewer/ReviewAndScore";
import History from "../pages/Reviewer/History";
import { RoleBasedRoute } from "../components/RoleBasedRoute";
import ReviewPage from "../pages/Reviewer/ReviewPage";
// Editor
import LayoutEditor from "../pages/Editor/Layout";
import AssignReviewer from "../pages/Editor/AssignReviewer";
import AddReviewer from "../pages/Editor/AddReviewer";
import EditorArticle from "../pages/Editor/EditorArticle";
import AssignedArticlesList from "../pages/Editor/AssignedArticlesList";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthRouteForLoginPage>
        {" "}
        <Login />{" "}
      </AuthRouteForLoginPage>
    ),
  },

  {
    path: "/register",
    element: (
      <AuthRouteForLoginPage>
        {" "}
        <Register />{" "}
      </AuthRouteForLoginPage>
    ),
  },

  {
    path: "/resetpassword",
    element: (
      // <AuthRouteForLoginPage>
        
        <Restpassword />
      // </AuthRouteForLoginPage>
    ),
  },

  {
    path: "/",
    element: (
      <AuthRoute>
        <RoleBasedRoute allowedRoles={["Author"]}>
          <Layout />
        </RoleBasedRoute>
      </AuthRoute>
    ),
    children: [
      { element: <Home />, index: true },
      { path: "submitted", element: <Submitted /> },
      { path: "startnewsubmission", element: <StartNewSubmission /> },
      { path: "articledetail/:id", element: <ArticleDetail /> },
    ],
  },

  {
    path: "/reviewer",
    element: (
      <AuthRoute>
        <RoleBasedRoute allowedRoles={["Reviewer"]}>
          <LayoutReviewer />
        </RoleBasedRoute>
      </AuthRoute>
    ),
    children: [
      { index: true, element: <ReviewAndScore /> },
      { path: "history", element: <History /> },
      { path: "reviewpage", element: <ReviewPage /> },
    ],
  },

  {
    path: "/editor",
    element: (
      <AuthRoute>
        <RoleBasedRoute allowedRoles={["Editor"]}>
          <LayoutEditor />
        </RoleBasedRoute>
      </AuthRoute>
    ),
    children: [
      { index: true, element: <AssignReviewer /> },
      // {path:"assignreviewerdetail/:id", element: <AssignReviewerDetail />},

      { path: "assignedarticleslist", element: <AssignedArticlesList /> },
      { path: "addreviewer", element: <AddReviewer /> },
      { path: "editorarticle/:submissionID", element: <EditorArticle /> },
    ],
  },
]);

export default router;
