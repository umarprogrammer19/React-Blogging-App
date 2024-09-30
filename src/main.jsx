import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Layout from './Layout.jsx';
import SignUp from './pages/signUp.jsx';
import Login from './pages/login.jsx';
import Blogs from './pages/blogs.jsx';

const router = createBrowserRouter([{
  path: "/",
  element: <Layout />,
  children: [{
    path: "",
    element: <Blogs />
  }, {
    path: "/signup",
    element: <SignUp />
  }, {
    path: "/login",
    element: <Login />
  }]
}])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
  </RouterProvider>
)
