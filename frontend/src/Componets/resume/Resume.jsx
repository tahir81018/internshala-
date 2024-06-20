import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../modal/Modal";
import { toast } from "react-toastify";
import axios from "axios";
import { RAZORPAY_KEY_ID, SERVER_BASE_URL } from "../../constants";
import ResumeTemplate from "./ResumeTemplate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Resume = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "",
    discount: 0,
  });
  const [otp, setOtp] = useState({
    code: null,
    amount: 0,
    currency: "",
  });
  const [confirmOtp, setConfirmOtp] = useState(undefined);
  const [paymentDetails, setPaymentDetails] = useState({
    orderId: null,
    currency: null,
    amount: null,
  });
  const [qualification, setQualification] = useState({
    degree: "",
    field: "",
    institute: "",
    score: "",
    passingYear: "",
  });
  const [experience, setExperience] = useState({
    role: "",
    company: "",
    location: "",
    fromYear: "",
    toYear: "",
  });

  const [resumePayload, setResumePayload] = useState({
    name: "",
    email: "",
    mobile: "",
    photo: undefined,
    qualifications: [],
    experiences: [],
    skills: [],
    personalDetails: {},
  });

  const navigate = useNavigate();

  const user = useSelector((state) => {
    return state.user.user;
  });

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

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const closePayModal = () => {
    setPayModalOpen(false);
  };
  const openPayModal = () => {
    setPayModalOpen(true);
  };

  const openOtpModal = () => {
    setOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setOtpModalOpen(false);
  };

  const makePayment = async (amount, currency, orderId) => {
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: amount,
      currency: currency,
      name: "Internshala",
      description: "Test Transaction",
      image: "http://localhost:3000/static/media/logo.90a444595bae5c4e157c.png",
      order_id: orderId,
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.mobile,
      },
      handler: function (response) {
        closePayModal();
        closeModal();
        const formData = new FormData();
        formData.append("image", resumePayload.photo);
        formData.append("resumePayload", JSON.stringify(resumePayload));
        formData.append("razorpayResponse", JSON.stringify(response));
        axios
          .post(
            `${process.env.SERVER_BASE_URL}/api/resume/varification`,
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
          .then((res) => {
            toast(res.data.message);
            navigate(0);
          })
          .catch((err) => {
            toast(err.message);
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

  const handleOrder = () => {
    closeOtpModal();
    if (otp.code.toString() !== confirmOtp) {
      toast("Invalid OTP");
      return;
    }
    axios
      .post(`${process.env.SERVER_BASE_URL}/api/resume/check-out`, {
        amount: otp.amount,
        currency: otp.currency,
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

  const handleOtp = (amount, currency) => {
    const date = new Date();
    if (date.getHours() !== 10) {
      toast("Our payment system is avalable between 10am-11am");
      return;
    }
    axios
      .get(`${process.env.SERVER_BASE_URL}/api/mail/send-otp`, {
        withCredentials: true,
      })
      .then((res) => {
        setOtp({ code: res.data.otp, amount: amount, currency: currency });
        toast(res.data.message);
        openOtpModal();
      })
      .catch((err) => {
        toast("Unable to send otp");
      });
  };

  const onCreateResume = (e) => {
    e.preventDefault();
    if (
      !(
        user.subscription.plan === "silver" || user.subscription.plan === "gold"
      )
    ) {
      toast("You are not subscribed to premium");
      openPayModal();
      return;
    }
    closeModal();
    const formData = new FormData();
    formData.append("image", resumePayload.photo);
    formData.append("resumePayload", JSON.stringify(resumePayload));
    axios
      .post(`${process.env.SERVER_BASE_URL}/api/resume/save`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res.data);
        toast(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        toast("Unable to create resume");
      });
  };

  return (
    <>
      <div className=" w-full flex justify-center">
        <div className=" mt-6 w-1/2">
          <h2 className=" text-center text-2xl font-semibold p-2">Resume</h2>

          <div className=" shadow-md rounded bg-white p-6 mb-6">
            {user.resume !== undefined ? (
              <div>
                <ResumeTemplate user={user} />
              </div>
            ) : (
              <div>
                <p>You have no resume created</p>
              </div>
            )}
            <div className=" flex justify-around p-2 mt-5">
              {user.resume !== undefined && (
                <>
                  <Link to={"/resume/view"}>
                    <button className=" bg-blue-500 text-white px-2 py-1 rounded">
                      View Resume
                    </button>
                  </Link>
                  <PDFDownloadLink
                    document={<ResumeTemplate user={user} />}
                    fileName="resume"
                  >
                    <button className=" bg-blue-500 px-2 py-1 rounded-sm text-white">
                      Download Resume
                    </button>
                  </PDFDownloadLink>
                </>
              )}
              <button
                onClick={openModal}
                className=" bg-blue-500 text-white px-2 py-1 rounded"
              >
                Create Resume
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
      {isOtpModalOpen && (
        <Modal
          className="h-fit my-auto"
          zIndex="z-50"
          onClose={closeOtpModal}
          title="Confirm OTP"
        >
          <div className=" divide-y-2">
            <div className=" flex flex-col">
              <label htmlFor="otp-input">Enter OTP here</label>
              <input
                type="number"
                onChange={(e) => {
                  setConfirmOtp(e.target.value);
                }}
                className="appearance-none hide-arrow p-1.5"
              />
            </div>
            <div className=" flex justify-around p-2 mt-4">
              <button
                onClick={handleOrder}
                className="text-white bg-green-400 rounded-sm py-1 px-3"
              >
                Confirm
              </button>
              <button
                onClick={closeOtpModal}
                className="text-white bg-orange-400 rounded-sm py-1 px-3"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isPayModalOpen && (
        <Modal className="h-fit my-auto" zIndex="z-40" onClose={closePayModal}>
          <div>
            <div>
              <p>You are not subscribed to premium.</p>
              <p>
                To create resume you have to pay ₹50 or to subscribe to premium{" "}
              </p>
            </div>
            <hr className=" my-3" />
            <div className=" flex justify-center w-full h-60 overflow-y-auto">
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
                          appliedCoupon === coupon
                            ? "bg-green-300"
                            : "bg-green-400"
                        } text-white px-3 py-1 rounded-sm`}
                      >
                        {appliedCoupon === coupon ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div className=" flex justify-around mt-3">
              <button
                onClick={() => {
                  handleOtp(50 - (50 * appliedCoupon.discount) / 100, "INR");
                }}
                className=" bg-blue-500 text-white px-3 py-1 rounded-sm"
              >
                Pay ₹50
              </button>
              <button
                onClick={closePayModal}
                className=" bg-orange-400 text-white px-3 py-1 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isModalVisible && (
        <Modal
          className="shadow-md rounded-md w-11/12 sm:w-3/4 lg:w-1/2 mt-10  h-fit"
          title="Create Resume"
          zIndex="z-10"
          onClose={closeModal}
        >
          <form onSubmit={onCreateResume}>
            <div className=" space-y-6">
              <div className=" flex justify-between space-x-4">
                <div className="flex flex-col space-y-1 w-3/4">
                  <label htmlFor="photo-input" className=" text-lg font-normal">
                    Photo
                  </label>
                  <input
                    id="photo-input"
                    type="file"
                    required
                    onChange={(e) => {
                      console.log(URL.createObjectURL(e.target.files[0]));
                      setResumePayload({
                        ...resumePayload,
                        photo: e.target.files[0],
                      });
                    }}
                    className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 "
                  />
                </div>
                <div className=" flex justify-center content-center w-1/4">
                  <img
                    src={
                      resumePayload.photo !== undefined
                        ? URL.createObjectURL(resumePayload.photo)
                        : ""
                    }
                    alt="ph"
                    className=" object-cover w-24 h-32 border-2 border-blue-300 p-1"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="name-input" className=" text-lg font-normal">
                  Name
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={resumePayload.name}
                  placeholder="Enter your name"
                  required
                  onChange={(e) => {
                    setResumePayload({
                      ...resumePayload,
                      name: e.target.value,
                    });
                  }}
                  className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 "
                />
              </div>
              <div className="flex flex-col space-y-1">
                <h2 className=" text-xl font-medium">Qualifications</h2>
                <hr />
                <div className=" grid grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="degree-input"
                      className=" text-lg font-normal"
                    >
                      Degree
                    </label>
                    <input
                      id="degree-input"
                      type="text"
                      value={qualification.degree}
                      onChange={(e) => {
                        setQualification({
                          ...qualification,
                          degree: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="field-input"
                      className=" text-lg font-normal"
                    >
                      Study Field
                    </label>
                    <input
                      id="field-input"
                      type="text"
                      value={qualification.field}
                      onChange={(e) => {
                        setQualification({
                          ...qualification,
                          field: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="institute-input"
                      className=" text-lg font-normal"
                    >
                      Institute
                    </label>
                    <input
                      id="institute-input"
                      type="text"
                      value={qualification.institute}
                      onChange={(e) => {
                        setQualification({
                          ...qualification,
                          institute: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="location-input"
                      className=" text-lg font-normal"
                    >
                      Location
                    </label>
                    <input
                      id="location-input"
                      type="text"
                      value={qualification.location}
                      onChange={(e) => {
                        setQualification({
                          ...qualification,
                          location: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="year-input"
                      className=" text-lg font-normal"
                    >
                      Passing Year
                    </label>
                    <input
                      id="year-input"
                      type="text"
                      value={qualification.passingYear}
                      onChange={(e) => {
                        setQualification({
                          ...qualification,
                          passingYear: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="flex justify-center">
                    <div className="content-end ">
                      <button
                        type="button"
                        onClick={() => {
                          setResumePayload({
                            ...resumePayload,
                            qualifications: [
                              ...resumePayload.qualifications,
                              qualification,
                            ],
                          });
                          setQualification({
                            degree: "",
                            field: "",
                            institute: "",
                            location: "",
                            passingYear: "",
                          });
                        }}
                        className=" bg-blue-500 text-white px-2 py-1 rounded-sm"
                      >
                        Add Qualification
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
                {resumePayload.qualifications.map((qualification, index) => (
                  <div className=" flex justify-between space-x-2" key={index}>
                    <p>
                      <span className=" text-lg font-medium">
                        {qualification.degree}
                      </span>{" "}
                      | {qualification.field} | {qualification.institute} |{" "}
                      {qualification.location} |{qualification.passingYear}
                    </p>
                    <div className=" content-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-x-lg"
                        viewBox="0 0 16 16"
                        onClick={() => {
                          const filteredQualifications =
                            resumePayload.qualifications.filter((q) => {
                              return q !== qualification;
                            });

                          setResumePayload({
                            ...resumePayload,
                            qualifications: filteredQualifications,
                          });
                        }}
                      >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-1">
                <h2 className=" text-xl font-medium">Experiences</h2>
                <hr />
                <div className=" grid grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="role-input"
                      className=" text-lg font-normal"
                    >
                      Role
                    </label>
                    <input
                      id="role-input"
                      type="text"
                      value={experience.role}
                      onChange={(e) => {
                        setExperience({ ...experience, role: e.target.value });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="company-input"
                      className=" text-lg font-normal"
                    >
                      Company
                    </label>
                    <input
                      id="company-input"
                      type="text"
                      value={experience.company}
                      onChange={(e) => {
                        setExperience({
                          ...experience,
                          company: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="location-input"
                      className=" text-lg font-normal"
                    >
                      Location
                    </label>
                    <input
                      id="location-input"
                      type="text"
                      value={experience.location}
                      onChange={(e) => {
                        setExperience({
                          ...experience,
                          location: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="from-input"
                      className=" text-lg font-normal"
                    >
                      From Year
                    </label>
                    <input
                      id="from-input"
                      type="text"
                      value={experience.fromYear}
                      onChange={(e) => {
                        setExperience({
                          ...experience,
                          fromYear: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label htmlFor="to-input" className=" text-lg font-normal">
                      To Year
                    </label>
                    <input
                      id="to-input"
                      type="text"
                      value={experience.toYear}
                      onChange={(e) => {
                        setExperience({
                          ...experience,
                          toYear: e.target.value,
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="flex justify-center">
                    <div className="content-end ">
                      <button
                        type="button"
                        onClick={() => {
                          setResumePayload({
                            ...resumePayload,
                            experiences: [
                              ...resumePayload.experiences,
                              experience,
                            ],
                          });
                          setExperience({
                            role: "",
                            company: "",
                            location: "",
                            fromYear: "",
                            toYear: "",
                          });
                        }}
                        className=" bg-blue-500 text-white px-2 py-1 rounded-sm"
                      >
                        Add Experience
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
                {resumePayload.experiences.map((experience) => (
                  <div className=" flex justify-start space-x-2">
                    <p>
                      <span className=" text-lg font-medium">
                        {experience.role}
                      </span>{" "}
                      | {experience.company} | {experience.location} |{" "}
                      {experience.fromYear} - {experience.toYear}
                    </p>
                    <div className=" content-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-x-lg"
                        viewBox="0 0 16 16"
                        onClick={() => {
                          const filteredExperiences =
                            resumePayload.experiences.filter((exp) => {
                              return exp !== experience;
                            });

                          setResumePayload({
                            ...resumePayload,
                            experiences: filteredExperiences,
                          });
                        }}
                      >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-1">
                <h2 className=" text-xl font-medium">Personal Details</h2>
                <hr />
                <div className=" grid grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="fathers-name-input"
                      className=" text-lg font-normal"
                    >
                      Fathers name
                    </label>
                    <input
                      id="fathers-name-input"
                      type="text"
                      value={resumePayload.personalDetails.fathersName}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            fathersName: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="mothers-name-input"
                      className=" text-lg font-normal"
                    >
                      Mothers Name
                    </label>
                    <input
                      id="mothers-name-input"
                      type="text"
                      value={resumePayload.personalDetails.mothersName}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            mothersName: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label htmlFor="dob-input" className=" text-lg font-normal">
                      Date Of Birth
                    </label>
                    <input
                      id="dob-input"
                      type="text"
                      value={resumePayload.personalDetails.dob}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            dob: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label htmlFor="sex-input" className=" text-lg font-normal">
                      Sex
                    </label>
                    <input
                      id="sex-input"
                      type="text"
                      value={resumePayload.personalDetails.sex}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            sex: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="blood-group-input"
                      className=" text-lg font-normal"
                    >
                      Blood Group
                    </label>
                    <input
                      id="blood-group-input"
                      type="text"
                      value={resumePayload.personalDetails.bloodGroup}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            bloodGroup: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="nationality-input"
                      className=" text-lg font-normal"
                    >
                      Nationality
                    </label>
                    <input
                      id="nationality-input"
                      type="text"
                      value={resumePayload.personalDetails.nationality}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            nationality: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="religion-input"
                      className=" text-lg font-normal"
                    >
                      Religion
                    </label>
                    <input
                      id="religion-input"
                      type="text"
                      value={resumePayload.personalDetails.religion}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            religion: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="marital-status-input"
                      className=" text-lg font-normal"
                    >
                      Marital Status
                    </label>
                    <input
                      id="marital-status-input"
                      type="text"
                      value={resumePayload.personalDetails.maritalStatus}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            maritalStatus: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label
                      htmlFor="address-input"
                      className=" text-lg font-normal"
                    >
                      Address
                    </label>
                    <input
                      id="address-input"
                      type="text"
                      value={resumePayload.personalDetails.address}
                      required
                      onChange={(e) => {
                        setResumePayload({
                          ...resumePayload,
                          personalDetails: {
                            ...resumePayload.personalDetails,
                            address: e.target.value,
                          },
                        });
                      }}
                      className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <h2 className=" text-xl font-medium">Skills</h2>
                <hr />
                <div>
                  <label
                    htmlFor="skills-input"
                    className=" text-lg font-normal"
                  >
                    Skills
                  </label>
                  <input
                    id="skills-input"
                    type="text"
                    placeholder="Please insert comma after each skill"
                    required
                    onChange={(e) => {
                      const txt = e.target.value.trim();
                      const skills = txt.split(",");
                      setResumePayload({ ...resumePayload, skills: skills });
                    }}
                    className=" appearance-none p-1.5 rounded-sm outline outline-2 outline-slate-300 focus:outline-blue-300 w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className=" flex justify-center p-6">
                  <button
                    type="submit"
                    className=" bg-blue-500 text-white px-2 py-1 rounded-sm"
                  >
                    Create Resume
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Resume;
