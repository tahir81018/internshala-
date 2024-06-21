import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Componets/Footerr/Footer";
import Home from "./Componets/Home/Home";
import Navbar from "./Componets/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Register from "./Componets/auth/Register";
import Intern from "./Componets/Internships/Intern";
import JobAvl from "./Componets/Job/JobAvl";
import JobDetail from "./Componets/Job/JobDetail";
import InternDeatil from "./Componets/Internships/InternDeatil";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Profile from "./profile/Profile";
import AdminLogin from "./Admin/AdminLogin";
import Adminpanel from "./Admin/Adminpanel";
import ViewAllApplication from "./Admin/ViewAllApplication";
import Postinternships from "./Admin/Postinternships";
import DeatilApplication from "./Applications/DeatilApplication";
import UserApplicatiom from "./profile/UserApplicatiom";
import UserapplicationDetail from "./Applications/DeatilApplicationUser";
import axios from "axios";
import { useCookies } from "react-cookie";
import { setUser } from "./Feature/Userslice";
import { ToastContainer } from "react-toastify";
import Subscriptions from "./Componets/subscriptions/Subscriptions";
import Resume from "./Componets/resume/Resume";
import ResumeView from "./Componets/resume/ResumeView";
import Cookies from "universal-cookie";

function App() {
  // const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const dispatch = useDispatch();
  const cookies = new Cookies(null, { path: "/" });

  const user = useSelector((state) => {
    return state.user.user;
  });

  useEffect(() => {
    fetchAccess();
  }, []);

  const fetchAccess = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/auth/access`, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(setUser(res.data.user));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internship" element={<Intern />} />
        <Route path="/Jobs" element={<JobAvl />} />
        <Route path="/detailjob" element={<JobDetail />} />
        <Route path="/detailInternship" element={<InternDeatil />} />
        <Route path="/detailApplication" element={<DeatilApplication />} />
        <Route path="/applications" element={<ViewAllApplication />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route
          path="/UserapplicationDetail"
          element={<UserapplicationDetail />}
        />
        <Route path="/userapplication" element={<UserApplicatiom />} />

        {user !== undefined ? (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume" element={<Resume />}>
              {user.resume !== undefined && (
                <Route
                  path="/resume/view"
                  element={<ResumeView user={user} />}
                />
              )}
            </Route>
          </>
        ) : (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/adminpanel" element={<Adminpanel />} />
            <Route path="/postInternship" element={<Postinternships />} />
          </>
        )}
      </Routes>

      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
