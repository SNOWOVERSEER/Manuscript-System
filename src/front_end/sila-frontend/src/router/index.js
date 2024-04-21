
import { AuthRoute, AuthRouteForLoginPage } from "../components/AuthRoute"
import { createBrowserRouter } from "react-router-dom"

import Home from "../pages/Home"
import Layout from "../pages/Layout"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Submitted from "../pages/Submitted"
import StartNewSubmission from "../pages/StartNewSubmission"
import ArticleDetail from "../pages/ArticleDetail"

const router = createBrowserRouter([

    {path: '/login', element: <AuthRouteForLoginPage> <Login /> </AuthRouteForLoginPage>},

    {path: '/register', element: <AuthRouteForLoginPage> <Register /> </AuthRouteForLoginPage>},


    {
        path: '/', 
        element: <AuthRoute> <Layout /> </AuthRoute>,
        children: [
            { element: <Home />, index: true},
            {path:"submitted", element: <Submitted />},
            {path:"startnewsubmission", element: <StartNewSubmission />},
            {path:"articledetail/:id", element: <ArticleDetail />},
        ]
    }

])

export default router

