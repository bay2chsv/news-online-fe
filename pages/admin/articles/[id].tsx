import React from "react";
import dynamic from "next/dynamic";
import { Box, Link } from "@mui/material";
import Breadcrumb from "@/components/Breadcrumb";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { baseUrl } from "@/utils/auth";
import { useRouter } from "next/router";
const CustomEditor = dynamic(
  () => {
    return import("../../../components/Dashboard/form/custom-editor-Update");
  },
  { ssr: false }
);
export const getServerSideProps: GetServerSideProps<{ repo: any; repo2: any }> = async (context) => {
  // Fetch data from external API

  const res = await fetch(`${baseUrl}/articles/${context.query.id}`); //192.168.20.19
  if (res.status === 400) {
    // Redirect to a 404 page
    return {
      redirect: {
        destination: "/404", // The path to your 404 page
        permanent: false,
      },
    };
  }
  const res2 = await fetch(`${baseUrl}/categories`); //192.168.20.19
  const repo2: any[] = await res2.json();
  const repo: any = await res.json();
  return { props: { repo, repo2 } };
};
const upadteArticles: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ repo, repo2 }) => {
  const router = useRouter();
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/admin">
      Admin
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/admin/articles">
      Articles
    </Link>,
    <Link underline="hover" key="3" color="inherit" href={`/admin/articles/${router.query.id}`}>
      Detail
    </Link>,
  ];
  return (
    <>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Box sx={{ m: 5 }} />
      <CustomEditor url={"admin"} bigData={repo} repo={repo2} />
    </>
  );
};

export default upadteArticles;
