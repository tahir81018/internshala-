import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const user = useSelector((state) => {
    return state.user.user;
  });
  return (
    <div className="flex justify-center">
      <div className=" bg-white shadow-md rounded p-6 m-6 w-1/3 space-y-2 divide-y-2">
        <div>
          <div className=" flex justify-center">
            <img
              src={user.picture}
              alt={user.firstName[0]}
              className=" h-32 w-32 rounded-full"
            />
          </div>
          <div className=" flex justify-center">
            <h3 className=" text-center text-lg font-semibold p-2">
              {user.firstName + " " + user.lastName}
            </h3>
          </div>
        </div>
        <div className=" space-y-3 pt-2">
          <div className=" flex justify-between">
            <p className=" text-lg font-bold">Email</p>
            <p>{user.email}</p>
          </div>
          <div className=" flex justify-between">
            <p className=" text-lg font-bold">Mobile</p>
            <p>{user.mobile}</p>
          </div>
          <div className=" flex justify-between">
            <p className=" text-lg font-bold">Subscription</p>
            <p>{user.subscription}</p>
          </div>
          <div className="flex justify-center mt-3">
            <Link
              to="/userapplication"
              class="relative  items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-blue-600 rounded-full hover:bg-white group"
            >
              <span class="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
              <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">
                View Applciations
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
