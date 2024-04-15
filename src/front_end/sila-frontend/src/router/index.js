
import Layout from "../pages/Layout"
import Login from "../pages/Login"

import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([

    {path: '/login', element: <Login />},
    {path: '/', element: <Layout />}

])

export default router

