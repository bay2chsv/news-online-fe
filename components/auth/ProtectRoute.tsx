// components/ProtectedRoute.js

import Cookies from "js-cookie";

import { useRouter } from "next/router";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect } from "react";

interface AuthProp {
  children: any;
  requiredRole: string[];
}

const ProtectedRoute = ({ children, requiredRole }: AuthProp) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const Role = Cookies.get("role") || "";
  const token = Cookies.get("refreshToken");
  useEffect(() => {
    if (!token) {
      router.push("/");
    } else if (requiredRole && !requiredRole.includes(Role)) {
      router.push("/unauthorized");
    } else {
      setIsLoading(false);
    }
  }, [token, Role]); // Empty dependency array ensures this code only runs on the client-side
  return isLoading ? <Skeleton animation="wave" height={100} /> : children;
};

export default ProtectedRoute;
