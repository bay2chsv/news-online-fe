import { BaseConfig } from "@/utils/config";
import { Box, Button, Grid, Link, Paper, Typography } from "@mui/material";
import { green, grey, red, yellow } from "@mui/material/colors";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { parseCookies } from "nookies"; // khod d
import React from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { BarChart } from "@mui/x-charts/BarChart";
import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import AdminPageCSR from "@/components/AdminPageCSR";
import dynamic from "next/dynamic";

const CustomAdminPage = dynamic(
  () => {
    return import("@/components/AdminPageCSR");
  },
  { ssr: false }
);

export const getServerSideProps: GetServerSideProps<{ articleStatus: any; commentStatus: any; userStatus: any; activity: any }> = async (
  context
) => {
  // Fetch data from external API
  const cookies = parseCookies(context);

  // Retrieve accessToken from cookies
  const accessToken = cookies.accessToken;
  const res1 = await fetch(`http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}/dashboard/total-comments `, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const commentStatus: any = await res1.json();

  const res2 = await fetch(`http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}/dashboard/total-users `, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userStatus: any = await res2.json();
  const res = await fetch(`http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}/dashboard/total-articles`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const articleStatus: any = await res.json();

  const res3 = await fetch(`http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}/dashboard/activity-log`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const activity: any = await res3.json();
  return { props: { articleStatus, commentStatus, userStatus, activity } };
};

const admin: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  articleStatus,
  commentStatus,
  userStatus,
  activity,
}) => {
  return <CustomAdminPage activity={activity} articleStatus={articleStatus} commentStatus={commentStatus} userStatus={userStatus} />;
};

export default admin;
