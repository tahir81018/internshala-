import React, { useState } from "react";
import logo from "../../Assets/logo.png";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../Feature/Userslice";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [isDivVisibleForintern, setDivVisibleForintern] = useState(false);
  const [isDivVisibleForJob, setDivVisibleFroJob] = useState(false);
  const [isDivVisibleForlogin, setDivVisibleFrologin] = useState(false);
  const [isDivVisibleForProfile, setDivVisibleProfile] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isStudent, setStudent] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.user.user;
  });

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    axios
      .post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/auth/google-login`,
        decoded,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        closeLogin();
        window.location.href = "/";
      })
      .catch((err) => {
        console.error(err);
        toast("Login Failed");
      });
  };

  const handleStudentLogin = (event) => {
    event.preventDefault();
    //handle student login here
    axios
      .post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/auth/mobile-login`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        closeLogin();
        toast("Login Success");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          toast(err.response.data.message);
          return;
        }
        toast("Unable to login");
      });
  };

  const handleEmployeeLogin = (event) => {
    event.preventDefault();
    //handle employee login here
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const showLogin = () => {
    setDivVisibleFrologin(true);
  };
  const closeLogin = () => {
    setDivVisibleFrologin(false);
  };
  const setTrueForStudent = () => {
    setStudent(true);
  };
  const setFalseForStudent = () => {
    setStudent(false);
  };
  //  for showing profile dropdown
  const showtheProfile = () => {
    setDivVisibleProfile(true);
    document.getElementById("ic-profile").className = "bi bi-caret-up-fill";
  };
  const hidetheProfile = () => {
    document.getElementById("ic-profile").className = "bi bi-caret-down-fill";
    setDivVisibleProfile(false);
  };

  const showInternShips = () => {
    document.getElementById("ic-interns").className = "bi bi-caret-up-fill";
    setDivVisibleForintern(true);
  };
  const hideInternShips = () => {
    document.getElementById("ic-interns").className = "bi bi-caret-down-fill";
    setDivVisibleForintern(false);
  };
  const showJobs = () => {
    document.getElementById("ic-jobs").className = "bi bi-caret-up-fill";
    setDivVisibleFroJob(true);
  };
  const hideJobs = () => {
    document.getElementById("ic-jobs").className = "bi bi-caret-down-fill";
    setDivVisibleFroJob(false);
  };

  const logoutFunction = () => {
    setDivVisibleProfile(false);
    dispatch(removeUser());
    googleLogout();
    removeCookie("access_token");
    navigate("/");
  };

  return (
    <div>
      <nav className=" bg-white shadow-md flex flex-wrap justify-between md:justify-between content-center">
        <div className=" flex justify-start">
          <div className=" content-center md:hidden">
            <h1 className=" p-3">
              <i class="bi bi-list" onClick={openSidebar}></i>
            </h1>
          </div>
          <div className=" w-36 p-2">
            <Link to={"/"}>
              <img src={logo} alt="logo" />
            </Link>
          </div>
        </div>
        {user === undefined && (
          <div className=" md:hidden content-center p-2">
            <Link to={"/register"}>
              <button className=" bg-blue-500 rounded-md px-2 py-1 text-white">
                Register
              </button>
            </Link>
          </div>
        )}
        <div className=" hidden md:flex justify-between content-center w-3/4">
          <div className=" content-center">
            <p onMouseEnter={showInternShips}>
              Internships{" "}
              <span>
                <i
                  id="ic-interns"
                  className="bi bi-caret-down-fill"
                  onClick={hideInternShips}
                ></i>
              </span>
            </p>
          </div>
          <div className=" content-center">
            <p onMouseEnter={showJobs}>
              Jobs{" "}
              <span>
                <i
                  id="ic-jobs"
                  className="bi bi-caret-down-fill"
                  onClick={hideJobs}
                ></i>
              </span>
            </p>
          </div>
          <div className=" content-center space-x-1">
            <i class="bi bi-search"></i>
            <input
              className=" appearance-none focus:outline-none border-b border-slate-500"
              type="search"
              placeholder="Search"
            />
          </div>
          {user !== undefined ? (
            <div className="flex content-center p-2 items-center">
              <div
                className=" h-fit p-0.5 rounded-full border-2 border-blue-500"
                onMouseEnter={showtheProfile}
              >
                <img
                  src={user.picture}
                  alt={user.firstName[0]}
                  className=" rounded-full w-10 h-10"
                />
              </div>
              <i
                id="ic-profile"
                className="bi bi-caret-down-fill"
                onClick={hidetheProfile}
              ></i>
            </div>
          ) : (
            <div className=" content-center p-2 space-x-2">
              <Link>
                <button
                  type="button"
                  onClick={showLogin}
                  className=" bg-blue-500 rounded px-2 py-1 text-white hover:bg-slate-100 hover:text-slate-800 hover:outline outline-2 outline-blue-500"
                >
                  Login
                </button>
              </Link>
              <Link to={"/register"}>
                <button
                  type="button"
                  className=" bg-blue-500 rounded px-2 py-1 text-white hover:bg-slate-100 hover:text-slate-800 hover:outline outline-2 outline-blue-500"
                >
                  Signup
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {isSidebarOpen && (
        <Sidebar
          onClose={closeSidebar}
          onLogin={showLogin}
          onLogout={logoutFunction}
        />
      )}

      {isDivVisibleForintern && (
        <div
          onMouseLeave={hideInternShips}
          className=" bg-white shadow-md w-fit absolute top-18 left-1/4 z-10 p-3 flex divide-x-2"
        >
          <div className="space-y-1 flex-1">
            <p>Top Locations</p>
            <p>Profile</p>
            <p>Top Categories</p>
            <p>Explore More Internships</p>
          </div>
          <div className=" space-y-1 flex-1">
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
          </div>
        </div>
      )}

      {isDivVisibleForJob && (
        <div
          onMouseLeave={hideJobs}
          className=" bg-white shadow-md w-fit absolute top-18 left-2/4 z-10 p-3 flex divide-x-2"
        >
          <div className="space-y-1 flex-1">
            <p>Top Locations</p>
            <p>Profile</p>
            <p>Top Categories</p>
            <p>Explore More Jobs</p>
          </div>
          <div className=" space-y-1 flex-1">
            <p>Job at India</p>
            <p>Job at India</p>
            <p>Job at India</p>
            <p>Job at India</p>
          </div>
        </div>
      )}
      {isDivVisibleForProfile && user !== undefined && (
        <div
          className=" p-3 shadow-md bg-white absolute top-18 right-0 z-10 w-1/4 divide-y-2"
          onMouseLeave={hidetheProfile}
        >
          <div className=" p-2">
            <p className=" font-medium text-left text-slate-800">
              {user.firstName + " " + user.lastName}{" "}
              <span
                className={`bg-${user.subscription.plan} text-sm font-medium text-white px-1 py-0.5`}
              >
                <Link to={"/subscriptions"}>[ {user.subscription.plan} ]</Link>
              </span>
            </p>
            <p className=" text-sm text-left text-slate-600">{user.email}</p>
          </div>
          <div className=" p-1 space-y-3">
            <p className=" text-left hover:text-sky-500">
              <Link to={"/"}>Home</Link>
            </p>
            <p className=" text-left hover:text-sky-500">
              <Link>My Applications</Link>
            </p>
            <p className=" text-left hover:text-sky-500">
              <Link>My Bookmarks</Link>
            </p>
            <p className=" text-left hover:text-sky-500">
              <Link to={"/resume"}>Edit Resume</Link>
            </p>
            <p className=" text-left hover:text-sky-500">
              <Link>Edit Preferences</Link>
            </p>
            <p className=" text-left hover:text-sky-500">
              <Link to={"/profile"}>Manage Account</Link>
            </p>
            <p className=" text-left hover:text-sky-500">
              <Link onClick={logoutFunction}>Logout</Link>
            </p>
          </div>
        </div>
      )}
      {isDivVisibleForlogin && (
        <div className=" fixed top-0 h-screen  bg-gray-500 bg-opacity-75 w-full z-50 flex justify-center">
          <div className=" w-11/12 md:w-1/3 bg-white rounded shadow-md relative top-20 h-fit p-6">
            <div className=" flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
                onClick={closeLogin}
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </div>
            <div className=" flex justify-around">
              <h2
                className={`text-lg cursor-pointer ${
                  isStudent && " text-blue-500 underline underline-offset-8"
                }`}
                onClick={setTrueForStudent}
              >
                Student
              </h2>
              <h2
                className={`text-lg cursor-pointer ${
                  !isStudent && " text-blue-500 underline underline-offset-8"
                }`}
                onClick={setFalseForStudent}
              >
                Employer / T&P
              </h2>
            </div>
            {isStudent ? (
              <form onSubmit={handleStudentLogin}>
                <div className=" space-y-3 mt-6">
                  <div className=" flex justify-center">
                    <GoogleLogin
                      theme="filled_blue"
                      text="continue_with"
                      onSuccess={handleGoogleLogin}
                      onError={(err) => {
                        console.error(err);
                        toast("Login Failed");
                      }}
                    />
                  </div>
                  <div className=" flex justify-between">
                    <span className=" w-1/3 border-b-2"></span>
                    <span className=" text-slate-600">OR</span>
                    <span className=" w-1/3 border-b-2"></span>
                  </div>
                  <div className=" space-y-1">
                    <label htmlFor="mobile-input" className=" text-slate-800">
                      Mobile
                    </label>
                    <input
                      id="mobile-input"
                      type="number"
                      placeholder="9876543210"
                      required
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          mobile: event.target.value,
                        });
                      }}
                      className=" w-full p-2 appearance-none outline outline-slate-200 focus:outline-blue-400 rounded-sm hide-arrow"
                    />
                  </div>
                  <div className=" space-y-1">
                    <label htmlFor="password-input" className=" text-slate-800">
                      Password
                    </label>
                    <input
                      id="password-input"
                      type="password"
                      placeholder="********"
                      required
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          password: event.target.value,
                        });
                      }}
                      className=" w-full p-2 appearance-none outline outline-slate-200 focus:outline-blue-400 rounded-sm"
                    />
                    <p className=" text-blue-500 cursor-pointer p-1 text-right">
                      Forgot Password?
                    </p>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className=" w-full bg-blue-500 text-white px-2 py-1 rounded-sm"
                    >
                      Login
                    </button>
                  </div>
                  <div>
                    <p>
                      New to Internshala? Register (
                      <span className=" text-blue-500 cursor-pointer">
                        Student
                      </span>{" "}
                      /{" "}
                      <span className=" text-blue-500 cursor-pointer">
                        Company
                      </span>
                      )
                    </p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEmployeeLogin}>
                <div className=" space-y-3 mt-6">
                  <div className=" space-y-1">
                    <label htmlFor="mobile-input" className=" text-slate-800">
                      Mobile
                    </label>
                    <input
                      id="mobile-input"
                      type="number"
                      placeholder="9876543210"
                      required
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          mobile: event.target.value,
                        });
                      }}
                      className=" w-full p-2 appearance-none outline outline-slate-200 focus:outline-blue-400 rounded-sm hide-arrow"
                    />
                  </div>
                  <div className=" space-y-1">
                    <label htmlFor="password-input" className=" text-slate-800">
                      Password
                    </label>
                    <input
                      id="password-input"
                      type="password"
                      placeholder="********"
                      required
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          password: event.target.value,
                        });
                      }}
                      className=" w-full p-2 appearance-none outline outline-slate-200 focus:outline-blue-400 rounded-sm"
                    />
                    <p className=" text-blue-500 cursor-pointer p-1 text-right">
                      Forgot Password?
                    </p>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className=" w-full bg-blue-500 text-white px-2 py-1 rounded-sm"
                    >
                      Login
                    </button>
                  </div>
                  <div>
                    <p>
                      New to Internshala? Register (
                      <span className=" text-blue-500 cursor-pointer">
                        Student
                      </span>{" "}
                      /{" "}
                      <span className=" text-blue-500 cursor-pointer">
                        Company
                      </span>
                      )
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
