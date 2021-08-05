import React from "react";

import CenteredLayout from "./CenteredLayout";
import Footer from "../Footer";

const PageLayout = ({ children, className }) => (
  <div
    className={`min-h-screen bg-gray-800 flex flex-col justify-between ${
      className ? className : ""
    }`}
  >
    <CenteredLayout>{children}</CenteredLayout>
    <CenteredLayout>
      <Footer />
    </CenteredLayout>
  </div>
);

export default PageLayout;
