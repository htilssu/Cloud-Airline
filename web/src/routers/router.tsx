import { createBrowserRouter } from 'react-router-dom'
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFoundPage from "../components/NotFoundPage";
import HomePage from "@/pages/HomePage";

// Tạo các placeholder components cho các trang mới
const FlightsPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Trang Chuyến Bay</h1>
      <p className="text-gray-600">Trang này đang được phát triển</p>
      <button 
        onClick={() => window.history.back()} 
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Quay lại
      </button>
    </div>
  </div>
)

const PromotionsPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Trang Khuyến Mãi</h1>
      <p className="text-gray-600">Trang này đang được phát triển</p>
      <button 
        onClick={() => window.history.back()} 
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Quay lại
      </button>
    </div>
  </div>
)

const ContactPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Trang Liên Hệ</h1>
      <p className="text-gray-600">Trang này đang được phát triển</p>
      <button 
        onClick={() => window.history.back()} 
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Quay lại
      </button>
    </div>
  </div>
)

export const router = createBrowserRouter([
  {
    path:'/',
    element:<HomePage/>
  },
  {
    path: '/flights',
    element: <FlightsPage />
  },
  {
    path: '/promotions',
    element: <PromotionsPage />
  },
  {
    path: '/contact',
    element: <ContactPage />
  },
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
  },
])


