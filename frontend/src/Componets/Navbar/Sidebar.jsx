import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar({ onClose, onLogin, onLogout }) {
  const showLogin = () => {
    onLogin();
    onClose();
  };

  const logout = () => {
    onLogout();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".sidebar") && !e.target.closest(".bi-list")) {
        onClose();
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const user = useSelector((state) => {
    return state.user.user;
  });
  return (
    <div className="fixed w-full h-full z-50 bg-gray-500 bg-opacity-75 top-0">
      <div className=" relative top-0 bg-white shadow-sm min-w-fit w-3/4 h-full p-6 sidebar">
        <div className=" flex justify-end">
          <h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-lg"
              viewBox="0 0 16 16"
              onClick={onClose}
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </h1>
        </div>
        <div className=" divide-y-2">
          {user !== undefined && (
            <div className=" flex justify-start space-x-2 p-1">
              <div className=" p-1">
                <img
                  src={user.picture}
                  alt={user.firstName[0]}
                  className=" h-10 w-10 rounded-full"
                />
              </div>
              <div>
                <h3 className=" font-medium">
                  {user.firstName + " " + user.lastName}
                </h3>
                <p className=" font-thin">{user.email}</p>
              </div>
            </div>
          )}
          <div className=" space-y-3 p-2">
            <p className=" text-left">
              <Link to="/internship">Internships</Link>
            </p>
            <p className=" text-left">
              <Link to="/Jobs">Jobs</Link>
            </p>
            <p className=" text-left">
              <Link>Contact Us</Link>
            </p>
          </div>
          {user !== undefined ? (
            <div className=" p-1 space-y-3">
              <p className=" text-left hover:text-sky-500">
                <Link to={"/"}>Home</Link>
              </p>
              <p className=" text-left hover:text-sky-500">
                <Link to='/applications'>My Applications</Link>
              </p>
              <p className=" text-left hover:text-sky-500">
                <Link>My Bookmarks</Link>
              </p>
              <p className=" text-left hover:text-sky-500">
                <Link to='/resume'>Edit Resume</Link>
              </p>
              <p className=" text-left hover:text-sky-500">
                <Link>Edit Preferences</Link>
              </p>
              <p className=" text-left hover:text-sky-500">
                <Link to={"/profile"}>Manage Account</Link>
              </p>
              <p className=" text-left hover:text-sky-500">
                <Link onClick={logout}>Logout</Link>
              </p>
            </div>
          ) : (
            <div className=" space-y-3 p-2">
              <p className=" text-left">
                <Link>Register As a Student</Link>
              </p>
              <p className=" text-left">
                <Link>Register As an Employer</Link>
              </p>
              <p className=" text-left" onClick={showLogin}>
                <Link>Login</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
