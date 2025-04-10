import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicLanding from "./PublicLanding";
import AuthenticatedLanding from "./AuthenticatedLanding";

const LandingPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    // Redirect to specific dashboard if logged in
    if (user) {
      const redirectPaths = {
        doctor: "/doctor/schedule",
        admin: "/admin/dashboard",
      };
      if (redirectPaths[user.role]) {
        navigate(redirectPaths[user.role]);
      }
    }
  }, [user, navigate]);

  if (user && user.role === "patient") {
    return <AuthenticatedLanding user={user} />;
  }

  return <PublicLanding />;
};

export default LandingPage;
