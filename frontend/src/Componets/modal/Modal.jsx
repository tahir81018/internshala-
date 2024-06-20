import React from "react";

const Modal = ({ children, className, title, onClose, zIndex }) => {
  return (
    <div
      className={`${zIndex} fixed flex justify-self-center inset-0 w-screen overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity`}
    >
      <div className=" flex justify-center w-full">
        <div className={`${className} bg-white`}>
          <div className=" flex justify-end p-2">
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
          </div>
          <div className=" divide-y-2">
            <div className=" flex justify-center p-2">
              <h1 className=" text-center">{title}</h1>
            </div>
            <div className=" p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
