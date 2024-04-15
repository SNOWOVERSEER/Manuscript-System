
import { AuthRoute, AuthRouteForLoginPage } from "../components/AuthRoute"
import Layout from "../pages/Layout"
import Login from "../pages/Login"
import Register from "../pages/Register"

import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([

    {path: '/login', element: <AuthRouteForLoginPage> <Login /> </AuthRouteForLoginPage>},

    {path: '/register', element: <AuthRouteForLoginPage> <Register /> </AuthRouteForLoginPage>},

    {path: '/', element: <AuthRoute> <Layout /> </AuthRoute>}

])

export default router

