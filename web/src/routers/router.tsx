import { createBrowserRouter } from 'react-router-dom'
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFoundPage from "../components/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: '/auth/sign-in',
    element: <SignIn />,
  },
  {
    path: '/auth/sign-up',
    element: <SignUp />,
  },
  {
    path:'*',
    element: <NotFoundPage />,
  }
])


