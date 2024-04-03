import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom'
import AdminHome from "./components/adminUpload/adminUpload.jsx";
import VideoLoop from "./components/videoComponent/videoComponent";
import AdminLogin from "./components/adminLogin/adminLogin";
import AdminVedioList from "./components/adminVedioList/adminVedioList.jsx";
// import AdminSettings from "./components/adminSettings/adminSettings.jsx";
import Notice from './components/adminNotice/adminNotice.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
       <Route path="/" element={<VideoLoop/>} />
        <Route path='/adminLogin' element={<AdminLogin/>}/>
        <Route path="/image-Upload" element={<AdminHome/>}/>
        <Route  path="/admin-list" element={<AdminVedioList/>} />
        <Route path='/notice' element={<Notice/>} />
        

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
