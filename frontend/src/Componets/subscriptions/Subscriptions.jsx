import React, { useEffect, useState } from "react";
import "./subscriptions.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "",
    discount: 0,
  });
  const [paymentDetails, setPaymentDetails] = useState({
    orderId: null,
    currency: null,
    amount: null,
  });
  const user = useSelector((state) => {
    return state.user.user;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const newCoupons = [];
    for (let i = 0; i < 5; i++) {
      let code = "";
      for (let i = 0; i < 8; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
      }
      const discount = Math.floor(Math.random() * 10);
      newCoupons.push({ code, discount });
      setCoupons(newCoupons);
    }
  }, []);

  const makePayment = async (amount, currency, orderId) => {
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: amount,
      currency: currency,
      name: "Internshala",
      description: "Test Transaction",
      image: "http://localhost:3000/static/media/logo.90a444595bae5c4e157c.png",
      order_id: orderId,
      // callback_url: `${REACT_APP_SERVER_BASE_URL}/api/subscription/varification`,
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.mobile,
      },
      handler: function (response) {
        axios
          .post(
            `${process.env.REACT_APP_SERVER_BASE_URL}/api/subscription/varification`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          )
          .then((res) => {
            toast(res.data.message);
            navigate(0);
          })
          .catch((err) => {
            console.log(err);
            toast("Could not varify your payment");
          });
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", (response) => {
      toast(response.error.reason);
    });
    rzp1.open();
  };

  const handleOrder = (amount, currency, plan) => {
    const date = new Date();
    if (date.getHours() !== 10) {
      toast("Our payment system is avalable between 10am-11am");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/subscription/check-out`, {
        amount: amount,
        currency: currency,
        plan: plan,
      })
      .then(async (res) => {
        setPaymentDetails(res.data.paymentDetails);
        const { amount, currency, orderId } = res.data.paymentDetails;
        await makePayment(amount, currency, orderId);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className=" flex justify-center">
      <div className="w-2/3">
        <div className=" bg-gray-300 rounded shadow-md  m-6 p-6 flex justify-around">
          <div className=" w-1/3 mx-3 hover:scale-105 transition-all">
            <div className="flex justify-center">
              <h2 className=" text-white text-center text-xl font-bold py-1 px-2 w-fit bg-bronze rounded-lg -mb-4">
                Bronze
              </h2>
            </div>
            <div className=" bg-white shadow-md px-4 py-10 rounded-3xl w-full">
              <div className=" divide-y-2">
                <div className=" p-2">
                  <h2 className=" text-center text-lg font-bold">₹100</h2>
                  <p className=" text-center font-medium text-slate-500">
                    monthly
                  </p>
                </div>
                <div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <i class="bi bi-check2"></i>
                    </h2>
                    <p className=" content-center">3 Internships</p>
                  </div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-x-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                      </svg>
                    </h2>
                    <p className=" content-center">5 Internships</p>
                  </div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-x-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                      </svg>
                    </h2>
                    <p className=" content-center">Unlimited Internships</p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex justify-center">
              <button
                onClick={() => {
                  handleOrder(
                    100 - (100 * appliedCoupon.discount) / 100,
                    "INR",
                    "bronze"
                  );
                }}
                className=" bg-blue-500 text-white rounded-full px-6 py-1.5 -mt-4"
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className=" w-1/3 mx-3 hover:scale-105 transition-all">
            <div className="flex justify-center">
              <h2 className=" text-white text-center text-xl font-bold py-1 px-2 w-fit bg-silver rounded-lg -mb-4">
                Silver
              </h2>
            </div>
            <div className=" bg-white shadow-md px-4 py-10 rounded-3xl w-full">
              <div className=" divide-y-2">
                <div className=" p-2">
                  <h2 className=" text-center text-lg font-bold">₹300</h2>
                  <p className=" text-center font-medium text-slate-500">
                    monthly
                  </p>
                </div>
                <div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <i class="bi bi-check2"></i>
                    </h2>
                    <p className=" content-center">3 Internships</p>
                  </div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <i class="bi bi-check2"></i>
                    </h2>
                    <p className=" content-center">5 Internships</p>
                  </div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-x-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                      </svg>
                    </h2>
                    <p className=" content-center">Unlimited Internships</p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex justify-center">
              <button
                onClick={() => {
                  handleOrder(
                    300 - (300 * appliedCoupon.discount) / 100,
                    "INR",
                    "silver"
                  );
                }}
                className=" bg-blue-500 text-white rounded-full px-6 py-1.5 -mt-4"
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className=" w-1/3 mx-3 hover:scale-105 transition-all">
            <div className="flex justify-center">
              <h2 className=" text-white text-center text-xl font-bold py-1 px-2 w-fit bg-gold rounded-lg -mb-4">
                Gold
              </h2>
            </div>
            <div className=" bg-white shadow-md px-4 py-10 rounded-3xl w-full">
              <div className=" divide-y-2">
                <div className=" p-2">
                  <h2 className=" text-center text-lg font-bold">₹1000</h2>
                  <p className=" text-center font-medium text-slate-500">
                    monthly
                  </p>
                </div>
                <div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <i class="bi bi-check2"></i>
                    </h2>
                    <p className=" content-center">3 Internships</p>
                  </div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <i class="bi bi-check2"></i>
                    </h2>
                    <p className=" content-center">5 Internships</p>
                  </div>
                  <div className=" flex justify-between">
                    <h2 className=" content-center text-lg">
                      <i class="bi bi-check2"></i>
                    </h2>
                    <p className=" content-center">Unlimited Internships</p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex justify-center">
              <button
                onClick={() => {
                  handleOrder(
                    1000 - (1000 * appliedCoupon.discount) / 100,
                    "INR",
                    "gold"
                  );
                }}
                className=" bg-blue-500 text-white rounded-full px-6 py-1.5 -mt-4"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
        <div className=" flex justify-center w-full">
          <div className=" w-1/2">
            {coupons.map((coupon) => (
              <div className=" flex justify-between  w-full bg-white shadow-md rounded my-4 p-2">
                <div>
                  <p className=" text-slate-600 font-mono text-start">
                    {coupon.code}
                  </p>
                  <p className=" text-green-500 text-start">{`Flat ${coupon.discount}% Off`}</p>
                </div>
                <div className=" content-center">
                  <button
                    onClick={() => {
                      setAppliedCoupon(coupon);
                    }}
                    className={`${
                      appliedCoupon === coupon ? "bg-green-300" : "bg-green-400"
                    } text-white px-3 py-1 rounded-sm`}
                  >
                    {appliedCoupon === coupon ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
