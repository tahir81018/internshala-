import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./deatil.css";
import axios from "axios";
import { toast } from "react-toastify";

function InternDeatil() {
  const [isDivVisible, setDivVisible] = useState(false);
  const [textare, setTextare] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  let search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("q");

  const user = useSelector((state) => {
    return state.user.user;
  });

  const show = () => {
    console.log(new Date(user.subscription.expireAt).getTime());
    console.log(Date.now());
    if (Date.now() > new Date(user.subscription.expireAt).getTime()) {
      toast("Your subscription hasbeen expired!");
      return;
    }
    if (user.subscription.appLeft <= 0) {
      toast("You have reached the maximum number of applications");
      return;
    }
    setDivVisible(true);
  };
  const hide = () => {
    setDivVisible(false);
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/internship/${id}`
      );
      setData(response.data);

      const { company, category } = response.data;
      setCompany(company);
      setCategory(category);
    };
    fetchData();
  });

  const submitApplication = async () => {
    const text = document.getElementById("text");
    if (text.value === "") {
      alert("Fill the mendetory fildes");
    } else {
      const bodyJson = {
        coverLetter: textare,
        category: category,
        company: company,
        user: user,
        Application: id,
      };

      await axios
        .post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/application`, bodyJson, {
          withCredentials: true,
        })
        .then((res) => {
          toast("You have applied successfully");
        })
        .catch((err) => {
          alert("error happend");
        });
      alert("Done");
      navigate("/Jobs");
    }
  };
  return (
    <div>
      <div className="details-app">
        <>
          <h1 className="font-bold text-3xl">{data.title}</h1>
          <div className="m-14 shadow-sm rounded-md border">
            <p className="mb-4 mt-3" id="boxer">
              {" "}
              <i className="bi bi-arrow-up-right text-blue-500"></i> Actively
              Hiring
            </p>
            <div className="main-info align-baseline mr-96 mt-7">
              <p className="text-xl font-bold mt-4"> {data.title}</p>
              <p className="text-sm text-slate-300 font-bold">{data.title}</p>
              <p>
                {" "}
                <i class="bi bi-geo-alt-fill"></i> {data.location}
              </p>
            </div>
            <div className="flex tedxt-sm justify-between">
              <p className="mt-3 text-slate-400">
                {" "}
                <i class="bi bi-play-circle-fill"></i> Start Date <br />{" "}
                {data.StartDate}
              </p>

              <p className="mt-3 text-slate-400">
                {" "}
                <i class="bi bi-calendar-check-fill"></i> Duration <br />
                {data.Duration}
              </p>

              <p className="mt-3 text-slate-400">
                {" "}
                <i class="bi bi-cash"></i> stipend <br /> {data.stipend}
              </p>
            </div>
            <div className="flex">
              <p className="bg-green-100 rounded-md ml-4 text-green-300">
                {" "}
                <i class="bi bi-clock"></i> 12/12/2012
              </p>
            </div>
            <hr />
            <div className="aboutCompany flex justify-start">
              <p className="mt-3 text-xl font-bold text-start">
                {" "}
                About {data.company}
              </p>
              <br />
            </div>
            <div className="flex">
              <p className="text-blue-500">
                {" "}
                instagram page <i className="bi bi-arrow-up-right-square"></i>
              </p>
            </div>
            <p className="mt-4"> {data.aboutCompany}</p>
            <div className="about-Job">
              <p className="mt-3 text-xl font-bold text-start"> about Job</p>
              <p>{data.aboutJob}</p>
            </div>
            <p className="text-blue-500 justify-start">
              {" "}
              Learn Business Communication
            </p>

            <div className="whocan">
              <p className="mt-3 text-xl font-bold text-start">Who can apply</p>
              <p>{data.Whocanapply}</p>
            </div>

            <p className="mt-3 text-xl font-bold text-start">Perks</p>
            <p>{data.perks}</p>

            <p className="mt-3 text-xl font-bold text-start">
              {" "}
              Additional information
            </p>
            <p>{data.AdditionalInfo}</p>

            <p className="mt-3 text-xl font-bold text-start">
              {" "}
              Number of opening
            </p>
            <p className="text-start">{data.numberOfopning}</p>
            <div className="flex justify-center m-6 w-full text-center  text-white font-bold ">
              <button
                className="w-40 bg-blue-500 rounded px-2 py-1"
                onClick={show}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      </div>
      {isDivVisible && (
        <>
          <div className="application-page">
            <div className="bg">
              <button className="close2" onClick={hide}>
                <i className="bi-bi-x"></i> close
              </button>
              <p>Applyion for {data.company}</p>
              <p className="mt-3 text-sm font-bold text-start mb-3">
                {data.aboutCompany}
              </p>
            </div>
            <div className="moreSteps">
              <p className="font-semibold text-xl">Your resume</p>
              <small>
                your current resume will be submitted along with the application
              </small>

              <p className="mt-5 font-semibold text-xl">Cover letter</p>
              <br />
              <p>why should we hire for this role?</p>
              <textarea
                name="coverLetter"
                placeholder=""
                id="text"
                value={textare}
                onChange={(e) => setTextare(e.target.value)}
              ></textarea>
              <p className="mt-5 font-semibold text-xl">your availiblity</p>
              <p>confirme your availiblity</p>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="Yes, I am available to join immediately"
                />
                Yes, I am available to join immediately
              </label>
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  value="No, I am currently on notice period"
                />
                No, I am currently on notice period
              </label>
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  value="No, I will have to serve notice period"
                />
                No, I will have to serve notice period
              </label>
            </div>

            <div>
              <label>
                <input type="radio" value="Other" />
                Other{" "}
                <span className="text-slate-500">
                  (Please specify your availability){" "}
                </span>
              </label>
            </div>
            <p className="mt-5 font-semibold text-xl">
              Custom resume <span className="text-slate-500">(Optional)</span>
            </p>
            <small className="text-slate-500">
              Employer can download and view this resume
            </small>

            <div className="submit flex justify-center">
              {user !== undefined ? (
                <button className="submit-btn" onClick={submitApplication}>
                  Submit application
                </button>
              ) : (
                <Link to={"/register"}>
                  <button className="submit-btn">Submit application</button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InternDeatil;
