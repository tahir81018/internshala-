import React, { useState } from "react";
import "./register.css";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

function Register() {
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    password: "",
  });
  let navigate = useNavigate();

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    axios
      .post(`https://internshala-seven.vercel.app/api/auth/google-login`, decoded, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        toast("Login Failed");
      });
  };

  const handleSignup = (event) => {
    event.preventDefault();
    axios
      .post(`${process.env.SERVER_BASE_URL}/api/auth/register`, signupData, {
        withCredentials: true,
      })
      .then((res) => {
        toast(res.data.message);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          toast(err.response.data.message);
          return;
        }
        toast("Login Failed");
      });
  };

  return (
    <div>
      <div className="form">
        <h1>Sing-up and Apply For Free</h1>
        <p className="para3">1,50,000+ companies hiring on Internshala</p>
        <div className="regi">
          <div className="py-6">
            <form onSubmit={handleSignup}>
              <div className="flex bg-white rounded-lg justify-center shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div className="w-full p-8 lg:w-1/2">
                  <div className="flex justify-center">
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
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 lg:w1/4"></span>
                    <a
                      href="/"
                      className="text-xs text-center text-gray-500 uppercase"
                    >
                      or
                    </a>
                    <span className="border-b w-1/5 lg:w1/4"></span>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="mobile-input"
                      className="border-b text-gray-700 text-sm font-bold mb-2"
                    >
                      Mobile
                    </label>
                    <input
                      type="number"
                      required
                      onChange={(e) => {
                        setSignupData({
                          ...signupData,
                          mobile: e.target.value,
                        });
                      }}
                      className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none hide-arrow"
                      id="mobile-input"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="password"
                      className="border-b text-gray-700 text-sm font-bold mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      onChange={(e) => {
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        });
                      }}
                      className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                      id="password"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <label
                        htmlFor="Fname"
                        className="border-b text-gray-700 text-sm font-bold mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        id="Fname"
                        onChange={(e) => {
                          setSignupData({
                            ...signupData,
                            firstName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="ml-5">
                      <label
                        htmlFor="Lname"
                        className="border-b text-gray-700 text-sm font-bold mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        id="Lname"
                        onChange={(e) => {
                          setSignupData({
                            ...signupData,
                            lastName: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <small>
                    By signing up, you agree to our{" "}
                    <span className="text-blue-400">Term and Conditions.</span>
                  </small>
                  <button
                    type="submit"
                    className="bg-blue-500 h-9 text-white font-bold py-2 mt-4 px-4 w-full rounded hover:bg-blue-600"
                  >
                    Sing Up{" "}
                  </button>
                  Already registered?{" "}
                  <span className="text-blue-400 cursor-pointer">Login</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
