import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import ApplyJob from "./pages/ApplyJob"
import Applications from "./pages/Applications"
import RecruiterLogin from "./components/RecruiterLogin"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"
import Dashboard from "./pages/Dashboard"
import AddJob from "./pages/AddJob"
import ViewApplications from "./pages/ViewApplications"
import ManageJobs from "./pages/ManageJobs"
import 'quill/dist/quill.snow.css'

import {ToastContainer} from 'react-toastify';
import ResetPass from "./pages/resetPass"
function App() {

  const { showRecruiterLogin,companyToken } = useContext(AppContext);

  return (
    <>
      {showRecruiterLogin && <RecruiterLogin />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/reset-pass" element={<ResetPass />} />
        <Route path="/dashboard" element={<Dashboard />}>
        
          {companyToken ?
          <>
          <Route path="add-job" element={<AddJob />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          </>:(null)}
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
