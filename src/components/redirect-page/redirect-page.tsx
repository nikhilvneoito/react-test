import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RedirectPage = () => {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("users-list");
  }, []);
  return <></>;
};
