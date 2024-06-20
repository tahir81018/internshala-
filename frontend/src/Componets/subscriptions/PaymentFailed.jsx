import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-center">
      <div>
        <div className="bg-white rounded-lg shadow-md m-10 p-6 flex justify-center">
          <div className=" w-fit space-y-2">
            <h3 className=" text-center text-2xl font-semibold">$4000</h3>
            <p className=" text-lg font-medium italic">Payment Failed!</p>
            <p className=" text-sm font-light">
              Hey, seems like there was some trouble. <br /> We are there with
              you.Just hold back
            </p>
            <p className=" text-sm">Payment ID: </p>
            <div className=" flex justify-center">
              <button
                onClick={() => {
                  navigate("/");
                }}
                className=" px-3 py-1 mt-6 bg-green-700 text-white rounded"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
