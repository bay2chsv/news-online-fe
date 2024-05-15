import React from "react";
import dynamic from "next/dynamic";
import { Box, Link } from "@mui/material";
import Breadcrumb from "@/components/Breadcrumb";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { baseUrl } from "@/utils/auth";

const CustomEditor = dynamic(
  () => {
    return import("../../../components/Dashboard/form/custom-editor.tsx");
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
  try {
    const res = await fetch(`${baseUrl}/categories`); //192.168.20.19
    const repo: Category[] = await res.json();
    return { props: { repo } };
  } catch {
    return { props: { repo: null } };
  }
};
const index: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ repo }) => {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/journalist">
      Journalist
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/journalist/articles">
      Articles
    </Link>,
    <Link underline="hover" key="3" color="inherit" href="/journalist/articles/create">
      Create
    </Link>,
  ];
  return (
    <>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Box sx={{ m: 5 }} />
      <CustomEditor url={"journalist"} repo={repo} />
    </>
  );
};

export default index;
