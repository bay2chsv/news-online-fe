import React from "react";
import dynamic from "next/dynamic";
import { Box, Link } from "@mui/material";
import Breadcrumb from "@/components/Breadcrumb";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { baseUrl } from "@/utils/auth";

const CustomEditor = dynamic(
  () => {
    return import("../../../components/Dashboard/form/custom-editor");
  },
  { ssr: false }
);
interface Category {
  limit: Number;
  page: Number;
  totalItems: Number;
  totalPage: Number;
  data: Array<any>;
}

export const getServerSideProps: GetServerSideProps<{ repo: any }> = async () => {
  // Fetch data from external API
  try {
    const res = await fetch(`${baseUrl}/categories`); //192.168.20.19
    const repo: Category[] = await res.json();
    // Pass data to the page via props
    return { props: { repo } };
  } catch {
    return { props: { repo: null } };
  }
};
const index: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ repo }) => {
  const url = "admin";
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href={`/${url}`}>
      admin
    </Link>,
    <Link underline="hover" key="2" color="inherit" href={`/${url}/articles`}>
      articles
    </Link>,
    <Link underline="hover" key="2" color="inherit" href={`/${url}/articles/create`}>
      create
    </Link>,
  ];
  return (
    <>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Box sx={{ m: 5 }} />
      <CustomEditor url={url} repo={repo} />
    </>
  );
};

export default index;
