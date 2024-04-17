
import { AuthRoute, AuthRouteForLoginPage } from "../components/AuthRoute"
import { createBrowserRouter } from "react-router-dom"

import Home from "../pages/Home"
import Layout from "../pages/Layout"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Submitted from "../pages/Submitted"
import StartNewSubmission from "../pages/StartNewSubmission"

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

