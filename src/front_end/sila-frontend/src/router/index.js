
import { AuthRoute, AuthRouteForLoginPage } from "../components/AuthRoute"
import { createBrowserRouter } from "react-router-dom"

import Register from "../pages/Register"
import Login from "../pages/Login"

import Home from "../pages/Author/Home"
import Layout from "../pages/Author/Layout"
import Submitted from "../pages/Author/Submitted"
import StartNewSubmission from "../pages/StartNewSubmission"
import ArticleDetail from "../pages/Author/ArticleDetail"

import LayoutReviewer from "../pages/Reviewer/Layout"
import ReviewAndScore from "../pages/Reviewer/ReviewAndScore"
import History from "../pages/Reviewer/History"
import { RoleBasedRoute } from "../components/RoleBasedRoute"
import ReviewPage from "../pages/Reviewer/ReviewPage"

const router = createBrowserRouter([

    {path: '/login', element: <AuthRouteForLoginPage> <Login /> </AuthRouteForLoginPage>},

    {path: '/register', element: <AuthRouteForLoginPage> <Register /> </AuthRouteForLoginPage>},


    {
        path: '/', 
        element: <AuthRoute> 
                    <RoleBasedRoute allowedRoles={['Author']}>
                        <Layout /> 
                    </RoleBasedRoute>
                </AuthRoute>,
        children: [
            { element: <Home />, index: true},
            {path:"submitted", element: <Submitted />},
            {path:"startnewsubmission", element: <StartNewSubmission />},
            {path:"articledetail/:id", element: <ArticleDetail />},
        ]
    },

    {
        path: '/reviewer', 
        element: <AuthRoute>
                    <RoleBasedRoute allowedRoles={['Reviewer']}> 
                        <LayoutReviewer /> 
                    </RoleBasedRoute>
                </AuthRoute>,
        children: [
            {index: true, element: <ReviewAndScore />},
            {path:"history", element: <History />},
            {path:"reviewpage", element: <ReviewPage />}
        ]
    }

])

export default router

