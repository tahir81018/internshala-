import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import ResumeTemplate from "./ResumeTemplate";

const ResumeView = ({ user }) => {
  return (
    <div className=" fixed top-0 w-full z-50">
      <PDFViewer className="w-full h-screen">
        <ResumeTemplate user={user} />
      </PDFViewer>
    </div>
  );
};

export default ResumeView;
