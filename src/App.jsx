import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ErrorPage from "./pages/ErrorPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import "./App.css";
import "./queries.css";
import SignUp from "./pages/SignUp/SignUp";
import Registration from "./pages/Registration/Registration";
import Profile from "./pages/Dashboard/components/Profile";
import Verification from "./pages/Verification/Verification.jsx";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword.jsx";
import NewPassword from "./pages/ForgetPassword/pages/NewPassword.jsx";
import useAuthStore from "./store/authentication/authStore";

import MainViewTest from "./pages/Dashboard/components/MainViewTest";
import FormRender from "./pages/Dashboard/view/applicationForm/FormRender";
import ApplicationForm from "./pages/Dashboard/view/applicationForm/ApplicationForm";
import Requirements from "./pages/Dashboard/view/Requirements";
import Payment from "./pages/Dashboard/view/Payment";
import AssessmentSchedule from "./pages/Dashboard/view/AssessmentSchedule";


function App() {

  const { initializeSession } = useAuthStore();

  useEffect(() => {
    console.log("INITIALIZING SESSION IN APP");
    initializeSession();
  }, []);

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forget/change-pass" element={<NewPassword />} />
                
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/register">
          <Route
            path="learner"
            element={<Registration typeRegister={"learner"} />}
          />
          <Route
            path="parent"
            element={<Registration typeRegister={"parent"} />}
          />
          <Route
            path="guardian"
            element={<Registration typeRegister={"guardian"} />}
          />
        </Route>


        <Route path="/dashboard" element={<Dashboard />} >
          <Route index element={<MainViewTest />}/>
          <Route path="application-form" element={<ApplicationForm />} />
          <Route path="application-form/forms" element={<FormRender />} />
          <Route path="application-requirement" element={<Requirements />} />
          <Route path="application-payment" element={<Payment />} />
          <Route path="assessment-schedule" element={<AssessmentSchedule />} />
        </Route>



        <Route path="/profile" element={<Profile />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/forget" element={<ForgetPassword />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
