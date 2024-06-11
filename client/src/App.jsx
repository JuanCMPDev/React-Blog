import {
  RouterProvider,
  Outlet,
  createHashRouter
} from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import Write from "./pages/Write"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Single from "./pages/Single"
import "./style.scss"


const Layout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

const router = createHashRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/post/:id",
        element: <Single/>
      },
      {
        path: "/write",
        element: <Write/>
      }
    ]
  },
  {
    path: "/register",
    element: <Auth/>
  },
  {
    path: "/login",
    element: <Auth/>
  }
]);

function App() {

  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}/>
      </div>      
    </div>
  );
}

export default App;
