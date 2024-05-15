import React from "react";
import Head from "next/head";
import logo from "./image/2.jpg";
function LogoPage() {
  return (
    <div>
      <Head>
        <link rel="icon" href={logo.src} style={{ background: "#FFFFFF" }} />
      </Head>
    </div>
  );
}

export default LogoPage;
